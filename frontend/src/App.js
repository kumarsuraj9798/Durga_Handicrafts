import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import About from './pages/About';
import Profile from './pages/Profile';
import Login from './components/Login';

function App() {
  const isAuthenticated = () => !!localStorage.getItem('token');
  const isAdmin = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.email === process.env.REACT_APP_ADMIN_EMAIL && user.role === 'admin';
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/dashboard"
              element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/cart"
              element={isAuthenticated() ? <Cart /> : <Navigate to="/login" />}
            />
            <Route
              path="/checkout"
              element={isAuthenticated() ? <Checkout /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={
                isAuthenticated() ? (
                  isAdmin() ? (
                    <Admin />
                  ) : (
                    <Navigate
                      to="/dashboard"
                      replace
                      state={{ error: 'Only admin can access the admin panel' }}
                    />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </CartProvider>
    </GoogleOAuthProvider>
  );
}

export default App;