import React from 'react';
import { useParams } from 'react-router-dom';
import MathGame from '../components/MathGame';

const PracticePage = () => {
  const { operation } = useParams();
  
  return (
    <div className="page">
      <h2>Math Practice</h2>
      <MathGame operation={operation || 'mix'} />
    </div>
  );
};

export default PracticePage;