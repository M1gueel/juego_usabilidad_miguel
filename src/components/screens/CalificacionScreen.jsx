import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSimulator } from '../../context/SimulatorContext';

const CalificacionScreen = () => {
    const { setCurrentScreen, currentScreen } = useSimulator();
    const [rating, setRating] = useState(0);

    if (currentScreen !== 'rating') return null;

    const handleSubmit = () => {
        // Aquí podrías manejar el envío de la calificación
        console.log('Rating submitted:', rating);
    };

    // Maneja el evento de teclado para seleccionar una estrella
    const handleKeyDown = (event, star) => {
        if (event.key === 'Enter' || event.key === ' ') {
            setRating(star);
        }
    };

    return (
        <div className="relative p-8 bg-white rounded-lg shadow-2xl overflow-hidden" role="form" aria-labelledby="rating-heading">
            <h2 id="rating-heading" className="text-3xl font-bold mb-6 text-center" role="heading" aria-level="1">
                Califica el Juego
            </h2>
            <div className="flex flex-col items-center" role="group" aria-labelledby="rating-description">
                {/* Mensaje o instrucciones sobre cómo calificar */}
                <p id="rating-description" className="mb-4 text-lg text-center">
                    Tu opinión es importante para nosotros. Por favor, califica tu experiencia con el juego.
                </p>
                <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            role="button"
                            tabIndex="0" // Permite el enfoque en las estrellas
                            aria-label={`Calificar con ${star} estrella${star > 1 ? 's' : ''}`}
                            className={`cursor-pointer text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                            onClick={() => setRating(star)}
                            onKeyDown={(event) => handleKeyDown(event, star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <div className="flex justify-center">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                        onClick={handleSubmit}
                        tabIndex="0" // Permite el enfoque en el botón
                        aria-label="Enviar calificación"
                    >
                        Enviar Calificación
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalificacionScreen;
