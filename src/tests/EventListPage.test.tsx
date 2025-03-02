import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import EventListPage from '../pages/EventListPage';
import { BrowserRouter as Router } from 'react-router-dom';
import { getEvents, deleteEvent } from '../services/eventService';
import Swal from 'sweetalert2';

vi.mock('../services/eventService', () => ({
  getEvents: vi.fn().mockResolvedValue([]),
  createEvent: vi.fn().mockResolvedValue({}),
  deleteEvent: vi.fn().mockResolvedValue({}),
  updateEvent: vi.fn().mockResolvedValue({}),
}));

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockResolvedValue({
      value: null,
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    }),
    showValidationMessage: vi.fn(),
  },
}));

const localStorageMock = {
  getItem: vi.fn(),
  removeItem: vi.fn(),
  setItem: vi.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('EventListPage', () => {
  const mockEvents = [
    {
      id: 1,
      title: 'Evento de prueba',
      description: 'Descripción del evento',
      location: 'Bogotá',
      date: '2024-03-20T15:00:00Z',
      userId: 1
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === 'userId') return '1';
      if (key === 'name') return 'Test User';
      return null;
    });
    vi.mocked(getEvents).mockImplementation(async () => mockEvents);
  });

  it('debe mostrar el mensaje de "No se encontraron eventos" cuando no hay eventos', async () => {
    vi.mocked(getEvents).mockResolvedValueOnce([]);
    
    render(
      <Router>
        <EventListPage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/No se encontraron eventos/i)).toBeInTheDocument();
    });
  });

  it('debe cargar y mostrar los eventos correctamente', async () => {    
    render(
      <Router>
        <EventListPage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText(/Evento de prueba/i)).toBeInTheDocument();
      expect(screen.getByText(/📍 Bogotá/i)).toBeInTheDocument();
    });
  });

  it('debe abrir el modal de creación de evento al hacer click en el botón', async () => {
    render(
      <Router>
        <EventListPage />
      </Router>
    );

    fireEvent.click(screen.getByText(/Crear Evento/i));
    
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Crear Evento' })
      );
    });
  });

  it('debe eliminar un evento después de confirmación', async () => {
    render(
      <Router>
        <EventListPage />
      </Router>
    );

    await waitFor(async () => {
      const deleteButtons = await screen.findAllByLabelText(/Eliminar/i);
      fireEvent.click(deleteButtons[0]);
    });

    expect(deleteEvent).toHaveBeenCalledWith(1);
  });

  it('debe manejar errores al cargar eventos', async () => {
    vi.mocked(getEvents).mockRejectedValueOnce(new Error('Error de red'));
    
    render(
      <Router>
        <EventListPage />
      </Router>
    );

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ 
          title: 'Error al obtener eventos',
          icon: 'error'
        })
      );
    });
  });

  it('debe cerrar sesión correctamente', async () => {
    render(
      <Router>
        <EventListPage />
      </Router>
    );

    fireEvent.click(screen.getByText(/Cerrar Sesión/i));
    
    await waitFor(() => {
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('userId');
    });
  });

  it('debe mostrar el formulario de edición con los datos correctos', async () => {
    render(
      <Router>
        <EventListPage />
      </Router>
    );

    await waitFor(async () => {
      const editButtons = await screen.findAllByLabelText(/Editar/i);
      fireEvent.click(editButtons[0]);
    });

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Editar Evento',
        html: expect.stringContaining('Evento de prueba')
      })
    );
  });
});
