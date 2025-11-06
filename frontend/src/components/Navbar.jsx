import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Info, LogIn, Mail, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-dark-bg text-text-light shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link to="/" className="text-xl sm:text-2xl font-bold">
          Durga Handicrafts
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-base font-medium">
          
          <Link to="/about" className="hover:text-wood-accent transition-colors duration-200 flex items-center gap-2">
            <Info size={18} />
            About
          </Link>
          <Link to="/login" className="hover:text-wood-accent transition-colors duration-200 flex items-center gap-2">
            <LogIn size={18} />
            Login
          </Link>
          <Link to="/contact" className="hover:text-wood-accent transition-colors duration-200 flex items-center gap-2">
            <Mail size={18} />
            Contact
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none text-text-light"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-gray-800">
          <Link
            to="/about"
            className="block text-text-light hover:text-wood-accent transition-colors duration-200 flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <Info size={18} />
            About
          </Link>
          <Link
            to="/login"
            className="block text-text-light hover:text-wood-accent transition-colors duration-200 flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <LogIn size={18} />
            Login
          </Link>
          <Link
            to="/contact"
            className="block text-text-light hover:text-wood-accent transition-colors duration-200 flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <Mail size={18} />
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}