import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { login } from '../api';

export default function LoginPage() {
  const [email, setEmail] = useState('eve.holt@reqres.in');
  const [password, setPassword] = useState('cityslicka');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(email, password);
      localStorage.setItem('token', response.token);
      toast.success('Login successful!');
      navigate('/users');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white/90 backdrop-blur-lg p-5 sm:p-8 rounded-2xl shadow-2xl hover-lift">
          <div className="text-center">
            <div className="mx-auto h-14 w-14 sm:h-16 sm:w-16 gradient-bg rounded-2xl flex items-center justify-center transform transition-transform hover:rotate-12">
              <LogIn size={24} className="text-white sm:size-[32px]" />
            </div>
            <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
          </div>

          <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3 sm:space-y-4">
              <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
                />
              </div>

              <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-indigo-300"
                />
              </div>
            </div>

            <div className="animate-slide-in" style={{ animationDelay: '0.3s' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 sm:py-3 px-3 sm:px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}