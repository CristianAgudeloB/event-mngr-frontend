import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { login } from '../services/authService';

const swalOptions = {
  background: '#1a1a1a',
  color: '#ffffff',
  customClass: {
    popup: 'custom-swal-popup'
  }
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const { user, token } = await login(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id.toString());
      localStorage.setItem('name', user.name);
      navigate('/events');
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: error?.response?.data?.error || 'Verifica tus credenciales',
        ...swalOptions
      });
    }
  };

  return (
    <div>
      <header className="main-header">
        <div className="header-content">
          <h1 className="app-title">Gestor de Eventos</h1>
        </div>
      </header>

      <div className="auth-container">
        <div className="auth-header">
          <h2 className="auth-title">Iniciar Sesión</h2>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Iniciar Sesión
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="auth-link">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
