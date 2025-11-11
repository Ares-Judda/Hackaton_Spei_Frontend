import React, { useState, useEffect } from 'react';
import StepWrapper from '../components/StepWrapper';

const LoginView = ({ userSettings, onLoginSuccess, onShowQuestionnaire, hasSeenQuestionnaire }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!hasSeenQuestionnaire) { // 👈 solo mostramos si no lo ha visto
      const timer = setTimeout(() => setShowPopup(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenQuestionnaire]);

  const handleLogin = (e) => {
    e.preventDefault();
    onLoginSuccess();
  };

  const handleQuestionnaireResponse = (accept) => {
    setShowPopup(false);
    if (accept) {
      onShowQuestionnaire();
    } else {
      alert('Perfecto. El cuestionario estará disponible cuando lo necesites.');
    }
  };

  return (
    <StepWrapper userSettings={userSettings}>
      <div style={{ textAlign: 'center' }}>
        <h2>Bienvenido a Banco Inclusivo</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Ingresa con tu cuenta para continuar</p>

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

      {showPopup && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            zIndex: 1000,
            textAlign: 'center',
            width: '300px',
          }}
        >
          <h3>¿Deseas responder el cuestionario de accesibilidad?</h3>
          <p style={{ color: '#666' }}>Podrás personalizar tu experiencia visual y auditiva.</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button
              onClick={() => handleQuestionnaireResponse(true)}
              style={{
                flex: 1,
                marginRight: '10px',
                backgroundColor: '#0078D4',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '10px',
                cursor: 'pointer',
              }}
            >
              Sí, claro
            </button>
            <button
              onClick={() => handleQuestionnaireResponse(false)}
              style={{
                flex: 1,
                backgroundColor: '#E5E5E5',
                border: 'none',
                borderRadius: '10px',
                padding: '10px',
                cursor: 'pointer',
              }}
            >
              No, gracias
            </button>
          </div>
        </div>
      )}
    </StepWrapper>
  );
};

export default LoginView;
