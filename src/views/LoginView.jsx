import React, { useState } from 'react';
import StepWrapper from '../components/StepWrapper';

const LoginView = ({ userSettings, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    onLoginSuccess(); // El App.jsx decidirá si mostrar Wizard o Home
  };

  return (
    <StepWrapper userSettings={userSettings}>
      <div style={{ textAlign: 'center' }}>
        <h2>Bienvenido a Banco Inclusivo</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Ingresa con tu cuenta para continuar
        </p>

        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #ccc',
                marginTop: '5px',
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #ccc',
                marginTop: '5px',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#0078D4',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: '0.3s',
            }}
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </StepWrapper>
  );
};

export default LoginView;
