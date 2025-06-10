import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home.jsx';
import Problems from './pages/Problems.jsx';
import Login from './pages/Login.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Myprofile from './pages/Myprofile.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LeaderBoard from './pages/LeaderBoard.jsx';
import ProblemPage from './pages/ProblemPage.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="relative z-30">
        <Navbar />
      </div>

      {/* Main content area - this will expand to fill available space */}
      <main className="flex-1 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/problems/:id" element={<ProblemPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-profile" element={<Myprofile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </main>

      {/* Footer - will always be at the bottom */}
      <div className="">
        <Footer />
      </div>
      

      {/* Toast Container */}
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
  );
}

export default App;
