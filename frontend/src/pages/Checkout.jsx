// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useCart } from '../context/CartContext'; // Assuming CartContext from prior responses
// import api from '../services/api';

// function Checkout() {
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { cart, setCart } = useCart();
//   const cartData = location.state?.cart || cart; // Fallback to context cart

//   const handlePlaceOrder = async () => {
//     if (loading) return; // Prevent multiple submissions
//     setLoading(true);
//     setError('');
//     setSuccess('');
//     try {
//       if (cartData.length === 0) {
//         throw new Error('Cart is empty.');
//       }
//       const orderRequest = {
//         items: cartData.map(item => ({
//           product_id: item.product_id,
//           quantity: item.quantity,
//         })),
//       };
//       await api.post('/orders', orderRequest);
//       setSuccess('Order placed successfully!');
//       setCart([]); // Clear cart
//       setTimeout(() => {
//         navigate('/dashboard');
//       }, 2000);
//     } catch (err) {
//       const errorMessage = Array.isArray(err.response?.data)
//         ? err.response.data.map(e => e.msg).join('; ')
//         : err.response?.data?.detail || err.message || 'Failed to place order. Please try again.';
//       setError(errorMessage);
//       setTimeout(() => setLoading(false), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-dark-bg text-text-light px-4 py-6 font-sans">
//       <div className="max-w-4xl mx-auto">
//         <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Checkout</h2>
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
//         {success && (
//           <div className="bg-green-600 text-white p-4 rounded-lg mb-6 text-center text-sm sm:text-base">
//             {success}
//             <button
//               onClick={() => setSuccess('')}
//               className="ml-4 text-xs sm:text-sm underline"
//             >
//               Dismiss
//             </button>
//           </div>
//         )}
//         <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md border border-wood-accent">
//           <h3 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h3>
//           {cartData.length === 0 ? (
//             <p className="text-center text-sm sm:text-base">No items in cart.</p>
//           ) : (
//             <div className="space-y-4">
//               {cartData.map(item => (
//                 <div
//                   key={item.product_id}
//                   className="p-4 bg-gray-800 rounded-lg border border-wood-accent flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
//                 >
//                   <div>
//                     <h4 className="text-base sm:text-md font-semibold">{item.name}</h4>
//                     <p className="text-sm text-gray-400">Price: ${item.price.toFixed(2)}</p>
//                     <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
//                   </div>
//                   <p className="text-sm sm:text-base font-semibold">
//                     Subtotal: ${(item.price * item.quantity).toFixed(2)}
//                   </p>
//                 </div>
//               ))}
//               <p className="text-base sm:text-lg font-semibold text-right">
//                 Total: ₹{cartData.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
//               </p>
//               <button
//                 onClick={handlePlaceOrder}
//                 disabled={loading || cartData.length === 0}
//                 className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 mt-4 ${
//                   loading || cartData.length === 0
//                     ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
//                     : 'bg-wood-accent text-dark-bg hover:bg-opacity-80'
//                 }`}
//               >
//                 {loading ? 'Processing...' : 'Place Order'}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Checkout;

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import NavAuthenticated from '../components/NavAuthenticated';

function Checkout() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const cartData = location.state?.cart || cart;

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (cartData.length === 0) {
        throw new Error('Cart is empty.');
      }
      const orderRequest = {
        items: cartData.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };
      const response = await api.post('/orders', orderRequest);
      setSuccess(response.data.message || 'Order placed successfully!');
      setCart([]);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Order error:', err);
      if (err.response?.status === 400 && err.response.data.unavailable) {
        const unavailableMsg = err.response.data.unavailable.join('; ');
        const processedMsg = err.response.data.processed ? ' (some items processed)' : '';
        setError(`${unavailableMsg}${processedMsg}. Unavailable items removed from cart.`);
        const unavailableIds = err.response.data.unavailable.map(msg => {
          const match = msg.match(/Product ID (\w+)/);
          return match ? match[1] : null;
        }).filter(id => id);
        setCart(prevCart => prevCart.filter(item => !unavailableIds.includes(item.product_id)));
      } else {
        const errorMessage = Array.isArray(err.response?.data)
          ? err.response.data.map(e => `${e.loc.join('.')}: ${e.msg}`).join('; ')
          : err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to place order. Please try again.';
        setError(errorMessage);
      }
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-light px-4 py-6 font-sans">
      <NavAuthenticated />
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Checkout</h2>
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
        {success && (
          <div className="bg-green-600 text-white p-4 rounded-lg mb-6 text-center text-sm sm:text-base">
            {success}
            <button
              onClick={() => setSuccess('')}
              className="ml-4 text-xs sm:text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}
        <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md border border-wood-accent">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Order Summary</h3>
          {cartData.length === 0 ? (
            <p className="text-center text-sm sm:text-base">No items in cart.</p>
          ) : (
            <div className="space-y-4">
              {cartData.map(item => (
                <div
                  key={item.product_id}
                  className="p-4 bg-gray-800 rounded-lg border border-wood-accent flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image_url || '/fallback-image.jpg'}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md"
                      onError={(e) => {
                        console.error(`Failed to load image: ${item.image_url || 'fallback'}`);
                        e.target.src = '/fallback-image.jpg';
                        e.target.onerror = null; // Prevent infinite retry loop
                      }}
                    />
                    <div>
                      <h4 className="text-base sm:text-md font-semibold text-text-light">{item.name}</h4>
                      <p className="text-sm text-gray-400">Price: ₹{item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-text-light">
                    Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <p className="text-base sm:text-lg font-semibold text-right text-text-light">
                Total: ₹{cartData.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
              </p>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 mt-4 ${
                  loading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-wood-accent text-dark-bg hover:bg-opacity-80'
                }`}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;