import React, { useState, useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AdminContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${backendUrl}/api/user/login`, {
        email,
        password,
      });
      if (data.success) {
        setToken(data.token);
        toast.success('Login successfully');
        localStorage.setItem('token', data.token);
        navigate('/admin-stats');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#07034d] to-[#1e0750] px-4 py-25 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-34 bg-purple-600 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-34 bg-indigo-600 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-34 bg-blue-600 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-100 max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-violet-600 to-pink-500 text-center p-2">
            <h2 className="text-2xl font-bold text-white">Admin Login</h2>
            <p className="text-indigo-100 mt-1">Sign in to your dashboard</p>
          </div>
          
          {/* Card Body */}
          <div className="p-8">
            <form onSubmit={onSubmitHandler} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-indigo-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-white/30 rounded bg-white/10"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-indigo-100">
                    Remember me
                  </label>
                </div>

                <div className="text-sm cursor-pointer">
                  <button 
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="font-medium text-violet-300 hover:text-violet-200 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center cursor-pointer items-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;