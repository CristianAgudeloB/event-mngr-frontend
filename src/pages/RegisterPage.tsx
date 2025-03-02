import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { register } from '../services/authService';

const swalOptions = {
  background: '#1a1a1a',
  color: '#ffffff',
  customClass: {
    popup: 'custom-swal-popup'
  }
};

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await register(name, email, password);
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Ya puedes iniciar sesión',
        ...swalOptions
      });
      navigate('/');
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text:
          error?.response?.status === 400
            ? 'Verifica los datos'
            : error?.response?.data?.error || 'Verifica los datos',
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
          <h2 className="auth-title">Crear Cuenta</h2>
        </div>

        <form className="auth-form" role="form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            Registrarse
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link to="/" className="auth-link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
