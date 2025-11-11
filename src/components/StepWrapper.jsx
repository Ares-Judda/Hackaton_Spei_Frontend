// src/components/StepWrapper.jsx
import React from 'react';

const StepWrapper = ({ children, userSettings }) => {
  const theme = userSettings?.theme || 'light';
  const font = userSettings?.font || 'Segoe UI';
  const fontSize = userSettings?.fontSize || '16px';

  const backgroundColor = theme === 'dark' ? '#1e1e1e' : '#f3f3f3';
  const textColor = theme === 'dark' ? '#f5f5f5' : '#333';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        fontFamily: font,
        fontSize,
        color: textColor,
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          width: '350px',
          backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default StepWrapper;
