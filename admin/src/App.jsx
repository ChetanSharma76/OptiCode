import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Login from './pages/Login.jsx';
import CreateProblem from './pages/CreateProblem.jsx';
import UpdateProblem from './pages/UpdateProblem.jsx';
import ViewProblem from './pages/ViewProblem.jsx';
import Myprofile from './pages/Myprofile.jsx';
import AdminStatistics from './pages/AdminStatistics.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navbar with proper z-index */}
      <div className="relative z-30">
        <Navbar />
      </div>

      {/* Main content area with proper stacking context */}
      <main className="flex-grow relative z-10">
        <Routes>
          <Route path='/problems' element={<AdminDashboard />} />
          <Route path='/' element={<Login />} />
          <Route path='/create-problem' element={<CreateProblem />} />
          <Route path='/update-problem/:id' element={<UpdateProblem />} />
          <Route path='/view-problem/:id' element={<ViewProblem />} />
          <Route path='/my-profile' element={<Myprofile />} />
          <Route path='/admin-stats' element={<AdminStatistics />} />
        </Routes>
      </main>

      {/* Footer with proper z-index */}
      <div className="relative z-20">
        <Footer />
      </div>

      {/* Toast Container - high z-index but below modals */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="!w-auto !max-w-[280px]"
        toastClassName="!min-w-0 !w-full !p-3 !rounded-lg"
        bodyClassName="!p-0 !m-0 !text-sm"
        style={{
          zIndex: 50000,
        }}
        progressStyle={{
          background: 'rgba(255,255,255,0.3)'
        }}
      />
    </div>
  )
}

export default App;
