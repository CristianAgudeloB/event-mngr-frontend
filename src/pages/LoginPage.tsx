import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { login } from '../services/authService';
import AuthForm from './AuthForm';

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
      let errorMessage = 'Verifica los datos';

      if (error?.response) {
        const { status, data } = error.response;
        if (data.message) {
          if (data.message.includes('match pattern')) {
            errorMessage = 'El email no tiene un formato válido';
          } else {
            errorMessage = data.message;
          }
        } else if (data.error) {
          errorMessage = data.error;
        } else if (status === 400) {
          errorMessage = 'Verifica los datos';
        }
      }

      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: errorMessage,
        ...swalOptions
      });
    }
  };

  return (
    <AuthForm
      title="Iniciar Sesión"
      onSubmit={handleLogin}
      submitButtonText="Iniciar Sesión"
      footer={
        <p>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="auth-link">
            Regístrate aquí
          </Link>
        </p>
      }
    >
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
    </AuthForm>
  );
};

export default LoginPage;
