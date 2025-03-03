import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { register } from '../services/authService';
import AuthForm from './AuthForm';

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
      let errorMessage = 'Verifica los datos';

      if (error?.response) {
        const { status, data } = error.response;
        if (data.message) {
          // Personalización para errores de validación basados en el OAS
          if (data.message.includes('match pattern')) {
            if (data.message.toLowerCase().includes('email')) {
              errorMessage = 'El email no tiene un formato válido';
            } else if (data.message.toLowerCase().includes('name')) {
              errorMessage = 'El nombre no tiene un formato válido';
            } else {
              errorMessage = data.message;
            }
          } else if (data.message.includes('password')) {
            if (data.message.toLowerCase().includes('password')) {
              errorMessage = 'La contraseña es demasiado corta';
            } else {
              errorMessage = data.message;
            }
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
        title: 'Error al registrar',
        text: errorMessage,
        ...swalOptions
      });
    }
  };

  return (
    <AuthForm
      title="Crear Cuenta"
      onSubmit={handleRegister}
      submitButtonText="Registrarse"
      footer={
        <p>
          ¿Ya tienes cuenta?{' '}
          <Link to="/" className="auth-link">
            Inicia sesión aquí
          </Link>
        </p>
      }
    >
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
    </AuthForm>
  );
};

export default RegisterPage;
