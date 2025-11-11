import React from 'react';

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div style={{ width: '100%', height: '10px', background: '#ddd', borderRadius: '5px', marginBottom: '20px' }}>
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          background: '#4caf50',
          borderRadius: '5px',
          transition: 'width 0.3s ease',
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
