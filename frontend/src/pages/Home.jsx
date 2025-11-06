
import { useState, useEffect } from 'react';
import api from '../services/api';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import krishnaImage from '../assets/krishna.png';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch featured products (limit to 4 for landing page)
    api
      .get('/products?limit=4')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div
      className="min-h-screen bg-dark-bg text-text-light font-sans"
      style={{
        backgroundImage: `url(${krishnaImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        opacity: 0.95, // Slight transparency to blend with dark theme
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto bg-gray-800/80 backdrop-blur-sm">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-text-light">
          Featured Furniture
        </h2>
        <FeaturedProducts products={products} />
      </section>

      {/* About Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-800/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-text-light">
            Crafted with Tradition
          </h2>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            At Durga Handicrafts, we specialize in handcrafted wooden temple almirahs and furniture,
            blending tradition with modern elegance. Each piece is meticulously crafted to bring
            warmth, serenity, and beauty to your home.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto bg-gray-800/80 backdrop-blur-sm">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-text-light">
          What Our Customers Say
        </h2>
        <Testimonials />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;



// import { useState, useEffect } from 'react';
// import api from '../services/api';
// import Hero from '../components/Hero';
// import FeaturedProducts from '../components/FeaturedProducts';
// import Testimonials from '../components/Testimonials';
// import Footer from '../components/Footer';
// import Navbar from '../components/Navbar';
// import krishnaImage from '../assets/krishna.png';

// function Home() {
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     // Fetch featured products (limit to 4 for landing page)
//     api
//       .get('/products?limit=4')
//       .then(res => setProducts(res.data))
//       .catch(err => {
//         console.error('Products fetch error:', err);
//         setError('Failed to load featured products. Please try again later.');
//         setTimeout(() => setError(''), 3000);
//       });
//   }, []);

//   return (
//     <div
//       className="min-h-screen bg-dark-bg text-text-light font-sans relative"
//       style={{
//         backgroundImage: `url(${krishnaImage})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundAttachment: 'fixed',
//         backgroundRepeat: 'no-repeat',
//         minHeight: '100vh',
//         width: '100vw',
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         zIndex: -1,
//       }}
//     >
//       <div className="relative z-10">
//         {error && (
//           <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center text-sm sm:text-base max-w-screen-xl mx-auto">
//             {error}
//             <button
//               onClick={() => setError('')}
//               className="ml-4 text-xs sm:text-sm underline"
//             >
//               Dismiss
//             </button>
//           </div>
//         )}
//         {/* Navbar */}
//         <Navbar />

//         {/* Hero Section */}
//         <Hero />

//         {/* Featured Products */}
//         <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto bg-gray-800/80 backdrop-blur-sm">
//           <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-text-light">
//             Featured Furniture
//           </h2>
//           <FeaturedProducts products={products} />
//         </section>

//         {/* About Section */}
//         <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-800/80 backdrop-blur-sm">
//           <div className="max-w-3xl mx-auto text-center">
//             <h2 className="text-xl sm:text-2xl font-bold mb-4 text-text-light">
//               Crafted with Tradition
//             </h2>
//             <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
//               At Durga Handicrafts, we specialize in handcrafted wooden temple almirahs and furniture,
//               blending tradition with modern elegance. Each piece is meticulously crafted to bring
//               warmth, serenity, and beauty to your home.
//             </p>
//           </div>
//         </section>

//         {/* Testimonials */}
//         <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto bg-gray-800/80 backdrop-blur-sm">
//           <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-text-light">
//             What Our Customers Say
//           </h2>
//           <Testimonials />
//         </section>

//         {/* Footer */}
//         <Footer />
//       </div>
//     </div>
//   );
// }

// export default Home;