import { Link } from 'react-router-dom';
import krishnaImage from '../assets/krishna.png';

function Hero() {
  return (
    <section
      className="relative bg-amber-50 h-[50vh] sm:h-[60vh] w-full"
      style={{
        backgroundImage: `url(${krishnaImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Semi-transparent overlay for readability */}
      <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm"></div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-50 mb-4 mt-8">
          Durga Handicrafts
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-amber-200 mb-6 max-w-lg">
          Discover handcrafted wooden temple almirahs and furniture that bring elegance and spirituality to your home.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            to="/dashboard"
            className="bg-amber-700 text-amber-50 px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:bg-amber-600 transition duration-300 transform hover:scale-105"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;