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
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px', // ancho similar al HomeView
          backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff',
          padding: '20px',   // reducimos padding para ganar espacio interno
          borderRadius: '20px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          position: 'relative',
          boxSizing: 'border-box', // ⚡ importante para que padding no reduzca el ancho
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default StepWrapper;
