import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Facebook, 
  Instagram, 
  Twitter, 
  Heart,
  Info,
  ShoppingBag
} from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-dark-bg text-text-light border-t border-wood-accent/30">
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand & Description */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="text-wood-accent" size={32} />
              <h2 className="text-2xl font-bold text-wood-accent">Durga Handicrafts</h2>
            </div>
            <p className="text-sm text-gray-400 text-center md:text-left leading-relaxed">
              Crafting timeless furniture with passion and precision. 
              Bringing elegance and comfort to your home since decades.
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-wood-accent hover:text-dark-bg transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-wood-accent hover:text-dark-bg transition-all duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-wood-accent hover:text-dark-bg transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-4 text-wood-accent flex items-center justify-center md:justify-start gap-2">
              <Info size={20} />
              Quick Links
            </h3>
            <div className="flex flex-col space-y-3 text-sm">
              <Link 
                to="/" 
                className="hover:text-wood-accent transition-colors duration-200 hover:translate-x-1 transform inline-block"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="hover:text-wood-accent transition-colors duration-200 hover:translate-x-1 transform inline-block"
              >
                About Us
              </Link>
              <Link 
                to="/dashboard" 
                className="hover:text-wood-accent transition-colors duration-200 hover:translate-x-1 transform inline-block"
              >
                Shop
              </Link>
              <a
                href="mailto:durgafurniture2412@gmail.com"
                className="hover:text-wood-accent transition-colors duration-200 hover:translate-x-1 transform inline-block"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Column 3: Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-4 text-wood-accent flex items-center justify-center md:justify-start gap-2">
              <Phone size={20} />
              Contact Us
            </h3>
            <div className="text-sm text-gray-400 space-y-3">
              <div className="flex items-start justify-center md:justify-start gap-2 hover:text-wood-accent transition-colors">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <p>Shahbery market, Greater Noida, UP, India</p>
              </div>
              <a 
                href="mailto:durgafurniture2412@gmail.com"
                className="flex items-center justify-center md:justify-start gap-2 hover:text-wood-accent transition-colors"
              >
                <Mail size={18} className="flex-shrink-0" />
                <p>durgafurniture2412@gmail.com</p>
              </a>
              <a 
                href="tel:+919953578244"
                className="flex items-center justify-center md:justify-start gap-2 hover:text-wood-accent transition-colors"
              >
                <Phone size={18} className="flex-shrink-0" />
                <p>+91 9953578244</p>
              </a>
            </div>
          </div>

          {/* Column 4: Business Hours */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-4 text-wood-accent">Business Hours</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <div className="flex justify-between md:justify-start md:gap-4">
                <span className="font-semibold text-text-light">Mon - Sat:</span>
                <span>9:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between md:justify-start md:gap-4">
                <span className="font-semibold text-text-light">Sunday:</span>
                <span>10:00 AM - 6:00 PM</span>
              </div>
              <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-wood-accent/20">
                <p className="text-xs text-center">
                  Visit our showroom for exclusive deals and personalized service!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-gray-400">
          <p className="flex items-center gap-1">
            &copy; {currentYear} Durga Handicrafts. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Made with <Heart size={16} className="text-red-500 fill-current animate-pulse" /> for quality furniture
          </p>
          <div className="flex space-x-4">
            <Link to="/privacy" className="hover:text-wood-accent transition-colors">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-wood-accent transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;