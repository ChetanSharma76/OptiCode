import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiBookmark, FiExternalLink, FiCode, FiTrendingUp, FiAward, FiCalendar } from 'react-icons/fi';

const Myprofile = () => {
  const { userData, setUserData, backendUrl, token, problems } = useContext(AppContext);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: userData?.username || '',
    email: userData?.email || '',
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(userData?.profileImage);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (userData?.profileImage) {
      setPreview(userData.profileImage);
    }
  }, [userData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    formData.append('username', form.username);
    formData.append('email', form.email);
    if (image) {
      formData.append('image', image);
    }

    try {
      const res = await axios.put(`${backendUrl}/api/user/update-profile`, formData, {
        headers: {
          token,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUserData((prev) => ({
        ...prev,
        username: res.data.updatedUser.username || prev.username,
        email: res.data.updatedUser.email || prev.email,
        profileImage: res.data.updatedUser.profileImage || prev.profileImage,
      }));

      setPreview(res.data.updatedUser.profileImage);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      // console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setIsUploading(false);
    }
  };

  const getBookmarkedProblems = () => {
    if (!userData?.bookmarks || !problems) return [];
    return problems.filter(problem => userData.bookmarks.includes(problem._id));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'hard': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const handleProblemClick = (problemId) => {
    navigate(`/problems/${problemId}`);
  };

  if (!userData) return (
    <div className="min-h-screen bg-gradient-to-br from-[#07034d] to-[#1e0750] flex items-center justify-center">
      <div className="text-center">
        {/* Golden Spinning Circle */}
        <div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
        
        {/* Loading Text */}  
        <h2 className="text-xl font-semibold text-amber-400 mb-2">Loading Profile</h2>
        <p className="text-indigo-200 text-sm">Please wait while we fetch your profile details...</p>
        
        {/* Optional: Animated dots */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );


  const bookmarkedProblems = getBookmarkedProblems();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#07034d] to-[#1e0750] px-4 py-20"
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-28 h-28 rounded-full bg-indigo-500/10 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center py-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500"
        >
          My Profile
        </motion.h1>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="xl:col-span-1 space-y-6">
            {/* Profile Section */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden"
            >
              <div className="flex flex-col items-center gap-6">
                {/* Profile Image Section */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="relative group">
                    {preview && (
                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        src={preview}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-indigo-500/80 object-cover shadow-lg group-hover:border-indigo-400 transition-all duration-300"
                      />
                    )}
                    <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>

                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setImage(file);
                      if (file) {
                        setPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                  />

                  <label
                    htmlFor="profile-upload"
                    className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    Choose Image
                  </label>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={isUploading}
                    className={`px-4 py-2 rounded-lg shadow-lg transition-all duration-300 text-sm ${
                      isUploading 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white'
                    }`}
                  >
                    {isUploading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </span>
                    ) : (
                      'Upload Image'
                    )}
                  </motion.button>
                </motion.div>

                {/* Profile Info Section */}
                {!editing ? (
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4 w-full text-center"
                  >
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-white">{userData.username}</h2>
                      <p className="text-indigo-300">{userData.email}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setEditing(true)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2.5 rounded-lg shadow-lg transition-all duration-300 flex items-center mx-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.form 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6 w-full"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-2 text-indigo-300">Name</label>
                      <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-indigo-300">Email</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 transition-all"
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-6 py-2.5 rounded-lg shadow-lg transition-all duration-300 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={() => setEditing(false)}
                        className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-2.5 rounded-lg shadow-lg transition-all duration-300 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                <FiCode className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{userData.submissionsCount || 0}</p>
                <p className="text-sm text-gray-400">Submissions</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                <FiBookmark className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{userData.bookmarks?.length || 0}</p>
                <p className="text-sm text-gray-400">Bookmarks</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Content Sections */}
          <div className="xl:col-span-2 space-y-8">
            {/* Bookmarks Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <FiBookmark className="h-6 w-6 text-yellow-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                  My Bookmarks
                </h2>
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.005 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-6 transition-all duration-300"
              >
                {bookmarkedProblems && bookmarkedProblems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookmarkedProblems.map((problem, idx) => (
                      <motion.div
                        key={problem._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleProblemClick(problem._id)}
                        className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                            {problem.title}
                          </h3>
                          <FiExternalLink className="h-4 w-4 text-gray-400 group-hover:text-indigo-400 transition-colors flex-shrink-0 ml-2" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {problem.tags?.slice(0, 2).map((tag, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                            {problem.tags?.length > 2 && (
                              <span className="text-xs px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full">
                                +{problem.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center py-12"
                  >
                    <FiBookmark className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Bookmarks Yet</h3>
                    <p className="text-gray-400 mb-6">
                      Start bookmarking problems to save them for later!
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/problems')}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center mx-auto"
                    >
                      <FiCode className="h-5 w-5 mr-2" />
                      Browse Problems
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* My Submissions Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <FiTrendingUp className="h-6 w-6 text-green-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                  My Submissions
                </h2>
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.005 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-6 transition-all duration-300"
              >
                {userData.solvedProblems && userData.solvedProblems.length > 0 ? (
                  <div className="space-y-3">
                    {userData.solvedProblems.map((prob, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300 group"
                      >
                        <div className="flex items-center">
                          <div className="mr-4 text-indigo-400 font-bold text-sm">{idx + 1}.</div>
                          <FiAward className="h-5 w-5 text-green-400 mr-3" />
                          <span className="text-white font-medium group-hover:text-indigo-300 transition-colors">
                            {prob.title}
                          </span>
                        </div>
                        <div className="text-xs text-green-300 bg-green-900/30 px-3 py-1 rounded-full border border-green-500/30">
                          Solved
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center py-12"
                  >
                    <FiCode className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Submissions Yet</h3>
                    <p className="text-gray-400 mb-6">
                      Start solving problems to see them here!
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/problems')}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center mx-auto"
                    >
                      <FiCode className="h-5 w-5 mr-2" />
                      Browse Problems
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Myprofile;
