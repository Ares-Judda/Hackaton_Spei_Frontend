import React from 'react';
import AppWrapper from '../components/AppWrapper';
import { useFormController } from '../controllers/formController';

const WizardView = ({ onFinish }) => {
  const { userSettings, updateTheme, saveAnswer } = useFormController();

  const fontSizeStyle = { fontSize: userSettings.fontSize, fontFamily: userSettings.font };

  return (
    <AppWrapper userSettings={userSettings}>
      <div style={{ maxHeight: '70vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Nombre */}
        <div>
          <h2 style={fontSizeStyle}>¿Cómo te llamamos?</h2>
          <input
            type="text"
            placeholder="Ej. María"
            value={userSettings.name}
            onChange={(e) => saveAnswer("name", e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              ...fontSizeStyle,
            }}
          />
        </div>

        {/* Edad */}
        <div>
          <h2 style={fontSizeStyle}>Tu rango de edad</h2>
          <select
            value={userSettings.ageRange}
            onChange={(e) => saveAnswer("ageRange", e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              ...fontSizeStyle,
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
          <h2 style={fontSizeStyle}>¿Te cuesta leer texto pequeño?</h2>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            {["Sí, prefiero letra grande", "No, puedo leer bien"].map((label, i) => {
              const value = i === 0 ? false : true;
              const selected = userSettings.canReadSmallText === value;
              return (
                <button
                  key={label}
                  onClick={() => saveAnswer("canReadSmallText", value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: selected ? '2px solid #4caf50' : '1px solid #ccc',
                    backgroundColor: selected ? '#0078D4' : '#fff',
                    color: selected ? '#fff' : '#333',
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

        {/* Lector de pantalla */}
        <div>
          <h2 style={fontSizeStyle}>¿Usas lector de pantalla?</h2>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            {[true, false].map((value) => {
              const selected = userSettings.usesScreenReader === value;
              return (
                <button
                  key={value.toString()}
                  onClick={() => saveAnswer("usesScreenReader", value)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: selected ? '2px solid #4caf50' : '1px solid #ccc',
                    backgroundColor: selected ? '#0078D4' : '#fff',
                    color: selected ? '#fff' : '#333',
                    cursor: 'pointer',
                    ...fontSizeStyle,
                  }}
                >
                  {value ? "Sí" : "No"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Confianza */}
        <div>
          <h2 style={fontSizeStyle}>¿Qué tan cómoda te sientes usando apps?</h2>
          <select
            value={userSettings.confidence}
            onChange={(e) => saveAnswer("confidence", e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              ...fontSizeStyle,
            }}
          >
            <option value="low">Me cuesta bastante</option>
            <option value="medium">Más o menos</option>
            <option value="high">Muy cómoda</option>
          </select>
        </div>

        {/* Literacy */}
        <div>
          <h2 style={fontSizeStyle}>¿Qué tan fácil es para ti leer y escribir mensajes?</h2>
          <select
            value={userSettings.literacy}
            onChange={(e) => saveAnswer("literacy", e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ccc',
              ...fontSizeStyle,
            }}
          >
            <option value="low">Me cuesta leer o escribir mensajes largos</option>
            <option value="medium">A veces me cuesta</option>
            <option value="high">No tengo problemas</option>
          </select>
        </div>

        {/* Tema */}
        <div>
          <h2 style={fontSizeStyle}>Selecciona tema</h2>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            {['light', 'dark'].map((theme) => {
              const selected = userSettings.theme === theme;
              return (
                <div
                  key={theme}
                  onClick={() => updateTheme(theme)}
                  style={{
                    flex: 1,
                    padding: '20px',
                    cursor: 'pointer',
                    borderRadius: '10px',
                    border: selected ? '2px solid #4caf50' : '1px solid #ccc',
                    backgroundColor: theme === 'light' ? '#fff' : '#333',
                    color: theme === 'light' ? '#333' : '#f5f5f5',
                    textAlign: 'center',
                    ...fontSizeStyle,
                  }}
                >
                  {theme === 'light' ? 'Claro' : 'Oscuro'}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Botón finalizar */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => onFinish(userSettings)}
          style={{ padding: '12px 20px', ...fontSizeStyle }}
        >
          Finalizar
        </button>
      </div>
    </AppWrapper>
  );
};

export default WizardView;
