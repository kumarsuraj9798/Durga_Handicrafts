import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import NavAuthenticated from '../components/NavAuthenticated';

function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    navigate('/checkout', { state: { cart } });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-light px-4 py-6 font-sans">
      <NavAuthenticated />
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Your Cart</h2>
        {cart.length === 0 ? (
          <p className="text-center text-gray-400">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
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
                    <h3 className="text-base sm:text-lg font-semibold text-text-light">{item.name}</h3>
                    <p className="text-sm text-gray-400">Price: ₹{item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm sm:text-base font-semibold text-text-light">
                    Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <p className="text-base sm:text-lg font-semibold text-right text-text-light">
              Total: ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={clearCart}
                className="bg-gray-600 text-text-light py-2 px-4 rounded-lg hover:bg-gray-500 transition"
              >
                Clear Cart
              </button>
              <button
                onClick={handleProceedToCheckout}
                className="bg-wood-accent text-dark-bg py-2 px-4 rounded-lg hover:bg-opacity-80 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;