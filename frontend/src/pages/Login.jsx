import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const [state, setState] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (state === 'signup') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          username,
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          toast.success('Account created successfully');
          localStorage.setItem('token', data.token);
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        if (data.success) {
          setToken(data.token);
          toast.success('Login successful');
          localStorage.setItem('token', data.token);
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#07034d] to-[#1e0750] p-4">
      <div className="w-100 max-w-md">
        {/* Animated Card */}
        <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/10 transition-all duration-300 hover:shadow-2xl mt-20">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-pink-500"></div>
          
          {/* Form content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {state === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-white/70">
                {state === 'login' ? 'Login to continue your journey' : 'Join us to get started'}
              </p>
            </div>

            <form className="space-y-5">
              {state === 'signup' && (
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-white/50 transition-all pl-12"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <span className="absolute left-4 top-3 text-white/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              )}

              <div className="relative">
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-white/50 transition-all pl-12"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="absolute left-4 top-3 text-white/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
              </div>

              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-white/50 transition-all pl-12"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="absolute left-4 top-3 text-white/50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>

              <button
                onClick={onSubmitHandler}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-violet-600 to-pink-500 text-white py-3 rounded-lg cursor-pointer font-semibold hover:opacity-90 transition duration-300 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {state === 'login' ? 'Logging in...' : 'Creating account...'}
                  </>
                ) : (
                  state === 'login' ? 'Login' : 'Sign Up'
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-white/70">
              {state === 'login' ? (
                <div className="flex flex-col space-y-3">
                  <div 
                    onClick={() => navigate('/forgot-password')} 
                    className="text-violet-300 hover:text-violet-200 cursor-pointer transition"
                  >
                    Forgot password?
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>Don't have an account?</span>
                    <button
                      onClick={() => setState('signup')}
                      className="text-violet-300 hover:text-violet-200 font-medium transition cursor-pointer"
                    >
                      Sign up
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Already have an account?</span>
                  <button
                    onClick={() => setState('login')}
                    className="text-violet-300 hover:text-violet-200 font-medium transition cursor-pointer"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;