import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Menu, X, User, Home, Info, ShoppingCart, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
function NavAuthenticated() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(false); // <-- state to toggle menu

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('User logged out');
    navigate('/');
  };

  return (
    <nav className="bg-dark-bg text-text-light p-4 shadow-md">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">

        <Link to="/" className="text-xl sm:text-2xl font-bold">
          Durga Handicrafts
        </Link>


        {/* Mobile Menu Toggle Button */}
        <button
          className="sm:hidden text-text-light focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />} {/* 3-line icon */}
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="hover:text-wood-accent transition-colors duration-200 text-sm sm:text-base flex items-center gap-1"
          >
            <Home size={18} />
            Home
          </button>
          <Link to="/about" className="hover:text-wood-accent transition-colors duration-200 text-sm sm:text-base flex items-center gap-1">
            <Info size={18} />
            About
          </Link>
          <button
            onClick={() => navigate('/profile')}
            className="hover:text-wood-accent transition-colors duration-200 text-sm sm:text-base flex items-center gap-1"
          >
            <User size={18} />
            Profile
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="relative hover:text-wood-accent transition-colors duration-200 text-sm sm:text-base flex items-center gap-1"
          >
            <ShoppingCart size={18} />
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-wood-accent text-dark-bg rounded-full px-2 py-1 text-xs">
                {cart.length}
              </span>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm sm:text-base flex items-center gap-1"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="flex flex-col sm:hidden mt-4 space-y-3 text-center">
          <button
            onClick={() => {
              navigate('/dashboard');
              setIsOpen(false);
            }}
            className="hover:text-wood-accent transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <Home size={18} />
            Home
          </button>
          <Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-wood-accent transition-colors duration-200 flex items-center justify-center gap-1">
            <Info size={18} />
            About
          </Link>
          <button
            onClick={() => {
              navigate('/profile');
              setIsOpen(false);
            }}
            className="hover:text-wood-accent transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <User size={18} />
            Profile
          </button>
          <button
            onClick={() => {
              navigate('/cart');
              setIsOpen(false);
            }}
            className="relative hover:text-wood-accent transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <ShoppingCart size={18} />
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-6 bg-wood-accent text-dark-bg rounded-full px-2 py-1 text-xs">
                {cart.length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default NavAuthenticated;
