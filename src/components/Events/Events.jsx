import React from 'react';
import './Events.css';

const Events = () => {
  const eventos = [
    { id: 1, titulo: 'Renacimiento Vivo', fecha: 'Feb 15 - Mar 20', img: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=600' },
    { id: 2, titulo: 'Vanguardia Digital', fecha: 'Mar 25 - Abr 10', img: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=600' },
    { id: 3, titulo: 'Escultura Moderna', fecha: 'May 05 - Jun 15', img: 'https://images.unsplash.com/photo-1554188248-986adbb73be4?q=80&w=600' }
  ];

  return (
    <section className="events-section">
      <h2 className="section-title">Próximos Eventos</h2>
      <div className="events-grid">
        {eventos.map(ev => (
          <div key={ev.id} className="event-card">
            <div className="event-img" style={{backgroundImage: `url(${ev.img})`}}></div>
            <div className="event-info">
              <span className="event-date">{ev.fecha}</span>
              <h3 className="event-name">{ev.titulo}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Events;