// import { useState, useEffect } from 'react';
//   }, []);

//   const handleAddToCart = (product) => {
//     addToCart(product);
//     navigate('/cart');
//   };

//   return (
//     <div className="min-h-screen bg-dark-bg text-text-light px-4 py-6 font-sans">
//       <NavAuthenticated />
//       <div className="max-w-screen-xl mx-auto">
//         <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Our Furniture</h2>
//         {error && (
//           <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center text-sm sm:text-base">
//             {error}
//             <button
//               onClick={() => setError('')}
//               className="ml-4 text-xs sm:text-sm underline"
//             >
//               Dismiss
//             </button>
//           </div>
//         )}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {products.length === 0 ? (
//             <p className="text-center text-gray-400 col-span-full">No products available.</p>
//           ) : (
//             products.map(product => (
//               <div
//                 key={product._id}
//                 className="bg-gray-800 rounded-lg shadow-md border border-wood-accent p-4"
//               >
//                 <img
//                   src={`${baseUrl}${product.image}`}
//                   alt={product.name}
//                   className="w-full h-48 object-cover rounded-md mb-4"
//                   onError={(e) => {
//                     console.error(`Failed to load image: ${baseUrl}${product.image}`);
//                     e.target.src = '/fallback-image.jpg';
//                   }}
//                 />
//                 <h3 className="text-lg font-semibold text-text-light">{product.name}</h3>
//                 <p className="text-gray-400 text-sm">{product.description}</p>
//                 <p className="text-text-light font-semibold mt-2">₹{product.price.toFixed(2)}</p>
//                 <button
//                   onClick={() => handleAddToCart(product)}
//                   className="mt-4 w-full bg-wood-accent text-dark-bg py-2 rounded-lg hover:bg-opacity-80 transition"
//                 >
//                   Add to Cart
//                 </button>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import NavAuthenticated from '../components/NavAuthenticated';
import PhoneNumberModal from '../components/PhoneNumberModal';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && !user.phone_number) {
      setShowPhoneModal(true);
    }

    api
      .get('/products')
      .then(res => {
        console.log('Products fetched:', res.data);
        setProducts(res.data);
      })
      .catch(err => {
        console.error('Products fetch error:', err);
        setError('Failed to load products. Please try again.');
        setTimeout(() => setError(''), 3000);
      });
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-light px-4 py-6 font-sans">
      <NavAuthenticated />
      {showPhoneModal && <PhoneNumberModal onSuccess={() => setShowPhoneModal(false)} />}
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Our Handicrafts</h2>
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center text-sm sm:text-base">
            {error}
            <button
              onClick={() => setError('')}
              className="ml-4 text-xs sm:text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full">No products available.</p>
          ) : (
            products.map(product => (
              <div
                key={product._id}
                className="bg-gray-800 rounded-lg shadow-md border border-wood-accent p-4"
              >
                <img
                  src={product.image_url || '/fallback-image.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  onError={(e) => {
                    console.error(`Failed to load image: ${product.image_url || 'fallback'}`);
                    e.target.src = '/fallback-image.jpg';
                    e.target.onerror = null; // Prevent infinite retry loop
                  }}
                />
                <h3 className="text-lg font-semibold text-text-light">{product.name}</h3>
                <p className="text-gray-400 text-sm">{product.category}</p>
                <p className="text-text-light font-semibold mt-2">₹{product.price.toFixed(2)}</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-4 w-full bg-wood-accent text-dark-bg py-2 rounded-lg hover:bg-opacity-80 transition"
                >
                  Add to Cart
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;