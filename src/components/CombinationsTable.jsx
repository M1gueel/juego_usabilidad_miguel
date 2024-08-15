import VerdeLiso from '../images/personajes/verde-liso.png';
import VerdeRugoso from '../images/personajes/verde-rugoso.png';
import AmarilloRugoso from '../images/personajes/amarillo-rugoso.png';
import AmarilloLiso from '../images/personajes/amarillo-liso.png';

import Genotype1 from '../images/geno/Genotype1.png';
import Genotype2 from '../images/geno/Genotype2.png';
import Genotype3 from '../images/geno/Genotype3.png';
import Genotype4 from '../images/geno/Genotype4.png';
import Genotype5 from '../images/geno/Genotype5.png';
import Genotype6 from '../images/geno/Genotype6.png';
import Genotype7 from '../images/geno/Genotype7.png';
import Genotype8 from '../images/geno/Genotype8.png';
import Genotype9 from '../images/geno/Genotype9.png';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export const peaImages = {
    'verde-liso': VerdeLiso,
    'verde-rugoso': VerdeRugoso,
    'amarillo-rugoso': AmarilloRugoso,
    'amarillo-liso': AmarilloLiso,
};

const genotypeToImageMap = {
    'VVLL': Genotype1,
    'VVLl': Genotype2,
    'VvLL': Genotype3,
    'VvLl': Genotype4,
    'VVll': Genotype5,
    'Vvll': Genotype6,
    'vvLL': Genotype7,
    'vvLl': Genotype8,
    'vvll': Genotype9,
};

export default function CombinationsTable({ combinations, showGenotype }) {
    const getImageForCombination = (phenotype, genotype) => {
        if (showGenotype) {
            return genotypeToImageMap[genotype] || null;
        }
        return peaImages[phenotype] || null;
    };

    const getGenotypeKey = (genotype) => {
        return `${genotype.color}${genotype.texture}`;
    };

    const fillEmptyCells = (combinations) => {
        const totalCells = 16;
        return [...combinations, ...Array(totalCells - combinations.length).fill(null)];
    };

    const filledCombinations = fillEmptyCells(combinations.combinations);

    return (
        <div className="w-full overflow-x-auto flex flex-col justify-center items-center">
            <motion.p className="text-2xl font-bold text-gray-700" initial={{ scale: 0, opacity: 1 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
                Padres de esta generación
            </motion.p>
            <div className="flex justify-center items-center space-x-4 mb-4">
                <motion.img
                    src={getImageForCombination(
                        combinations.parentsSelected.parent1.phenotype,
                        getGenotypeKey(combinations.parentsSelected.parent1.genotype)
                    )}
                    alt="Parent 1"
                    className="w-16 h-16"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                />
                <motion.div
                    className="text-2xl font-bold text-gray-700"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    +
                </motion.div>
                <motion.img
                    src={getImageForCombination(
                        combinations.parentsSelected.parent2.phenotype,
                        getGenotypeKey(combinations.parentsSelected.parent2.genotype)
                    )}
                    alt="Parent 2"
                    className="w-16 h-16"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                />
            </div>
            <motion.p className="text-2xl font-bold text-gray-700" initial={{ scale: 0, opacity: 1 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
                Posibles descendientes
            </motion.p>
            <motion.table
                className="w-full table-auto border-collapse bg-white shadow-lg rounded-lg"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                role="table"
            >
                <caption className="text-lg font-semibold mb-4">Tabla de combinaciones genéticas de color y textura</caption>
                <tbody>
                    {[...Array(4)].map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {[...Array(4)].map((_, colIndex) => {
                                const combination = filledCombinations[rowIndex * 4 + colIndex];
                                if (!combination) {
                                    return <td key={colIndex} className="border px-6 py-4" tabIndex="0"></td>;
                                }

                                const phenotype = `${combination.genotype.color.includes('V') ? 'verde' : 'amarillo'}-${combination.genotype.texture.includes('L') ? 'liso' : 'rugoso'}`;
                                const genotypeKey = getGenotypeKey(combination.genotype);
                                const image = getImageForCombination(phenotype, genotypeKey);

                                return (
                                    <td key={colIndex} className="border px-6 py-4 text-center bg-gray-50 hover:bg-gray-100" role="cell" tabIndex="0">
                                        {image && (
                                            <img
                                                src={image}
                                                alt={showGenotype ? `Genotipo: ${genotypeKey}` : `Fenotipo: ${phenotype}`}
                                                aria-label={showGenotype ? `Imagen del genotipo: ${genotypeKey}` : `Imagen del fenotipo: ${phenotype}`}
                                                className="w-16 h-16 mx-auto mb-2"
                                            />
                                        )}
                                        <p className="text-sm font-semibold text-gray-700">{showGenotype ? genotypeKey : phenotype}</p>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </motion.table>
        </div>
    );
}
