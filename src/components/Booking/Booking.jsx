import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Booking.css';

const Booking = () => {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const guardada = localStorage.getItem('museo_reserva');
    if (guardada) setCita(JSON.parse(guardada));
  }, []);


  const agendar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/citas', {
        nombre,
        fecha
      });

      if (response.status === 201) {
        const nuevaCita = response.data;
        localStorage.setItem('museo_reserva', JSON.stringify(nuevaCita));
        setCita(nuevaCita);
      }
    } catch (error) {
      console.error("Error al agendar:", error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };


  const cancelarReserva = async () => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar tu visita?")) return;

    setLoading(true);
    try {
     
      await axios.delete(`http://localhost:5000/api/citas/${cita._id}`);
      
      localStorage.removeItem('museo_reserva');
      setCita(null);
      setNombre('');
      setFecha('');
      alert("Reserva eliminada de la nube con éxito.");
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Hubo un error al intentar cancelar la reserva.");
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
                <span>Fecha de Visita</span>
                <p>{cita.fecha}</p>
              </div>
              <div className="detail-item">
                <span>ID de Seguridad</span>
                <p className="id-text">{cita._id}</p>
              </div>
            </div>

            <div className="actions-group">
              <button 
                className="btn-cancel" 
                onClick={cancelarReserva} 
                disabled={loading}
              >
                {loading ? 'Cancelando...' : 'Cancelar Reserva'}
              </button>
            </div>
          </div>
        ) : (
          <form className="booking-form" onSubmit={agendar}>
            <span className="form-tag">Ticket Digital</span>
            <h2>Reserva tu Entrada</h2>
            <div className="inputs-wrapper">
              <input 
                type="text" 
                placeholder="Nombre completo" 
                value={nombre}
                required 
                onChange={e => setNombre(e.target.value)} 
              />
              <input 
                type="date" 
                value={fecha}
                required 
                onChange={e => setFecha(e.target.value)} 
              />
            </div>
            <button type="submit" className="btn-confirmar" disabled={loading}>
              {loading ? 'Procesando...' : 'Confirmar en MongoDB'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Booking;