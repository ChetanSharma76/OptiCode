import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiCheck, FiBookmark } from 'react-icons/fi';

const DSATags = [
  'Array', 'String', 'Hash Table', 'Math', 'Dynamic Programming', 
  'Sorting', 'Greedy', 'DFS', 'Binary Search', 'BFS',
  'Tree', 'Graph', 'Linked List', 'Recursion', 'Stack', 'Queue',
  'Matrix', 'Heap', 'Sliding Window', 'Union Find', 'Trie'
];

const Problems = () => {
  const { problems, token, backendUrl, userData, setUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarkingProblem, setBookmarkingProblem] = useState(null);

  // Fix filter visibility on load and handle initial loading
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle loading state based on problems data
  useEffect(() => {
    if (problems !== undefined) {
      // Add a small delay to show the loading state
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [problems]);

  const getTagColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'hard': return 'bg-rose-100 text-rose-800 border-rose-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const filteredProblems = problems?.filter(problem => {
    const matchesDifficulty = !selectedDifficulty || problem.difficulty === selectedDifficulty;
    const matchesTags = selectedTags.length === 0 || 
      problem.tags.some(tag => selectedTags.includes(tag));
    return matchesDifficulty && matchesTags;
  });

  const onSolveHandler = (id) => {
    if (token) {
      navigate(`/problems/${id}`);
    } else {
      toast.error('Please login to solve problems');
    }
  };

  // Enhanced bookmark functionality with proper state management
  const handleBookmark = async (problemId) => {
    if (!token) {
      toast.error('Please login to bookmark problems');
      return;
    }

    setBookmarkingProblem(problemId);
    
    try {
      const isBookmarked = userData?.bookmarks?.includes(problemId);
      console.log(isBookmarked);
      
      const response = await axios.post(
        `${backendUrl}/api/user/bookmark`,
        { problemId },
        { headers: { token } }
      );

      if (response.data.success) {
        // Update user state immediately for instant UI feedback
        setUserData(prevUser => {
          const updatedBookmarks = isBookmarked 
            ? prevUser.bookmarks.filter(id => id !== problemId)
            : [...(prevUser.bookmarks || []), problemId];
          
          return {
            ...prevUser,
            bookmarks: updatedBookmarks
          };
        });
        toast.success(isBookmarked ? 'Bookmark removed' : 'Problem bookmarked');
      } else {
        toast.error(response.data.message || 'Failed to update bookmark');
      }
    } catch (error) {
      console.error('Bookmark error:', error);
      toast.error('Failed to update bookmark');
    } finally {
      setBookmarkingProblem(null);
    }
  };

  const resetFilters = () => {
    setSelectedDifficulty(null);
    setSelectedTags([]);
    setIsTagsDropdownOpen(false);
  };

  // Loading Screen Component - Same as other pages
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#07034d] to-[#1e0750] flex items-center justify-center">
        <div className="text-center">
          {/* Golden Spinning Circle */}
          <div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          
          {/* Loading Text */}
          <h2 className="text-xl font-semibold text-amber-400 mb-2">Loading Challenges</h2>
          <p className="text-indigo-200 text-sm">Please wait while we fetch the latest coding problems...</p>
          
          {/* Optional: Animated dots */}
          <div className="flex justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07034d] to-[#1e0750] py-30 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row">
        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-sm text-amber-400"
          >
            <FiFilter /> {isSidebarOpen ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        {/* Filter Sidebar */}
        {isSidebarOpen && (
          <div className="w-full md:w-56 flex-shrink-0 md:mr-6 mb-6 md:mb-0">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-2 md:mt-25">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <FiFilter /> Filters
                </h2>
                {(selectedDifficulty || selectedTags.length > 0) && (
                  <button 
                    onClick={resetFilters}
                    className="text-xs text-indigo-300 hover:text-white"
                  >
                    <FiX size={14} />
                  </button>
                )}
              </div>

              {/* Difficulty Filter */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-indigo-200 mb-2">DIFFICULTY</h3>
                <div className="space-y-2">
                  {['easy', 'medium', 'hard'].map(difficulty => (
                    <button
                      key={difficulty}
                      onClick={() => setSelectedDifficulty(
                        selectedDifficulty === difficulty ? null : difficulty
                      )}
                      className={`w-full text-xs font-medium px-3 py-1 rounded-full border transition-all ${
                        selectedDifficulty === difficulty 
                          ? getTagColor(difficulty) + ' shadow-md'
                          : 'bg-gray-800/50 text-gray-300 border-gray-600 hover:bg-gray-700/50'
                      }`}
                    >
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <h3 className="text-xs font-semibold text-indigo-200 mb-2">TOPICS</h3>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTagsDropdownOpen(!isTagsDropdownOpen);
                    }}
                    className="w-full flex items-center justify-between bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border border-gray-600 rounded-lg px-3 py-1.5 text-xs transition-colors"
                  >
                    <span className="truncate">
                      {selectedTags.length > 0 
                        ? `${selectedTags.length} selected` 
                        : "All Topics"}
                    </span>
                    {isTagsDropdownOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                  </button>

                  {isTagsDropdownOpen && (
                    <div 
                      className="absolute z-20 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2">
                        <input 
                          type="text" 
                          placeholder="Search topics..."
                          className="w-full bg-gray-700/50 border border-gray-600 rounded px-2 py-1 text-xs text-white mb-1"
                        />
                      </div>
                      <div className="space-y-1 p-1">
                        {DSATags.map(tag => (
                          <div 
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className="flex items-center px-2 py-1 hover:bg-gray-700/50 cursor-pointer transition-colors rounded text-xs"
                          >
                            <div className={`w-3 h-3 rounded-sm border mr-2 flex items-center justify-center ${
                              selectedTags.includes(tag) 
                                ? 'bg-indigo-500 border-indigo-500' 
                                : 'border-gray-500'
                            }`}>
                              {selectedTags.includes(tag) && <FiCheck size={10} className="text-white" />}
                            </div>
                            <span className="text-gray-200 truncate">{tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Tags */}
                {selectedTags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedTags.map(tag => (
                      <span 
                        key={tag}
                        className="text-[0.65rem] font-medium px-1.5 py-0.5 bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 rounded-full flex items-center"
                      >
                        {tag}
                        <button 
                          onClick={() => toggleTag(tag)}
                          className="ml-0.5 hover:text-white"
                        >
                          <FiX size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-amber-400 sm:text-3xl mb-2">
              Coding Challenges
            </h1>
            <p className="text-sm text-indigo-200">
              Sharpen your skills with our curated problems
            </p>
          </div>

          {/* Problems List with increased vertical spacing */}
          <div className="space-y-3">
            {filteredProblems && filteredProblems.length > 0 ? (
              filteredProblems.map((problem, index) => (
                <div
                  key={problem._id}
                  className={`transition-all duration-200 hover:shadow-md ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } rounded-lg shadow-sm overflow-hidden border border-gray-200 md:mr-15 md:ml-25`}
                >
                  <div className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`text-[0.65rem] font-semibold px-1.5 py-0.5 rounded-full border ${getTagColor(problem.difficulty)}`}>
                            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                          </span>
                          <h2 className="text-sm font-bold text-gray-800 truncate">
                            {problem.title}
                          </h2>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {problem.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="text-[0.6rem] font-medium px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Enhanced Bookmark Button - Only show if user is logged in */}
                        {token && (
                          <button
                            onClick={() => handleBookmark(problem._id)}
                            disabled={bookmarkingProblem === problem._id}
                            className={`p-1.25 rounded-full transition-all duration-200 ${
                              userData?.bookmarks?.includes(problem._id)
                                ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            } ${bookmarkingProblem === problem._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={userData?.bookmarks?.includes(problem._id) ? 'Remove bookmark' : 'Add bookmark'}
                          >
                            {bookmarkingProblem === problem._id ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <FiBookmark 
                                size={14} 
                                fill={userData?.bookmarks?.includes(problem._id) ? 'currentColor' : 'none'} 
                              />
                            )}
                          </button>
                        )}

                        {/* Solve Button */}
                        <button
                          onClick={() => onSolveHandler(problem._id)}
                          className="flex-shrink-0 text-xs font-medium px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow hover:shadow-md transition"
                        >
                          Solve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-white/5 rounded-lg border border-white/10">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100/10 rounded-full mb-2">
                  <svg
                    className="w-6 h-6 text-indigo-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-base font-medium text-white mb-1">
                  No problems found
                </h3>
                <p className="text-indigo-200 text-xs">
                  {selectedDifficulty || selectedTags.length > 0
                    ? "Try adjusting your filters" 
                    : "Check back later for new challenges"}
                </p>
              </div>
            )}  
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problems;
