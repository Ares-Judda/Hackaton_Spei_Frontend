// src/controllers/loginController.js
export const loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "demo@banco.com" && password === "1234") {
        resolve({ success: true, message: "Inicio de sesión exitoso" });
      } else {
        reject({ success: false, message: "Credenciales incorrectas" });
      }
    }, 1000);
  });
};
