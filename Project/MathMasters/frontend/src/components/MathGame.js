import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const MathGame = () => {
  const { operation = 'add' } = useParams();
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const operations = ['add', 'subtract', 'multiply', 'divide'];

  useEffect(() => {
  generateNewProblem();
  fetchUserData();
}, [operation]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping user data fetch');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data?.bestStreak) {
        setBestStreak(response.data.bestStreak);
      }
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data?.message || error.message);
    }
  };

  const generateNewProblem = () => {
    const currentOperation = operations.includes(operation) ? operation : 'add';
    let n1, n2;

    switch(currentOperation) {
      case 'add':
        n1 = Math.floor(Math.random() * 50);
        n2 = Math.floor(Math.random() * 50);
        break;
      case 'subtract':
        n1 = Math.floor(Math.random() * 50);
        n2 = Math.floor(Math.random() * n1);
        break;
      case 'multiply':
        n1 = Math.floor(Math.random() * 12);
        n2 = Math.floor(Math.random() * 12);
        break;
      case 'divide':
        n2 = Math.floor(Math.random() * 10) + 1;
        n1 = n2 * Math.floor(Math.random() * 10);
        break;
      default:
        return generateNewProblem('add');
    }

    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setMessage('');
  };

  const checkAnswer = async () => {
    if (isLoading || !userAnswer) return;
    setIsLoading(true);
    setMessage('');

    try {
      const currentOperation = operations.includes(operation) ? operation : 'add';
      let correctAnswer;

      switch(currentOperation) {
        case 'add': correctAnswer = num1 + num2; break;
        case 'subtract': correctAnswer = num1 - num2; break;
        case 'multiply': correctAnswer = num1 * num2; break;
        case 'divide': correctAnswer = num1 / num2; break;
        default: break;
      }

      const isCorrect = Math.abs(parseFloat(userAnswer) - correctAnswer) < 0.001;

      if (isCorrect) {
        setMessage('Correct! 🎉');
        const newStreak = streak + 1;
        setStreak(newStreak);
        setScore(score + 1);

        try {
          await updateBestStreak(newStreak);
        } catch (error) {
          console.error('Failed to update streak:', error);
        }
        
        setTimeout(generateNewProblem, 1000);
      } else {
        setMessage(`Incorrect. The answer was ${correctAnswer}`);
        setStreak(0);
        setTimeout(generateNewProblem, 1500);
      }
    } catch (error) {
      console.error('Error checking answer:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBestStreak = async (newStreak) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token, skipping streak update');
        return;
      }

      const response = await axios.patch(
        'http://localhost:5000/api/user/streak',
        { streak: newStreak },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data?.bestStreak) {
        setBestStreak(response.data.bestStreak);
      }
    } catch (error) {
      console.error('Error updating streak:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const getOperationSymbol = () => {
    const currentOperation = operations.includes(operation) ? operation : 'add';
    
    switch(currentOperation) {
      case 'add': return '+';
      case 'subtract': return '-';
      case 'multiply': return '×';
      case 'divide': return '÷';
      default: return '+';
    }
  };

  const getOperationName = () => {
    const currentOperation = operations.includes(operation) ? operation : 'add';
    
    switch(currentOperation) {
      case 'add': return 'Addition';
      case 'subtract': return 'Subtraction';
      case 'multiply': return 'Multiplication';
      case 'divide': return 'Division';
      default: return 'Math Practice';
    }
  };

  return (
    <div style={{ 
      maxWidth: '500px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ textAlign: 'center' }}>{getOperationName()}</h2>
      <div style={{ 
        fontSize: '2em', 
        margin: '20px 0',
        textAlign: 'center' 
      }}>
        {num1} {getOperationSymbol()} {num2} =
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
          style={{ 
            padding: '10px', 
            fontSize: '1.2em',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
          disabled={isLoading}
        />
        <button 
          onClick={checkAnswer}
          disabled={isLoading || !userAnswer}
          style={{
            padding: '10px',
            fontSize: '1em',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isLoading ? 'Checking...' : 'Check'}
        </button>
      </div>
      
      {message && (
        <p style={{ 
          color: message.includes('Correct') ? 'green' : 'red',
          textAlign: 'center',
          margin: '15px 0'
        }}>
          {message}
        </p>
      )}
      
      <div style={{ 
        marginTop: '20px',
        textAlign: 'center'
      }}>
        <p>Current Streak: {streak}</p>
        <p>Best Streak: {bestStreak}</p>
        <p>Total Correct: {score}</p>
      </div>
    </div>
  );
};

export default MathGame;