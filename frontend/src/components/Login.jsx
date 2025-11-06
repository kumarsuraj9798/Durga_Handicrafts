
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from './Navbar';
function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSuccess = async (credentialResponse) => {
    try {
      const { data } = await api.post('/auth/google', { token: credentialResponse.credential });
      // Store JWT in localStorage
      try{
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('User cookies stored successfully');
      } catch(err){
        console.error('Error in storing user cookies:', err);
      }
      navigate('/dashboard');
      window.location.reload(); // Force a refresh to ensure state is updated
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="bg-gray-900 p-8 rounded-lg shadow-md border border-wood-accent max-w-md w-full">
          <h2 className="text-2xl font-bold text-text-light mb-6 text-center">
            Login to Durga Handicrafts
          </h2>
          {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => setError('Google Login failed. Please try again.')}
              theme="filled_black"
              size="large"
              text="continue_with"
            />
          </div>
          <p className="text-sm text-text-light mt-4 text-center">
            Sign in with Google to explore our handcrafted furniture.
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
