import React, { useEffect } from 'react';
import AppWrapper from '../components/AppWrapper';
import { useFormController } from '../controllers/formController';

// Función TTS
function speakText(text) {
  if (typeof window === 'undefined') return;
  if (!('speechSynthesis' in window)) {
    console.warn('speechSynthesis no disponible en este navegador.');
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'es-MX';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

const WizardView = ({ onFinish }) => {
  const { userSettings, updateTheme, saveAnswer } = useFormController();

  const fontSizeStyle = { fontSize: userSettings.fontSize };

  // Control automático de lectura según lector de pantalla
  useEffect(() => {
    if (userSettings.usesScreenReader !== false) {
      speakText('Bienvenido al cuestionario de accesibilidad');
    } else {
      window.speechSynthesis.cancel();
    }
  }, [userSettings.usesScreenReader]);

  const isScreenReaderActive = userSettings.usesScreenReader !== false;

  return (
    <AppWrapper userSettings={userSettings}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          minHeight: '80vh',
          justifyContent: 'center',
        }}
      >
        {/* Nombre */}
        <div>
          <h2 style={fontSizeStyle}>
            ¿Cómo te llamamos?
            {isScreenReaderActive && (
              <button
                onClick={() => speakText('¿Cómo te llamamos?')}
                style={{ marginLeft: '10px', fontSize: '0.8em', padding: '2px 6px' }}
              >
                🔊
              </button>
            )}
          </h2>
          <input
            type="text"
            placeholder="Ej. María"
            value={userSettings.name}
            onChange={(e) => saveAnswer('name', e.target.value)}
            style={{
              ...fontSizeStyle,
              padding: 'calc(6px + 0.3em)',
              borderRadius: '10px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
        </div>

        {/* Edad */}
        <div>
          <h2 style={fontSizeStyle}>
            Tu rango de edad
            {isScreenReaderActive && (
              <button
                onClick={() => speakText('Tu rango de edad')}
                style={{ marginLeft: '10px', fontSize: '0.8em', padding: '2px 6px' }}
              >
                🔊
              </button>
            )}
          </h2>
          <select
            value={userSettings.ageRange}
            onChange={(e) => saveAnswer('ageRange', e.target.value)}
            style={{
              ...fontSizeStyle,
              padding: 'calc(6px + 0.3em)',
              borderRadius: '10px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          >
            <option value="18_30">18 a 30 años</option>
            <option value="31_50">31 a 50 años</option>
            <option value="51_60">51 a 60 años</option>
            <option value="60_plus">Más de 60 años</option>
          </select>
        </div>

        {/* Lectura */}
        <div>
          <h2 style={fontSizeStyle}>
            ¿Te cuesta leer texto pequeño?
            {isScreenReaderActive && (
              <button
                onClick={() => speakText('¿Te cuesta leer texto pequeño?')}
                style={{ marginLeft: '10px', fontSize: '0.8em', padding: '2px 6px' }}
              >
                🔊
              </button>
            )}
          </h2>
          <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            {['Sí, prefiero letra grande', 'No, puedo leer bien'].map((label, idx) => {
              const value = idx === 0 ? false : true;
              const active = userSettings.canReadSmallText === value;
              return (
                <button
                  key={label}
                  onClick={() => saveAnswer('canReadSmallText', value)}
                  onMouseEnter={() => isScreenReaderActive && speakText(label)}
                  disabled={!isScreenReaderActive}
                  style={{
                    flex: 1,
                    padding: 'calc(6px + 0.3em)',
                    borderRadius: '10px',
                    border: active ? '2px solid #4caf50' : '1px solid #ccc',
                    backgroundColor: active ? '#0078D4' : '#fff',
                    color: active ? '#fff' : '#333',
                    cursor: !isScreenReaderActive ? 'not-allowed' : 'pointer',
                    opacity: !isScreenReaderActive ? 0.5 : 1,
                    ...fontSizeStyle,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lector de pantalla */}
        <div>
          <h2 style={fontSizeStyle}>
            ¿Usas lector de pantalla?
            {isScreenReaderActive && (
              <button
                onClick={() => speakText('¿Usas lector de pantalla?')}
                style={{ marginLeft: '10px', fontSize: '0.8em', padding: '2px 6px' }}
              >
                🔊
              </button>
            )}
          </h2>
          <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            {['Sí', 'No'].map((label, idx) => {
              const value = idx === 0;
              const active = userSettings.usesScreenReader === value;
              return (
                <button
                  key={label}
                  onClick={() => saveAnswer('usesScreenReader', value)}
                  onMouseEnter={() => isScreenReaderActive && speakText(label)}
                  style={{
                    flex: 1,
                    padding: 'calc(6px + 0.3em)',
                    borderRadius: '10px',
                    border: active ? '2px solid #4caf50' : '1px solid #ccc',
                    backgroundColor: active ? '#0078D4' : '#fff',
                    color: active ? '#fff' : '#333',
                    cursor: 'pointer',
                    ...fontSizeStyle,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Confianza */}
        <div>
          <h2 style={fontSizeStyle}>
            ¿Qué tan cómoda te sientes usando apps?
            {isScreenReaderActive && (
              <button
                onClick={() => speakText('¿Qué tan cómoda te sientes usando apps?')}
                style={{ marginLeft: '10px', fontSize: '0.8em', padding: '2px 6px' }}
              >
                🔊
              </button>
            )}
          </h2>
          <select
            value={userSettings.confidence}
            onChange={(e) => saveAnswer('confidence', e.target.value)}
            style={{
              ...fontSizeStyle,
              padding: 'calc(6px + 0.3em)',
              borderRadius: '10px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          >
            <option value="low">Me cuesta bastante</option>
            <option value="medium">Más o menos</option>
            <option value="high">Muy cómoda</option>
          </select>
        </div>

        {/* Literacy */}
        <div>
          <h2 style={fontSizeStyle}>
            ¿Qué tan fácil es para ti leer y escribir mensajes?
            {isScreenReaderActive && (
              <button
                onClick={() => speakText('¿Qué tan fácil es para ti leer y escribir mensajes?')}
                style={{ marginLeft: '10px', fontSize: '0.8em', padding: '2px 6px' }}
              >
                🔊
              </button>
            )}
          </h2>
          <select
            value={userSettings.literacy}
            onChange={(e) => saveAnswer('literacy', e.target.value)}
            style={{
              ...fontSizeStyle,
              padding: 'calc(6px + 0.3em)',
              borderRadius: '10px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          >
            <option value="low">Me cuesta leer o escribir mensajes largos</option>
            <option value="medium">A veces me cuesta</option>
            <option value="high">No tengo problemas</option>
          </select>
        </div>

        {/* Tema */}
        <div>
          <h2 style={fontSizeStyle}>
            Selecciona tema
            {isScreenReaderActive && (
              <button
                onClick={() => speakText('Selecciona tema')}
                style={{ marginLeft: '10px', fontSize: '0.8em', padding: '2px 6px' }}
              >
                🔊
              </button>
            )}
          </h2>
          <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
            {['light', 'dark'].map((theme) => (
              <div
                key={theme}
                onClick={() => updateTheme(theme)}
                onMouseEnter={() => isScreenReaderActive && speakText(theme === 'light' ? 'Claro' : 'Oscuro')}
                style={{
                  flex: 1,
                  padding: '20px',
                  cursor: 'pointer',
                  borderRadius: '10px',
                  border: userSettings.theme === theme ? '2px solid #4caf50' : '1px solid #ccc',
                  backgroundColor: theme === 'light' ? '#fff' : '#333',
                  color: theme === 'light' ? '#333' : '#f5f5f5',
                  textAlign: 'center',
                  ...fontSizeStyle,
                }}
              >
                {theme === 'light' ? 'Claro' : 'Oscuro'}
              </div>
            ))}
          </div>
        </div>

        {/* Botón Finalizar */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => onFinish(userSettings)}
            style={{ padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', ...fontSizeStyle }}
          >
            Finalizar
          </button>
        </div>
      </div>
    </AppWrapper>
  );
};

export default WizardView;
