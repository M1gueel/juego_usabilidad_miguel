import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Laboratory, { peaGenotypes } from '../../function/PeaGenetics';
import VerdeLiso from '../../images/personajes/verde-liso.png';
import VerdeRugoso from '../../images/personajes/verde-rugoso.png';
import AmarilloRugoso from '../../images/personajes/amarillo-rugoso.png';
import AmarilloLiso from '../../images/personajes/amarillo-liso.png';
import Principal from '../../images/personajes/doctor.png';
import Genotype1 from '../../images/geno/Genotype1.png';
import Genotype2 from '../../images/geno/Genotype2.png';
import Genotype3 from '../../images/geno/Genotype3.png';
import Genotype4 from '../../images/geno/Genotype4.png';
import Genotype5 from '../../images/geno/Genotype5.png';
import Genotype6 from '../../images/geno/Genotype6.png';
import Genotype7 from '../../images/geno/Genotype7.png';
import Genotype8 from '../../images/geno/Genotype8.png';
import Genotype9 from '../../images/geno/Genotype9.png';

import { ArrowRight } from 'lucide-react';
import { GiDna1 } from 'react-icons/gi'; // Ícono de gen (ADN)
import { Table2Icon } from 'lucide-react';
import { ArrowLeftIcon } from 'lucide-react';
import { NeonGradientCard } from '../NeonCard';
import { BiReset } from 'react-icons/bi';
import TooltipButton from '../TooltipButton';

import { useSoundEffects } from '../../hooks/useSoundEffects';
import CombinationsTable from '../CombinationsTable';
import { useSimulator } from '../../context/SimulatorContext';
const phenotypeToImageMap = {
  'verde-liso': VerdeLiso,
  'verde-rugoso': VerdeRugoso,
  'amarillo-liso': AmarilloLiso,
  'amarillo-rugoso': AmarilloRugoso,
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

const PeaGeneticsSimulator = () => {

  const [tutorialStep, setTutorialStep] = useState(0);


  const [lab] = useState(new Laboratory());
  const [generations, setGenerations] = useState([]);
  const [combinations, setCombinations] = useState({ parentsSelected: { parent1: null, parent2: null }, combinations: [] });
  const [selectedParents, setSelectedParents] = useState({ parent1: null, parent2: null });
  const [showMixingAnimation, setShowMixingAnimation] = useState(false);
  const [showCombinations, setShowCombinations] = useState(false);
  const lastGenerationRef = useRef(null);  // Referencia para la última generación
  const [showGenotype, setShowGenotype] = useState(false);
  const { playMixPeas, playButtonClick, playHover, playSqueak, playPopFinish } = useSoundEffects();
  const { currentScreen, setCurrentScreen } = useSimulator();
  const [isTutorial, setIsTutorial] = useState(true);



  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setIsTutorial(false); // Termina el tutorial
    }
  };

  useEffect(() => {
    setIsTutorial(currentScreen === 'intro');
  }, [currentScreen]);


  const getGenotypeKey = (genotype) => {
    const colorAllele = genotype.color === 'VV' ? 'VV' : genotype.color === 'Vv' ? 'Vv' : 'vv';
    const textureAllele = genotype.texture === 'LL' ? 'LL' : genotype.texture === 'Ll' ? 'Ll' : 'll';
    return `${colorAllele}${textureAllele}`;
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

  const tutorialSteps = [
    {
      text: "Bienvenido al simulador de genética de guisantes. En este tutorial, te enseñaré cómo usar cada función.",
      action: () => { }, // Acción opcional para cada paso
      canProceed: () => true, // Se puede avanzar en cualquier momento
    },
    {
      text: "Para empezar, presiona el botón 'Iniciar Simulación' para generar dos guisantes de la primera generación.",
      action: () => handleInitialGeneration(),
      canProceed: () => generations.length > 0, // Avanza cuando la generación inicial se ha creado
    },
  ];

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

  const handleShowCombinations = () => {
    setShowCombinations(!showCombinations);
    playButtonClick();
  };

  const handleShowGenotype = () => {
    setShowGenotype(!showGenotype);
    playButtonClick();
  };

  const handleReset = () => {
    setGenerations([]);
    setCombinations({
      parentsSelected: { parent1: null, parent2: null },
      combinations: [],
    });
    setSelectedParents({ parent1: null, parent2: null });
    lab.resetGenerations();
    playButtonClick();
  };

  useEffect(() => {
    console.log(isTutorial)
  }, [])

  return (
    <NeonGradientCard className="relative mx-auto my-auto">
      {isTutorial && (
        <motion.div
          className="absolute -top-1/2 bg-white p-4 rounded-lg shadow-md text-center mb-10 cursor-grab z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          drag  // Permite arrastrar el div
          dragConstraints={{ top: -200, bottom: 500, left: -500, right: 500 }} // Ajusta los límites de arrastre según sea necesario
          dragElastic={0.2} // Controla la elasticidad del arrastre
          whileDrag={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)" }} // Efecto visual durante el arrastre
          role="dialog"
          aria-labelledby="tutorial-dialog-title"
          aria-describedby="tutorial-dialog-description"
        >
          <div className="flex justify-center items-center w-full">
            <img
              src={Principal}
              alt="Personaje del juego"
              className="w-20 h-auto animate-move-up-down hover:animate-move-up-down-shake"
              onPointerEnter={playSqueak}
            />
          </div>
          <h2 id="tutorial-dialog-title" className="sr-only">Tutorial</h2>
          <p
            id="tutorial-dialog-description"
            className="text-xl"
            aria-live="assertive"
          >
            {tutorialSteps[tutorialStep].text}
          </p>
  
          <button
            onClick={() => {
              if (tutorialSteps[tutorialStep].canProceed()) {
                tutorialSteps[tutorialStep].action();
                nextTutorialStep();
              }
            }}
            disabled={!tutorialSteps[tutorialStep].canProceed()}
            className={`bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mt-4
              ${!tutorialSteps[tutorialStep].canProceed() ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            Siguiente
          </button>
  
          <button
            onClick={() => setIsTutorial(false)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-green-500 mt-4 ml-4"
          >
            Saltar Tutorial
          </button>
        </motion.div>
      )}

      <motion.div
        className="text-2xl font-bold mb-1 text-green-800 flex justify-between items-start"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!showCombinations && (
          <motion.h1
            className="text-2xl font-bold text-green-800 max-w-sm"
            //aria-live="polite" // Cambiar a "assertive" si no funciona bien
          >
            Simulador de Genética de Guisantes
            {generations.length > 0 && (
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                aria-live="assertive"
              >
                {/* Selecciona dos guisantes para mezclar sus genes y generar una nueva generación. */}
                <p className="text-lg mb-4">Selecciona dos guisantes para mezclar sus genes y generar una nueva generación.</p>
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
          <motion.div
            className="flex justify-center items-end gap-1"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {!showCombinations && (
              <TooltipButton
                onClick={handleShowCombinations}
                tooltipText="Mostrar combinaciones"
                Icon={Table2Icon}
              />
            )}
            <TooltipButton
              onClick={handleShowGenotype}
              tooltipText="Mostrar genotipo"
              Icon={GiDna1}
            />
            <TooltipButton
              onClick={handleReset}
              tooltipText="Reiniciar"
              Icon={BiReset}
            />
          </motion.div>
        )}
      </motion.div>

      {generations.length === 0 && (
  <>
    <div
      role="region"
      aria-live="assertive"
      aria-atomic="true"
      aria-labelledby="instruction-section"
      className="mb-4 p-4 border border-gray-300 rounded-lg bg-white"
    >
      {/* <h2 id="instruction-section" className="sr-only">
        Instrucciones de la Simulación
      </h2> */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        aria-live="assertive"
      >
        <p className="text-lg">
          Iniciarás la simulación con dos guisantes de la primera generación.
        </p>
        <p className="text-lg mb-4">
          Te presentamos a los padres:
        </p>
      </motion.div>
    </div>

    <div
      role="region"
      aria-live="polite"
      className="flex justify-center items-center space-x-4 mb-4"
    >
      <div
        className='flex flex-col justify-center items-center'
        aria-label="Parent 1: Verde Liso"
      >
        <motion.img
          src={phenotypeToImageMap['verde-liso']}
          alt="Verde Liso"
          className="w-16 h-16"
        />
        <p className='text-center'>Verde Liso</p>
      </div>

      <div
        className="text-2xl font-bold text-gray-700"
        aria-hidden="true"
      >
        +
      </div>

      <div
        className='flex flex-col justify-center items-center'
        aria-label="Parent 2: Amarillo Rugoso"
      >
        <motion.img
          src={phenotypeToImageMap['amarillo-rugoso']}
          alt="Amarillo Rugoso"
          className="w-16 h-16"
        />
        <p className='text-center'>Amarillo Rugoso</p>
      </div>
    </div>

    <div className='w-full flex justify-center'>
      <motion.button
        onClick={() => {
          handleInitialGeneration();
          playButtonClick();
        }}
        className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mt-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        onMouseEnter={playHover}
        aria-label="Iniciar Simulación"
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
              ref={genIndex === generations.length - 1 ? lastGenerationRef : null}
            >
              <h2 className="text-xl text-green-600 font-bold mb-2">Generación {genIndex + 1}:</h2>

              <div className="flex items-center justify-center">
                {generation.map((pea, peaIndex) => (
                  <React.Fragment key={peaIndex}>
                    {peaIndex === 2 && (
                      <motion.div className="text-center my-4">
                        <ArrowRight className="text-gray-500 mx-auto mb-2" />
                      </motion.div>
                    )}
                    <motion.div
                      className={`text-center flex flex-col justify-center items-center cursor-pointer p-4 rounded-lg border ${selectedParents.parent1 === pea || selectedParents.parent2 === pea
                        ? 'border-blue-600'
                        : 'border-transparent'
                        }`}
                      onClick={() => handlePeaSelection(genIndex, peaIndex)}
                      onTap={() => handlePeaSelection(genIndex, peaIndex)}
                      variants={peaVariants}
                      initial="hidden"
                      animate={['visible', standbyAnimation]}
                      custom={peaIndex}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <motion.img
                        src={showGenotype
                          ? genotypeToImageMap[getGenotypeKey(pea.genotype)]
                          : phenotypeToImageMap[pea.phenotype]
                        }
                        alt={showGenotype ? getGenotypeKey(pea.genotype) : pea.phenotype}
                        className="w-10 h-10 mb-2"
                      />
                      <p>{showGenotype ? getGenotypeKey(pea.genotype) : pea.phenotype}</p>
                      {!showGenotype && (
                        <p className="text-sm">{`${pea.genotype.color}, ${pea.genotype.texture}`}</p>
                      )}
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
          <CombinationsTable combinations={combinations} showGenotype={showGenotype} />
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