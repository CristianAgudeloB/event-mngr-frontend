import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { getEvents, createEvent, deleteEvent, updateEvent } from '../services/eventService';

interface EventItem {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  userId: number;
}

interface EventFormValues {
  title: string;
  description: string;
  location: string;
  date: string;
}

const formatDateForInput = (dateStr: string): string =>
  new Date(dateStr).toISOString().slice(0, 16);

const swalOptions = {
  background: '#1a1a1a',
  color: '#ffffff'
};

const showEventFormModal = async (
  modalTitle: string,
  initialValues?: Partial<EventFormValues>
) => {
  return Swal.fire({
    title: modalTitle,
    html:
      `<input id="swal-title" class="swal2-input dark-input" placeholder="Título" value="${initialValues?.title || ''}" required>` +
      `<textarea id="swal-desc" class="swal2-textarea dark-input" placeholder="Descripción" rows="4" style="width: 100%; min-height: 100px; resize: vertical;"required>${initialValues?.description || ''}</textarea>` +
      `<input id="swal-loc" class="swal2-input dark-input" placeholder="Ubicación" value="${initialValues?.location || ''}" required>` +
      `<input id="swal-date" type="datetime-local" class="swal2-input dark-input" placeholder="Fecha" value="${
        initialValues?.date ? formatDateForInput(initialValues.date) : ''
      }" required>`,
    focusConfirm: false,
    ...swalOptions,
    showCloseButton: true,
    customClass: {
      popup: 'custom-swal-popup',
      input: 'dark-input',
      closeButton: 'swal2-close-button-dark'
    },
    preConfirm: () => {
      const title = (document.getElementById('swal-title') as HTMLInputElement)?.value;
      const description = (document.getElementById('swal-desc') as HTMLInputElement)?.value;
      const location = (document.getElementById('swal-loc') as HTMLInputElement)?.value;
      const date = (document.getElementById('swal-date') as HTMLInputElement)?.value;

      if (!title || !description || !location || !date) {
        Swal.showValidationMessage('Todos los campos son obligatorios');
        return null;
      }
      const selectedDate = new Date(date);
      const now = new Date();

      if (selectedDate.getTime() < now.getTime()) {
        Swal.showValidationMessage('La fecha debe ser futura');
        return null;
      }
    
      return { title, description, location, date };
    }
  });
};

const EventListPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'location'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();
  const userName = localStorage.getItem('name') || 'Usuario';
  const currentUserId = Number(localStorage.getItem('userId'));

  const fetchEvents = async (): Promise<void> => {
    try {
      const data = await getEvents();
      const userEvents = data.filter((evt: EventItem) => evt.userId === currentUserId);
      setEvents(userEvents);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al obtener eventos',
        text: 'No se pudieron cargar los eventos',
        ...swalOptions,
        showCloseButton: true,
        customClass: { closeButton: 'swal2-close-button-dark' }
      });
    }
  };

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split('-') as ['date' | 'title' | 'location', 'asc' | 'desc'];
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const sortedEvents = [...events].sort((a, b) => {
    const modifier = sortOrder === 'asc' ? 1 : -1;
    
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title) * modifier;
      case 'location':
        return a.location.localeCompare(b.location) * modifier;
      case 'date':
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * modifier;
      default:
        return 0;
    }
  });

  useEffect(() => {
    (async () => {
      await fetchEvents();
    })();
  }, []);

  const showEventDetails = (event: EventItem): void => {
    const eventDate = new Date(event.date);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };

    Swal.fire({
      title: event.title,
      html: `
        <div style="text-align: left;">
          <p><strong>Fecha:</strong> ${eventDate.toLocaleDateString('es-CO', options)}</p>
          <p><strong>Ubicación:</strong> ${event.location}</p>
          <p><strong>Descripción:</strong></p>
          <p>${event.description}</p>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: '600px',
      ...swalOptions,
      customClass: { popup: 'custom-swal-popup' }
    });
  };

  const handleCreateEvent = async (): Promise<void> => {
    const { value: formValues } = await showEventFormModal('Crear Evento');
    if (!formValues) return;

    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró el usuario logueado',
        ...swalOptions
      });
      return;
    }

    try {
      await createEvent({
        title: formValues.title,
        description: formValues.description,
        location: formValues.location,
        date: new Date(formValues.date).toISOString(),
        userId,
      });
      Swal.fire({
        title: 'Evento creado',
        icon: 'success',
        ...swalOptions
      });
      fetchEvents();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear evento',
        text: 'No se pudo crear el evento',
        ...swalOptions
      });
    }
  };

  const handleDeleteEvent = async (id: number): Promise<void> => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminará el evento',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      ...swalOptions,
      customClass: { popup: 'custom-swal-popup' }
    });

    if (result.isConfirmed) {
      try {
        await deleteEvent(id);
        Swal.fire({
          title: 'Eliminado',
          text: 'El evento fue eliminado',
          icon: 'success',
          ...swalOptions
        });
        fetchEvents();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar',
          text: 'No se pudo eliminar el evento',
          ...swalOptions
        });
      }
    }
  };

  const handleEditEvent = async (evt: EventItem): Promise<void> => {
    const { value: formValues } = await showEventFormModal('Editar Evento', {
      title: evt.title,
      description: evt.description,
      location: evt.location,
      date: evt.date,
    });
    if (!formValues) return;

    try {
      await updateEvent(evt.id, {
        title: formValues.title,
        description: formValues.description,
        location: formValues.location,
        date: new Date(formValues.date).toISOString(),
      });
      Swal.fire({
        title: 'Evento actualizado',
        icon: 'success',
        ...swalOptions
      });
      fetchEvents();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar evento',
        text: 'Revisa el formato de la fecha',
        ...swalOptions
      });
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div className="event-list-container">
      <header className="main-header">
        <div className="header-content">
          <h1 className="app-title">Gestor de Eventos</h1>
          <div className="user-section">
            <span className="user-greeting">Hola, {userName}</span>
            <button className="btn-logout" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
        </header>
      <div className="events-section">
        <div className="events-header">
          <h2>Mis Eventos</h2>
          <div className="events-header-controls">
            <select 
              className="sort-select"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="date-asc">Fecha (Ascendente)</option>
              <option value="date-desc">Fecha (Descendente)</option>
              <option value="title-asc">Nombre (A-Z)</option>
              <option value="title-desc">Nombre (Z-A)</option>
              <option value="location-asc">Ubicación (A-Z)</option>
              <option value="location-desc">Ubicación (Z-A)</option>
            </select>
            <button className="btn-primary" onClick={handleCreateEvent}>
              Crear Evento
            </button>
          </div>
        </div>
        <div className="events-list">
          {sortedEvents.length === 0 ? (
            <div className="no-events-message">No se encontraron eventos</div>
          ) : (
            sortedEvents.map((evt) => {
              const eventDate = new Date(evt.date);
              return (
                <div
                  className="event-item"
                  key={evt.id}
                  onClick={() => showEventDetails(evt)}
                >
                  <div className="event-info">
                    <h3 className="event-title" style={{ textAlign: 'left' }}>
                      {evt.title}
                    </h3>
                    <div className="event-details">
                      <span className="event-date">
                        {eventDate.toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="event-time">
                        {eventDate.toLocaleTimeString('es-CO', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                      <span className="event-location">📍 {evt.location}</span>
                    </div>
                  </div>
                  <div className="event-actions">
                    <button
                      className="icon-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditEvent(evt);
                      }}
                      aria-label="Editar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      className="icon-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(evt.id);
                      }}
                      aria-label="Eliminar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default EventListPage;
