import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import VerdeLiso from '../../images/personajes/verde-liso.png';
import VerdeRugoso from '../../images/personajes/verde-rugoso.png';
import AmarilloRugoso from '../../images/personajes/amarillo-rugoso.png';
import AmarilloLiso from '../../images/personajes/amarillo-liso.png';
import { useSimulator } from '../../context/SimulatorContext';

const AcercaDeScreen = () => {
    const { setCurrentScreen, currentScreen } = useSimulator();
    const containerRef = useRef(null); // Referencia al contenedor para el enfoque

    useEffect(() => {
        if (currentScreen === 'about') {
            // Establecer el enfoque en el contenedor al cargar la pantalla
            containerRef.current?.focus();
        }
    }, [currentScreen]);

    if (currentScreen !== 'about') return null;

    return (
        <div
            ref={containerRef}
            className="relative p-8 bg-white rounded-lg shadow-2xl overflow-hidden"
            role="region"
            aria-labelledby="about-heading"
            aria-live="polite" // Anuncia los cambios en la región
            aria-atomic="true" // Anuncia el contenido completo en lugar de solo los cambios
            tabIndex="0" // Permite el enfoque en toda la pantalla
        >
            <h2 id="about-heading" className="text-3xl font-bold mb-6 text-center" role="heading" aria-level="1" tabIndex="0">
                Instrucciones del Juego
            </h2>
            <div className="flex flex-col md:flex-row">
                {/* Texto de instrucciones */}
                <div
                    className="md:w-1/2 p-4"
                    aria-describedby="game-description"
                    tabIndex="0" // Permite el enfoque en el texto de instrucciones
                >
                    <p id="game-description" className="mb-4 text-lg">
                        Bienvenido al juego de genética de guisantes. Aquí aprenderás sobre fenotipos y genotipos a través de diferentes modos de juego. Sigue las instrucciones a continuación para comenzar.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-lg">
                        <li tabIndex="0">Selecciona un modo de juego desde el menú principal.</li>
                        <li tabIndex="0">En el Modo Narrativo, sigue la historia y toma decisiones.</li>
                        <li tabIndex="0">En el Modo Sandbox, experimenta libremente con los guisantes.</li>
                        <li tabIndex="0">Haz clic en el primer guisante que deseas seleccionar.</li>
                        <li tabIndex="0">Haz clic en el segundo guisante que deseas seleccionar.</li>
                        <li tabIndex="0">Haz clic en el botón Generar nueva generación.</li>
                        <li tabIndex="0">Observa los cambios en el fenotipo y genotipo de los guisantes a medida que juegas.</li>
                    </ul>
                    <p className="mt-4 text-lg" tabIndex="0">¡Diviértete y aprende sobre la genética!</p>
                </div>
                {/* Imágenes de personajes */}
                <div className="md:w-1/2 relative" aria-hidden="true">
                    <motion.img
                        src={VerdeLiso}
                        alt="Guisante verde liso mostrando su color y textura."
                        className="absolute top-0 left-0 w-1/3 h-auto"
                        initial={{ y: -10, opacity: 0.8, scale: 0.9 }}
                        animate={{ y: [0, -10, 0], opacity: [0.8, 1, 0.8], scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        tabIndex="0" // Permite el enfoque en la imagen
                    />
                    <motion.img
                        src={VerdeRugoso}
                        alt="Guisante verde rugoso mostrando su color y textura."
                        className="absolute top-1/4 right-0 w-1/3 h-auto"
                        initial={{ y: -10, opacity: 0.8, scale: 0.9 }}
                        animate={{ y: [0, -10, 0], opacity: [0.8, 1, 0.8], scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        tabIndex="0" // Permite el enfoque en la imagen
                    />
                    <motion.img
                        src={AmarilloRugoso}
                        alt="Guisante amarillo rugoso mostrando su color y textura."
                        className="absolute bottom-1/4 left-1/3 w-1/3 h-auto"
                        initial={{ y: -10, opacity: 0.8, scale: 0.9 }}
                        animate={{ y: [0, -10, 0], opacity: [0.8, 1, 0.8], scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        tabIndex="0" // Permite el enfoque en la imagen
                    />
                    <motion.img
                        src={AmarilloLiso}
                        alt="Guisante amarillo liso mostrando su color y textura."
                        className="absolute bottom-0 right-1/4 w-1/3 h-auto"
                        initial={{ y: -10, opacity: 0.8, scale: 0.9 }}
                        animate={{ y: [0, -10, 0], opacity: [0.8, 1, 0.8], scale: [0.9, 1.1, 0.9] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        tabIndex="0" // Permite el enfoque en la imagen
                    />
                </div>
            </div>
        </div>
    );
};

export default AcercaDeScreen;
