import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Booking.css';

const Booking = () => {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(false);

  // URL de tu API en Render (Sustituye por tu URL real si es diferente)
  const API_URL = "https://backend-museo.onrender.com/api/citas";

  // --- Lógica de Fechas Seguras ---
  const fechaHoy = new Date();
  const hoyStr = fechaHoy.toISOString().split("T")[0]; // Bloquea fechas pasadas
  
  const fechaLimite = new Date();
  fechaLimite.setFullYear(fechaHoy.getFullYear() + 30);
  const limiteStr = fechaLimite.toISOString().split("T")[0]; // Límite 30 años

  // Cargar reserva persistente al iniciar
  useEffect(() => {
    const guardada = localStorage.getItem('museo_reserva');
    if (guardada) {
      try {
        setCita(JSON.parse(guardada));
      } catch (e) {
        localStorage.removeItem('museo_reserva');
      }
    }
  }, []);

  // Bloqueo de números y caracteres especiales en tiempo real
  const handleNombreChange = (e) => {
    const valor = e.target.value;
    const soloLetras = valor.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    setNombre(soloLetras);
  };

  const agendar = async (e) => {
    e.preventDefault();
    
    // Validación de seguridad extra antes de enviar
    if (nombre.trim().length < 3) {
      alert("Por favor, ingresa un nombre válido.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_URL, { nombre, fecha });
      
      // Sincronización con LocalStorage y Estado
      localStorage.setItem('museo_reserva', JSON.stringify(response.data));
      setCita(response.data);
      alert("¡Reserva confirmada en la nube!");
    } catch (error) {
      console.error("Error al agendar:", error);
      alert("Error de conexión con el servidor. Verifica que el backend esté activo.");
    } finally {
      setLoading(false);
    }
  };

  const cancelarReserva = async () => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar tu visita?")) return;

    setLoading(true);
    try {
      // Eliminar de MongoDB Atlas a través de la API
      await axios.delete(`${API_URL}/${cita._id}`);
      
      localStorage.removeItem('museo_reserva');
      setCita(null);
      setNombre('');
      setFecha('');
      alert("Reserva eliminada con éxito.");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo cancelar la reserva.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="booking-section">
      <div className="booking-container">
        {cita ? (
          <div className="confirmation-card">
            <div className="status-badge">Reserva Activa</div>
            <h2>¡Todo listo, {cita.nombre.split(' ')[0]}!</h2>
            
            <div className="ticket-details">
              <div className="detail-item">
                <span>Visitante</span>
                <p>{cita.nombre}</p>
              </div>
              <div className="detail-item">
                <span>Fecha de Visita</span>
                <p>{cita.fecha}</p>
              </div>
              <div className="detail-item">
                <span>ID de Seguridad (Nube)</span>
                <p className="id-text">{cita._id}</p>
              </div>
            </div>

            <button 
              className="btn-cancel" 
              onClick={cancelarReserva} 
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Eliminar Reserva'}
            </button>
          </div>
        ) : (
          <form className="booking-form" onSubmit={agendar}>
            <span className="form-tag">Ticket Digital</span>
            <h2>Reserva tu Entrada</h2>
            <div className="inputs-wrapper">
              <input 
                type="text" 
                placeholder="Tu nombre (solo letras)" 
                value={nombre}
                required 
                onChange={handleNombreChange} 
              />
              <input 
                type="date" 
                value={fecha}
                min={hoyStr}
                max={limiteStr}
                required 
                onChange={e => setFecha(e.target.value)} 
              />
            </div>
            <button type="submit" className="btn-confirmar" disabled={loading}>
              {loading ? 'Guardando en la nube...' : 'Confirmar Reserva'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Booking;