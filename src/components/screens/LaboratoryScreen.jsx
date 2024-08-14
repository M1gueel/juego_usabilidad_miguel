import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Laboratory, { peaGenotypes } from '../../function/PeaGenetics';
import VerdeLiso from '../../images/personajes/verde-liso.png';
import VerdeRugoso from '../../images/personajes/verde-rugoso.png';
import AmarilloRugoso from '../../images/personajes/amarillo-rugoso.png';
import AmarilloLiso from '../../images/personajes/amarillo-liso.png';
import { ArrowRight } from 'lucide-react';
import { GiDna1 } from 'react-icons/gi'; // Ícono de gen (ADN)
import { Table2Icon } from 'lucide-react';
import { ArrowLeftIcon } from 'lucide-react';
import { NeonGradientCard } from '../NeonCard';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import CombinationsTable from '../CombinationsTable';
const PeaGeneticsSimulator = () => {
  const [lab] = useState(new Laboratory());
  const [generations, setGenerations] = useState([]);
  const [combinations, setCombinations] = useState({ parentsSelected: { parent1: null, parent2: null }, combinations: [] });
  const [selectedParents, setSelectedParents] = useState({ parent1: null, parent2: null });
  const [showMixingAnimation, setShowMixingAnimation] = useState(false);
  const [showCombinations, setShowCombinations] = useState(false);
  const lastGenerationRef = useRef(null);  // Referencia para la última generación
  const { playMixPeas, playButtonClick, playHover, playSqueak, playPopFinish } = useSoundEffects();

  const phenotypeToImageMap = {
    'verde-liso': VerdeLiso,
    'verde-rugoso': VerdeRugoso,
    'amarillo-liso': AmarilloLiso,
    'amarillo-rugoso': AmarilloRugoso,
  };

  const handleInitialGeneration = () => {
    const parent1 = peaGenotypes['verde-liso'];
    const parent2 = peaGenotypes['amarillo-rugoso'];

    // Genera la nueva generación
    const newGeneration = lab.generateNewGeneration(parent1, parent2);

    // Obtén todas las combinaciones posibles con fenotipos
    const allCombinations = lab.getAllCombinations(parent1, parent2);

    // Determina los fenotipos de los padres
    const parent1Phenotype = lab.determinePhenotype(parent1);
    const parent2Phenotype = lab.determinePhenotype(parent2);

    // Actualiza el estado con las combinaciones, los fenotipos de los padres y los padres seleccionados
    setCombinations({
      parentsSelected: {
        parent1: { genotype: parent1, phenotype: parent1Phenotype },
        parent2: { genotype: parent2, phenotype: parent2Phenotype }
      },
      combinations: allCombinations
    });

    // Si también deseas actualizar la generación, por ejemplo, para mostrarla en otro lugar
    setGenerations([newGeneration]);
  };


  const handlePeaSelection = (generationIndex, peaIndex) => {
    const selectedPea = lab.getPeaFromGeneration(generationIndex, peaIndex);
    if (selectedPea) {
      if (!selectedParents.parent1) {
        playSqueak()
        setSelectedParents({ ...selectedParents, parent1: selectedPea });
      } else if (!selectedParents.parent2) {
        playSqueak()
        setSelectedParents({ ...selectedParents, parent2: selectedPea });
      }
    }

  };

  const handleNewGeneration = () => {
    if (selectedParents.parent1 && selectedParents.parent2) {
      setShowMixingAnimation(true);
      playMixPeas();
      setTimeout(() => {
        const newGeneration = lab.createNewGenerationFromSelection(selectedParents.parent1, selectedParents.parent2);
        const allCombinations = lab.getAllCombinations(selectedParents.parent1.genotype, selectedParents.parent2.genotype);

        setCombinations({
          parentsSelected: { parent1: selectedParents.parent1, parent2: selectedParents.parent2 },
          combinations: allCombinations
        });

        setGenerations([...generations, newGeneration]);
        setSelectedParents({ parent1: null, parent2: null });
        setShowMixingAnimation(false);
        playPopFinish();
      }, 2000); // Duración de la animación de mezcla
    }
  };

  // Animación para los guisantes
  const peaVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 20 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    }),
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
  };

  // Animación de stand by
  const standbyAnimation = {
    y: [0, -5, 0],
    rotate: [-1, 1, -1],
    transition: {
      y: {
        repeat: Infinity,
        duration: 2,
        ease: 'easeInOut',
      },
      rotate: {
        repeat: Infinity,
        duration: 3,
        ease: 'easeInOut',
      },
    },
  };

  const handleCancelSelection = () => {
    setSelectedParents({ parent1: null, parent2: null });
  };
  useEffect(() => {
    if (lastGenerationRef.current) {
      lastGenerationRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [generations])



  return (
    <NeonGradientCard className="mx-auto my-auto">
      <motion.div
        className="text-2xl font-bold mb-1 text-green-800 flex justify-between items-start"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!showCombinations && (
          <motion.h1
            className="text-2xl font-bold text-green-800 max-w-sm"
          >
            Simulador de Genética de Guisantes
            {generations.length > 0 && (
              <motion.p
                className="text-lg mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Selecciona dos guisantes para mezclar sus genes y generar una nueva generación.
              </motion.p>
            )}
          </motion.h1>
        )}
        {showCombinations && (
          <motion.button
            onClick={() => {
              setShowCombinations(!showCombinations)
              playButtonClick()
            }}
            className="bg-green-600 w-fit flex flex-row text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            onMouseEnter={playHover}

          >
            <ArrowLeftIcon className="mr-2" size={20} /><span>Regresar</span>
          </motion.button>
        )}

        {generations.length > 0 && (
          <motion.div className='flex justify-center items-end gap-1'>
            <motion.button
              onClick={() => {
                setShowCombinations(!showCombinations)
                playButtonClick()
              }}
              className="bg-green-600 w-fit text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              onMouseEnter={playHover}

            >
              <Table2Icon className="" size={20} />
            </motion.button>
            <motion.button
              onClick={() => {
                handleInitialGeneration()
                playButtonClick()
              }}
              className="bg-green-600 w-fit text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              onMouseEnter={playHover}

            >
              <GiDna1 className="" size={20} />
            </motion.button>
          </motion.div>
        )}


      </motion.div>

      {generations.length === 0 && (
        <>
          <motion.p
            className="text-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Iniciaras la simulación con dos guisantes de la primera generación.

          </motion.p>
          <motion.p
            className="text-lg mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

            Te presentamos a los padres:
          </motion.p>
        </>


      )}

      {generations.length === 0 && (
        <>
          <motion.div className="flex justify-center items-center space-x-4 mb-4">
            <motion.div className='flex flex-col justify-center items-center'
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}>
              <motion.img
                src={phenotypeToImageMap['verde-liso']}
                alt="Parent 1"
                className="w-16 h-16"

              />
              <p className='text-center'>Verde Liso</p>
            </motion.div>

            <motion.div
              className="text-2xl font-bold text-gray-700"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              transition={{ duration: 1 }}
            >
              +
            </motion.div>

            <motion.div className='flex flex-col justify-center items-center'
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}>
              <motion.img
                src={phenotypeToImageMap['amarillo-rugoso']}
                alt="Parent 1"
                className="w-16 h-16"

              />
              <p className='text-center'>Amarillo Rugoso</p>
            </motion.div>



          </motion.div>
          <div className='w-full flex justify-center'>
            <motion.button
              onClick={() => {
                handleInitialGeneration()
                playButtonClick()
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mt-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              onMouseEnter={playHover}

            >
              Iniciar Simulación
            </motion.button>

          </div>
        </>

      )}

      {!showCombinations && (
        <section className="max-h-80 overflow-y-auto">
          {generations.map((generation, genIndex) => (
            <motion.section
              key={genIndex}
              className="mt-4 border-b p-4 border-gray-200 bg-gray-50 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: genIndex * 0.2 }}
              ref={genIndex === generations.length - 1 ? lastGenerationRef : null}  // Referencia en la última generación
            >
              <h2 className="text-xl text-green-600 font-bold mb-2">Generación {genIndex + 1}:</h2>
              <div className="flex items-center">
                {generation.map((pea, peaIndex) => (
                  <React.Fragment key={peaIndex}>
                    {peaIndex === 2 && (
                      <motion.div className="text-center my-4">
                        <ArrowRight className="text-gray-500 mx-auto mb-2" />
                      </motion.div>
                    )}
                    <motion.div
                      key={peaIndex}
                      className={`text-center flex flex-col justify-center items-center cursor-pointer p-4 rounded-lg border ${selectedParents.parent1 === pea || selectedParents.parent2 === pea
                        ? 'border-blue-600'
                        : 'border-transparent'
                        }`}
                      onClick={() => {
                        handlePeaSelection(genIndex, peaIndex)

                      }}
                      onTap={() => {
                        handlePeaSelection(genIndex, peaIndex)

                      }}

                      variants={peaVariants}
                      initial="hidden"
                      animate={['visible', standbyAnimation]}
                      custom={peaIndex}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <motion.img
                        src={phenotypeToImageMap[pea.phenotype]}
                        alt={pea.phenotype}
                        className="w-10 h-10 mb-2"
                      />
                      <p>{pea.phenotype}</p>
                      <p className="text-sm">{`${pea.genotype.color}, ${pea.genotype.texture}`}</p>
                    </motion.div>
                  </React.Fragment>
                ))}
              </div>
            </motion.section>
          ))}
        </section>
      )}

      {showCombinations && (
        <section className="max-h-80 overflow-y-auto">
          <CombinationsTable combinations={combinations} />
        </section>
      )}

      {showMixingAnimation && (
        <div className="flex justify-center items-center space-x-4">
          <motion.img
            src={phenotypeToImageMap[selectedParents.parent1.phenotype]}
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
            src={phenotypeToImageMap[selectedParents.parent2.phenotype]}
            alt="Parent 2"
            className="w-16 h-16"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          />
        </div>
      )}

      {!showMixingAnimation && selectedParents.parent1 && selectedParents.parent2 && (
        <div className='flex gap-2'>
          <motion.button
            onClick={handleNewGeneration}
            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mt-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Generar Nueva Generación
          </motion.button>
          <motion.button
            onClick={handleCancelSelection}
            className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-green-500 mt-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancelar Selección
          </motion.button>
        </div>


      )}

    </NeonGradientCard>
  );
};

export default PeaGeneticsSimulator;
