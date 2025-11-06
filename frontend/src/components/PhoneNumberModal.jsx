import { useState } from 'react';
import api from '../services/api';

function PhoneNumberModal({ onSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/\d{10}/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    try {
      await api.post('/user/phone', { phone_number: phoneNumber });
      // Update user in localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      user.phone_number = phoneNumber;
      localStorage.setItem('user', JSON.stringify(user));
      onSuccess();
    } catch (err) {
      setError('Failed to save phone number. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md border border-wood-accent max-w-sm w-full">
        <h2 className="text-2xl font-bold text-text-light mb-4 text-center">Phone Number Required</h2>
        <p className="text-text-light mb-6 text-center">Please provide your phone number to proceed with placing orders.</p>
        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="10-digit phone number"
            className="w-full p-2 rounded-lg bg-gray-800 text-text-light border border-wood-accent mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-wood-accent text-dark-bg py-2 rounded-lg hover:bg-opacity-80 transition"
          >
            Save and Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default PhoneNumberModal;
