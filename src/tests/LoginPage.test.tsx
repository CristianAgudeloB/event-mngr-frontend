// LoginPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { login } from '../services/authService';
import Swal from 'sweetalert2';

vi.mock('../services/authService', () => ({
  login: vi.fn(),
}));

vi.mock('sweetalert2', () => ({
    default: {
      fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
      showValidationMessage: vi.fn(),
    }
  }));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<object>('react-router-dom')),
  useNavigate: () => mockNavigate,
}));

const localStorageMock = {
  setItem: vi.fn(),
  getItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('LoginPage', () => {
  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.setItem.mockClear();
  });
  

  it('debe renderizar el formulario de login correctamente', () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.getByText(/¿No tienes cuenta?/i)).toBeInTheDocument();
  });

  it('debe realizar el login exitosamente', async () => {
    vi.mocked(login).mockResolvedValueOnce({
      user: mockUser,
      token: 'fake-token'
    });

    render(
      <Router>
        <LoginPage />
      </Router>
    );

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });

    fireEvent.input(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'fake-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('userId', '1');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('name', 'Test User');
      expect(mockNavigate).toHaveBeenCalledWith('/events');
    });
  });

  it('debe mostrar error cuando las credenciales son incorrectas', async () => {
    const error = { 
      response: { 
        data: { error: 'Credenciales inválidas' } 
      } 
    };
    vi.mocked(login).mockRejectedValueOnce(error);
  
    render(
      <Router>
        <LoginPage />
      </Router>
    );
  
    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.input(screen.getByLabelText(/contraseña/i), {
      target: { value: 'wrong-password' }
    });
  
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));
  
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: 'Credenciales inválidas',
          background: '#1a1a1a',
          color: '#ffffff',
          customClass: {
            popup: 'custom-swal-popup'
          }
        })
      );
    });
  });

  it('debe navegar a la página de registro', () => {
    render(
      <Router>
        <LoginPage />
      </Router>
    );

    const registerLink = screen.getByRole('link', { name: /regístrate aquí/i });
    expect(registerLink).toHaveAttribute('href', '/register');
  });
});