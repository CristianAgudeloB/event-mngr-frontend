import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import { register } from '../services/authService';
import Swal from 'sweetalert2';

vi.mock('../services/authService', () => ({
  register: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<object>('react-router-dom')),
  useNavigate: () => mockNavigate,
}));

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  }
}));

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el formulario de registro correctamente', () => {
    render(
      <Router>
        <RegisterPage />
      </Router>
    );
  
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });
  
  it('debe mostrar error genérico', async () => {
    const error = { response: { data: { error: 'Error del servidor' } } };
    vi.mocked(register).mockRejectedValueOnce(error);
  
    render(
      <Router>
        <RegisterPage />
      </Router>
    );
  
    fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }));
  
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Error al registrar',
        text: 'Error del servidor',
        ...swalOptions
      });
    });
  });

  it('debe registrar exitosamente y redirigir', async () => {
    vi.mocked(register).mockResolvedValueOnce({});

    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    fireEvent.input(screen.getByLabelText(/nombre/i), { target: { value: 'Test User' } });
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByLabelText(/contraseña/i), { target: { value: 'password123' } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123');
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Ya puedes iniciar sesión',
        background: '#1a1a1a',
        color: '#ffffff',
        customClass: { popup: 'custom-swal-popup' }
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('debe mostrar error de contraseña corta', async () => {
    const error = { response: { status: 400 } };
    vi.mocked(register).mockRejectedValueOnce(error);

    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    fireEvent.input(screen.getByLabelText(/contraseña/i), { target: { value: 'short' } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Error al registrar',
        text: 'Verifica los datos',
        ...swalOptions
      });
    });
  });

  it('debe mostrar error genérico', async () => {
    const error = { response: { data: { error: 'Error del servidor' } } };
    vi.mocked(register).mockRejectedValueOnce(error);

    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Error al registrar',
        text: 'Error del servidor',
        ...swalOptions
      });
    });
  });

  it('debe navegar al login', () => {
    render(
      <Router>
        <RegisterPage />
      </Router>
    );

    const loginLink = screen.getByRole('link', { name: /inicia sesión aquí/i });
    expect(loginLink).toHaveAttribute('href', '/');
  });
});

const swalOptions = {
  background: '#1a1a1a',
  color: '#ffffff',
  customClass: { popup: 'custom-swal-popup' }
};