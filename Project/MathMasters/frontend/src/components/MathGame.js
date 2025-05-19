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

  // Lista dostępnych operacji
  const operations = ['add', 'subtract', 'multiply', 'divide'];

  useEffect(() => {
    generateNewProblem();
    fetchUserData();
  }, [operation]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:5000/api/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data?.bestStreak) {
        setBestStreak(response.data.bestStreak);
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
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
        const randomOp = operations[Math.floor(Math.random() * operations.length)];
        return generateNewProblem(randomOp);
    }

    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setMessage('');
  };

  const checkAnswer = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const currentOperation = operations.includes(operation) ? operation : 'add';
      let correctAnswer;

      switch(currentOperation) {
        case 'add': correctAnswer = num1 + num2; break;
        case 'subtract': correctAnswer = num1 - num2; break;
        case 'multiply': correctAnswer = num1 * num2; break;
        case 'divide': correctAnswer = num1 / num2; break;
      }

      const isCorrect = Math.abs(parseFloat(userAnswer) - correctAnswer) < 0.001;

      if (isCorrect) {
        setMessage('Correct! 🎉');
        const newStreak = streak + 1;
        setStreak(newStreak);
        setScore(score + 1);

        if (newStreak > bestStreak) {
          await updateBestStreak(newStreak);
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
      if (!token) return;

      await axios.patch(
        'http://localhost:5000/api/user/streak',
        { streak: newStreak },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setBestStreak(newStreak);
    } catch (error) {
      console.error('Error updating streak:', error);
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
    <div className="card">
      <h2>{getOperationName()}</h2>
      <div style={{ fontSize: '2em', margin: '20px 0' }}>
        {num1} {getOperationSymbol()} {num2} =
      </div>
      <input
        type="number"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && !isLoading && checkAnswer()}
        style={{ padding: '10px', fontSize: '1.2em' }}
        disabled={isLoading}
      />
      <button 
        className="button-primary" 
        onClick={checkAnswer}
        disabled={isLoading || !userAnswer}
      >
        {isLoading ? 'Checking...' : 'Check'}
      </button>
      
      {message && (
        <p style={{ color: message.includes('Correct') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <p>Current Streak: {streak}</p>
        <p>Best Streak: {bestStreak}</p>
        <p>Total Correct: {score}</p>
      </div>
    </div>
  );
};

export default MathGame;