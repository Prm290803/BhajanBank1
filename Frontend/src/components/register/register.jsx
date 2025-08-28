import { useState } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { UserIcon, AtSymbolIcon, KeyIcon } from '@heroicons/react/24/solid';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('⚠️ Your mantras do not match');
      return;
    }

    if (password.length < 8) {
      setError('⚠️ Sacred mantra should be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(name, email, password);

      if (result.success) {
        navigate('/login');
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#faf6f1]">
      {/* Left Inspiration Panel */}
      <div className="hidden md:flex w-1/2 bg-orange-900 text-white flex-col items-center justify-center p-10 relative">
        <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
          જય શ્રી સ્વામિનારાયણ
        </h1>
        <p className="text-lg font-medium text-gray-300">
          Begin your divine journey with <span className="font-bold">Bhajan Bank</span>
        </p>
       
      </div>

      {/* Right Form Section */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-b from-[#fffaf5] to-[#fff3e8] relative">
      <img
          src="/1.png" // replace with your logo file
          alt="Logo"
          className="absolute top-4 left-6 w-14 h-14 "
        />
        <div className="w-full max-w-md bg-gradient-to-b from-orange-200 to-orange-100 shadow-2xl rounded-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-[#E56210] rounded-full flex items-center justify-center mb-4 shadow-lg">
              <span className="text-2xl text-white font-bold">श्री</span>
            </div>
            <h2 className="text-3xl font-bold text-[#E56210]">Begin Your Journey</h2>
            <p className="mt-2 text-[#b14c0e] italic">Join our spiritual family</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            
            <div className="relative">
              <UserIcon className="h-5 w-5 absolute left-3 top-3 text-[#E56210]" />
              <input
                type="text"
                placeholder="Spiritual Name"
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E56210] focus:border-[#E56210]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <AtSymbolIcon className="h-5 w-5 absolute left-3 top-3 text-[#E56210]" />
              <input
                type="email"
                placeholder="Email / Divine ID"
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E56210] focus:border-[#E56210]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <KeyIcon className="h-5 w-5 absolute left-3 top-3 text-[#E56210]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Sacred Mantra (min 8 characters)"
                className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-[#E56210] focus:border-[#E56210]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-[#E56210]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <KeyIcon className="h-5 w-5 absolute left-3 top-3 text-[#E56210]" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Sacred Mantra"
                className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-[#E56210] focus:border-[#E56210]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-[#E56210]"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#E56210] to-[#FF7722] hover:from-[#ff8c42] hover:to-[#ff6a00] shadow-lg transition"
            >
              {isLoading ? 'Initiating Devotion...' : 'Join Spiritual Family'}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-[#b14c0e]">
            Already initiated?{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-[#E56210] hover:text-[#ff6a00] underline"
            >
              Enter Divine Portal
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-[#b14c0e]">
            श्री स्वामिनारायणाय नमः
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
