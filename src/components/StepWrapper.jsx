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
        width: '40vw',
        height: '100vh', // ⚡ body siempre ocupa toda la pantalla
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
        fontFamily: font,
        fontSize,
        color: textColor,
        transition: 'all 0.3s ease',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '400px',       // ⚡ ancho fijo
          minHeight: '100px',   // ⚡ altura mínima fija
          maxHeight: '90vh',    // ⚡ no se salga de la pantalla
          overflowY: 'auto',    // ⚡ scroll si el contenido crece
          backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff',
          padding: '20px',
          borderRadius: '20px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default StepWrapper;
