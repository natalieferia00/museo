import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Booking.css';

const Booking = () => {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(false);


  const fechaHoy = new Date();
  const hoyStr = fechaHoy.toISOString().split("T")[0]; 
  
  const fechaLimite = new Date();
  fechaLimite.setFullYear(fechaHoy.getFullYear() + 30);
  const limiteStr = fechaLimite.toISOString().split("T")[0];

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

  const agendar = async (e) => {
    e.preventDefault();
    
    
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!soloLetras.test(nombre)) {
      alert("Por favor, usa solo letras en el nombre.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/citas', { nombre, fecha });
      localStorage.setItem('museo_reserva', JSON.stringify(response.data));
      setCita(response.data);
    } catch (error) {
      alert("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const cancelar = async () => {
    if (!window.confirm("¿Cancelar reserva?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/citas/${cita._id}`);
      localStorage.removeItem('museo_reserva');
      setCita(null);
      setNombre('');
      setFecha('');
    } catch (error) {
      alert("No se pudo eliminar.");
    }
  };

  return (
    <section className="booking-section">
      <div className="booking-container">
        {cita ? (
          <div className="confirmation-card">
            <h2>Reserva Confirmada</h2>
            <div className="ticket-details">
              <p><strong>Visitante:</strong> {cita.nombre}</p>
              <p><strong>Fecha:</strong> {cita.fecha}</p>
            </div>
            <button className="btn-cancel" onClick={cancelar}>Eliminar Reserva</button>
          </div>
        ) : (
          <form className="booking-form" onSubmit={agendar}>
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
                min={hoyStr} 
                max={limiteStr}
                required 
                onChange={e => setFecha(e.target.value)} 
              />
            </div>
            <button type="submit" className="btn-confirmar" disabled={loading}>
              {loading ? 'Cargando...' : 'Confirmar'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Booking;