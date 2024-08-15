import { motion } from 'framer-motion';
import React, { useState } from 'react';

function TooltipButton({ onClick, tooltipText, Icon, ...props }) {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);

    return (
        <motion.button
            onClick={onClick}
            onMouseEnter={() => setIsTooltipVisible(true)}
            onMouseLeave={() => setIsTooltipVisible(false)}
            className="relative bg-green-600 w-fit text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            //linea agregada
            aria-label={tooltipText} // Añade aria-label aquí
            {...props}
        >
            <Icon size={20} />
            {isTooltipVisible && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded-lg py-1 px-2 transition-opacity duration-300 opacity-100">
                    {tooltipText}
                </div>
            )}
        </motion.button>
    );
}

export default TooltipButton;
