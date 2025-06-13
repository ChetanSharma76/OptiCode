import React, { useState, useEffect, useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { 
  Users, 
  UserCheck, 
  FileText, 
  Filter, 
  Search, 
  Download,
  RefreshCw,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  File
} from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminStatistics = () => {
  // Get data from AdminContext
  const { 
    adminData, 
    setAdminData, 
    token, 
    setToken, 
    getAdminData, 
    getProblems, 
    problems, 
    setProblems, 
    backendUrl
  } = useContext(AdminContext);

  // State management
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProblems: 0,
    difficultyData: [],
    topicData: [],
    problems: []
  });

  const [filters, setFilters] = useState({
    difficulty: [],
    topics: [],
    searchTerm: ''
  });

  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [exportFormat, setExportFormat] = useState('csv');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchStatistics();
  }, []);

  // Update stats when problems or adminData changes
  useEffect(() => {
    if (problems && adminData) {
      calculateStatistics();
    }
  }, [problems, adminData]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // Fetch admin data and problems
      await Promise.all([
        getAdminData(),
        getProblems()
      ]);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = async() => {
    if (!problems || !Array.isArray(problems)) return;

    // Calculate difficulty distribution
    const difficultyCount = {
      easy: 0,
      medium: 0,
      hard: 0
    };

    // Calculate topic distribution
    const topicCount = {};

    problems.forEach(problem => {
      // Count difficulties
      if (difficultyCount.hasOwnProperty(problem.difficulty)) {
        difficultyCount[problem.difficulty]++;
      }

      // Count topics/tags
      if (problem.tags && Array.isArray(problem.tags)) {
        problem.tags.forEach(tag => {
          topicCount[tag] = (topicCount[tag] || 0) + 1;
        });
      }
    });

    const totalProblems = problems.length;

    // Create difficulty data for pie chart
    const difficultyData = [
      { 
        name: 'Easy', 
        value: difficultyCount.easy, 
        percentage: totalProblems > 0 ? ((difficultyCount.easy / totalProblems) * 100).toFixed(1) : 0,
        color: '#10B981' 
      },
      { 
        name: 'Medium', 
        value: difficultyCount.medium, 
        percentage: totalProblems > 0 ? ((difficultyCount.medium / totalProblems) * 100).toFixed(1) : 0,
        color: '#F59E0B' 
      },
      { 
        name: 'Hard', 
        value: difficultyCount.hard, 
        percentage: totalProblems > 0 ? ((difficultyCount.hard / totalProblems) * 100).toFixed(1) : 0,
        color: '#EF4444' 
      }
    ];

    // Create topic data for pie chart (top 6 topics)
    const sortedTopics = Object.entries(topicCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6);

    const colors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#6B7280'];
    const topicData = sortedTopics.map(([topic, count], index) => ({
      name: topic,
      value: count,
      color: colors[index] || '#6B7280'
    }));

    let totalUserCount = 0;

    const response = await axios.get(`${backendUrl}/api/user/user-stats`, {headers: { token }});
    // console.log(response)
    try {
      if(response.data.success){
        totalUserCount = response.data.totalUsers;
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      
    }

    // Update stats
    setStats({
      totalUsers: totalUserCount || 0,
      activeUsers: adminData?.activeUsers || 1,
      totalProblems: totalProblems,
      difficultyData: difficultyData,
      topicData: topicData,
      problems: problems
    });

    setFilteredProblems(problems);
  };

  // Get unique topics from all problems for filter buttons
  const getUniqueTopics = () => {
    if (!problems || !Array.isArray(problems)) return [];
    
    const allTopics = problems.reduce((acc, problem) => {
      if (problem.tags && Array.isArray(problem.tags)) {
        acc.push(...problem.tags);
      }
      return acc;
    }, []);
    
    return [...new Set(allTopics)].slice(0, 8); 
  };

  // Filter problems based on selected filters
  useEffect(() => {
    if (!problems || !Array.isArray(problems)) return;

    let filtered = problems;

    if (filters.difficulty.length > 0) {
      filtered = filtered.filter(problem => 
        filters.difficulty.includes(problem.difficulty)
      );
    }

    if (filters.topics.length > 0) {
      filtered = filtered.filter(problem => 
        problem.tags && problem.tags.some(tag => filters.topics.includes(tag))
      );
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    setFilteredProblems(filtered);
  }, [filters, problems]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      difficulty: [],
      topics: [],
      searchTerm: ''
    });
  };

  // Enhanced CSV Export with better formatting
  const exportToCSV = () => {
    const csvData = filteredProblems.map((problem, index) => ({
      'S.No': index + 1,
      'Problem Title': problem.title || 'N/A',
      'Difficulty Level': problem.difficulty ? problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1) : 'N/A',
      'Topics/Tags': problem.tags && problem.tags.length > 0 ? problem.tags.join(', ') : 'No tags',
      'Created Date': problem.createdAt ? new Date(problem.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'N/A',
      'Sample Test Cases': problem.samples ? problem.samples.length : 0,
      'Hidden Test Cases': problem.hiddenTests ? problem.hiddenTests.length : 0,
      'Total Test Cases': (problem.samples?.length || 0) + (problem.hiddenTests?.length || 0),
      'Problem ID': problem._id || 'N/A'
    }));

    // Create CSV header with metadata
    const metadata = [
      `Problems Export Report`,
      `Generated on: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`,
      `Total Problems: ${filteredProblems.length}`,
      `Filters Applied: ${filters.difficulty.length > 0 ? `Difficulty: ${filters.difficulty.join(', ')}` : ''}${filters.topics.length > 0 ? ` | Topics: ${filters.topics.join(', ')}` : ''}${filters.searchTerm ? ` | Search: "${filters.searchTerm}"` : ''}`,
      ``,
      ``
    ];

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      ...metadata,
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `problems_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Enhanced PDF Export
  const exportToPDF = () => {[1]
    const doc = new jsPDF();
    
    // Add title and metadata
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Problems Export Report', 20, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 20, 40);
    
    doc.text(`Total Problems: ${filteredProblems.length}`, 20, 50);
    
    // Add filters info if any
    let filtersText = '';
    if (filters.difficulty.length > 0) filtersText += `Difficulty: ${filters.difficulty.join(', ')} `;
    if (filters.topics.length > 0) filtersText += `Topics: ${filters.topics.join(', ')} `;
    if (filters.searchTerm) filtersText += `Search: "${filters.searchTerm}"`;
    
    if (filtersText) {
      doc.text(`Filters: ${filtersText}`, 20, 60);
    }

    // Prepare table data
    const tableData = filteredProblems.map((problem, index) => [
      index + 1,
      problem.title || 'N/A',
      problem.difficulty ? problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1) : 'N/A',
      problem.tags && problem.tags.length > 0 ? problem.tags.slice(0, 3).join(', ') + (problem.tags.length > 3 ? '...' : '') : 'No tags',
      problem.createdAt ? new Date(problem.createdAt).toLocaleDateString() : 'N/A',
      problem.samples ? problem.samples.length : 0,
      problem.hiddenTests ? problem.hiddenTests.length : 0
    ]);

    // Add table
    doc.autoTable({
      head: [['#', 'Title', 'Difficulty', 'Tags', 'Created', 'Samples', 'Hidden']],
      body: tableData,
      startY: filtersText ? 70 : 60,
      theme: 'striped',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: 50
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 50 },
        2: { cellWidth: 25 },
        3: { cellWidth: 40 },
        4: { cellWidth: 25 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 }
      },
      margin: { top: 70 },
      didDrawPage: function (data) {
        // Add page numbers
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Page ${data.pageNumber}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    // Save the PDF
    doc.save(`problems_export_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExport = () => {
    if (exportFormat === 'csv') {
      exportToCSV();
    } else if (exportFormat === 'pdf') {
      exportToPDF();
    }
    setShowExportMenu(false);
  };

  // Custom tooltip for pie charts with glassmorphism
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-md bg-white/20 border border-white/30 rounded-lg shadow-lg p-3"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
        >
          <p className="font-semibold text-white">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="text-sm text-gray-200">{`${payload[0].payload.percentage || ((payload[0].value / stats.totalProblems) * 100).toFixed(1)}%`}</p>
        </motion.div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#07034d] to-[#1e0750] flex items-center justify-center">
        <div className="text-center">
          {/* Golden Spinning Circle */}
          <div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
          
          {/* Loading Text */}
          <h2 className="text-xl font-semibold text-amber-400 mb-2">Loading Content</h2>
          <p className="text-indigo-200 text-sm">Please wait while we fetch the content</p>
          
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
    <div className="min-h-screen bg-gradient-to-br from-[#07034d] to-[#1e0750] py-25 px-4 sm:py-25 sm:px-6 lg:py-25 lg:px-20">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-400 mb-2">Admin Statistics Dashboard</h1>
            <p className="text-white text-sm sm:text-base">Comprehensive analytics and problem management</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            {/* Enhanced Refresh Button with Light Background */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchStatistics}
              className="flex items-center justify-center px-4 py-2 backdrop-blur-md bg-white/20 border border-white/40 text-white rounded-lg shadow-lg hover:bg-white/30 transition-all text-sm sm:text-base"
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)'
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </motion.button>
            
            {/* Enhanced Export Button with Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={!filteredProblems || filteredProblems.length === 0}
                className="flex items-center justify-center px-4 py-2 backdrop-blur-md bg-white/20 border border-white/40 text-white rounded-lg shadow-lg hover:bg-white/30 transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)'
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
                <ChevronDown className="w-4 h-4 ml-1" />
              </motion.button>

              {/* Export Format Dropdown */}
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 backdrop-blur-md bg-white/20 border border-white/30 rounded-lg shadow-lg z-50"
                  style={{
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)'
                  }}
                >
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setExportFormat('csv');
                        exportToCSV();
                        setShowExportMenu(false);
                      }}
                      className="w-full flex items-center px-3 py-2 text-sm text-white hover:bg-white/20 rounded-lg transition-all"
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-2 text-green-400" />
                      Export as CSV
                    </button>
                    <button
                      onClick={() => {
                        setExportFormat('pdf');
                        exportToPDF();
                        setShowExportMenu(false);
                      }}
                      className="w-full flex items-center px-3 py-2 text-sm text-white hover:bg-white/20 rounded-lg transition-all"
                    >
                      <File className="w-4 h-4 mr-2 text-red-400" />
                      Export as PDF
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards with Real Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[
          {
            title: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            color: "blue",
            trend: adminData?.userGrowth ? `+${adminData.userGrowth}% from last month` : "Data loading..."
          },
          {
            title: "Active Users",
            value: stats.activeUsers,
            icon: UserCheck,
            color: "green",
            trend: adminData?.activeUserGrowth ? `+${adminData.activeUserGrowth}% from last month` : "Data loading..."
          },
          {
            title: "Total Problems",
            value: stats.totalProblems,
            icon: FileText,
            color: "purple",
            trend: `${stats.problems?.filter(p => {
              const createdDate = new Date(p.createdAt);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return createdDate > weekAgo;
            }).length || 0} new this week`
          },
          {
            title: "Filtered Results",
            value: filteredProblems?.length || 0,
            icon: Filter,
            color: "orange",
            trend: `${stats.totalProblems > 0 ? ((filteredProblems?.length || 0) / stats.totalProblems * 100).toFixed(1) : 0}% of total`
          }
        ].map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-4 sm:p-6 hover:bg-white/15 transition-all"
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-200 truncate">{card.title}</p>
                <p className="text-xl sm:text-3xl font-bold text-white mt-1">{card.value.toLocaleString()}</p>
                <p className={`text-xs sm:text-sm ${index === 3 ? 'text-gray-300' : 'text-green-400'} flex items-center mt-2`}>
                  {index !== 3 && <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />}
                  <span className="truncate">{card.trend}</span>
                </p>
              </div>
              <div className={`p-2 sm:p-3 backdrop-blur-sm bg-${card.color}-500/20 border border-${card.color}-400/30 rounded-full flex-shrink-0 ml-2`}>
                <card.icon className={`w-4 h-4 sm:w-6 sm:h-6 text-${card.color}-300`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section - Real Data */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        {/* Difficulty Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-4 sm:p-5 hover:bg-white/15 transition-all"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-0">Problems by Difficulty</h3>
            <div className="flex items-center text-xs sm:text-sm text-gray-300">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
          <div className="h-48 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.difficultyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={window.innerWidth < 640 ? 60 : 80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => window.innerWidth >= 640 ? `${name}: ${(percent * 100).toFixed(0)}%` : `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {stats.difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  formatter={(value) => <span className="text-xs sm:text-sm text-gray-200">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Topic Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-4 sm:p-5 hover:bg-white/15 transition-all"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-0">Top Topics</h3>
            <div className="flex items-center text-xs sm:text-sm text-gray-300">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
          <div className="h-48 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.topicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={window.innerWidth < 640 ? 60 : 80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => window.innerWidth >= 640 ? `${(percent * 100).toFixed(0)}%` : `${(percent * 100).toFixed(0)}%`}
                >
                  {stats.topicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  formatter={(value) => <span className="text-xs sm:text-sm text-gray-200">{window.innerWidth >= 640 ? value : value.length > 8 ? value.substring(0, 8) + '...' : value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Filters and Problem List with Real Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg overflow-hidden"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
      >
        <div 
          className="p-4 sm:p-6 border-b border-white/20 cursor-pointer flex justify-between items-center hover:bg-white/5 transition-all"
          onClick={() => setShowFilters(!showFilters)}
        >
          <h3 className="text-lg sm:text-xl font-semibold text-white">Problem Management</h3>
          <button className="text-gray-300 hover:text-white">
            {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Filter Controls - Animated */}
        <motion.div
          initial={false}
          animate={{ 
            height: showFilters ? 'auto' : 0,
            opacity: showFilters ? 1 : 0,
            padding: showFilters ? '1rem' : '0 1rem'
          }}
          className="overflow-hidden sm:p-6"
        >
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search problems by title..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full pl-8 sm:pl-10 pr-4 py-2 backdrop-blur-sm bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm sm:text-base text-white placeholder-gray-300"
                style={{
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)'
                }}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-col gap-4">
              {/* Difficulty Filters */}
              <div>
                <span className="text-xs sm:text-sm font-medium text-gray-200 mb-2 block">Filter by Difficulty:</span>
                <div className="flex flex-wrap gap-2">
                  {['easy', 'medium', 'hard'].map(difficulty => (
                    <motion.button
                      key={difficulty}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleFilterChange('difficulty', difficulty)}
                      className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center backdrop-blur-sm border ${
                        filters.difficulty.includes(difficulty)
                          ? difficulty === 'easy' ? 'bg-green-500/30 text-green-200 border-green-400/50'
                            : difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-200 border-yellow-400/50'
                            : 'bg-red-500/30 text-red-200 border-red-400/50'
                          : 'bg-white/10 text-gray-300 border-white/30 hover:bg-white/20'
                      }`}
                      style={{
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)'
                      }}
                    >
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      {filters.difficulty.includes(difficulty) && (
                        <span className="ml-1 text-xs">✓</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Topic Filters - Dynamic from real data */}
              <div>
                <span className="text-xs sm:text-sm font-medium text-gray-200 mb-2 block">Filter by Topic:</span>
                <div className="flex flex-wrap gap-2">
                  {getUniqueTopics().map(topic => (
                    <motion.button
                      key={topic}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleFilterChange('topics', topic)}
                      className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center backdrop-blur-sm border ${
                        filters.topics.includes(topic)
                          ? 'bg-blue-500/30 text-blue-200 border-blue-400/50'
                          : 'bg-white/10 text-gray-300 border-white/30 hover:bg-white/20'
                      }`}
                      style={{
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)'
                      }}
                    >
                      <span className="truncate max-w-24 sm:max-w-none">{topic}</span>
                      {filters.topics.includes(topic) && (
                        <span className="ml-1 text-xs flex-shrink-0">✓</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(filters.difficulty.length > 0 || filters.topics.length > 0 || filters.searchTerm) && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearFilters}
                  className="px-4 py-2 backdrop-blur-sm bg-white/10 border border-white/30 text-gray-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-white/20 transition-all flex items-center justify-center mt-2"
                  style={{
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)'
                  }}
                >
                  Clear All Filters
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Problem List - Real Data */}
        <div className="p-4 sm:p-6">
          <div className="space-y-2">
            {filteredProblems && filteredProblems.length > 0 ? (
              filteredProblems.map((problem, index) => (
                <motion.div
                  key={problem._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-lg p-3 hover:bg-white/10 transition-all"
                  style={{
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          problem.difficulty === 'easy' ? 'bg-green-500/30 text-green-200 border border-green-400/50'
                          : problem.difficulty === 'medium' ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/50'
                          : 'bg-red-500/30 text-red-200 border border-red-400/50'
                        }`}>
                          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                        </span>
                        <h4 className="text-sm font-medium text-white truncate">{problem.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-300 flex-wrap">
                        {problem.tags && problem.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-500/20 text-blue-200 rounded-full border border-blue-400/30">
                            {tag}
                          </span>
                        ))}
                        {problem.tags && problem.tags.length > 3 && (
                          <span className="text-gray-400">+{problem.tags.length - 3} more</span>
                        )}
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{new Date(problem.createdAt).toLocaleDateString()}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{problem.samples?.length || 0} samples</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 backdrop-blur-sm bg-white/5 rounded-lg border border-white/20">
                <p className="text-sm text-gray-300">
                  {problems && problems.length === 0 
                    ? "No problems available. Add some problems to get started."
                    : "No problems found matching the current filters."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Click outside to close export menu */}
      {showExportMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </div>
  );
};

export default AdminStatistics;
