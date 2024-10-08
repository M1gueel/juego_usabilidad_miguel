import { useSimulator } from "../context/SimulatorContext";
import { Menu } from 'lucide-react';

export default function MenuButton() {
    const { menuOpen, setMenuOpen } = useSimulator();
    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <button
            onClick={toggleMenu}
            className={`absolute z-50 top-4 right-4 p-2 bg-green-500 text-white rounded-full shadow-lg 
                hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 
                ${menuOpen ? 'rotate-45' : 'rotate-0'}`}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
        >
            <Menu size={24} />
        </button>
    );
}
