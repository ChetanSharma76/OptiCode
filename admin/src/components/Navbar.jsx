import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.jpg";
import { AdminContext } from "../context/AdminContext";
import LogoutButton from "./LogoutButton";
import { toast } from "react-toastify";

const Navbar = () => {
  const { token, setToken, adminData } = useContext(AdminContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(false);
    toast.success("Logout successfully");
    window.location.href = import.meta.env.VITE_FRONTEND_URL;
  };

  // Basic nav items
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Problems", path: "/problems" },
    { label: "Create Problem", path: "/create-problem" },
  ];

  // Check if user is admin
  const isAdmin = adminData?.role === "admin";

  // If admin, add Admin Panel link
  const navItemsWithAdmin = isAdmin
    ? [...navItems, { label: "Admin Panel", path: "/admin" }]
    : navItems;

  return (
    <nav className="w-full fixed h-16 z-50 top-0 left-0 bg-white/10 dark:bg-black/20 backdrop-blur-md border-b border-white/20 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3  flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="Logo"
            onClick={() => navigate("/")}
            className="h-10 w-10 rounded-full cursor-pointer border border-white/30"
          />
          <span className="text-2xl font-bold text-white">
            THE <span className="text-violet-400">OJ</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {!token ? (
            <button
              onClick={() => navigate("/login")}
              className="ml-4 px-5 py-2 font-semibold rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-105 transition-all duration-300 shadow-md"
            >
              Login
            </button>
          ) : (
            <>
              {navItemsWithAdmin.map(({ label, path }) => (
                <NavLink
                  key={label}
                  to={path}
                  className={({ isActive }) =>
                    `text-lg font-medium text-violet-400 relative transition-all duration-300
                     ${isActive ? "after:w-full text-violet-500" : "after:w-0"}
                     after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-violet-500 after:transition-all after:duration-300 hover:after:w-full`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <img
                src={adminData?.profileImage}
                alt="profile"
                className="w-9 h-9 rounded-full border-2 border-white/50 object-cover cursor-pointer"
                onClick={() => navigate("/my-profile")}
              />
              <LogoutButton
                onLogout={handleLogout}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
              />
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(true)} className="text-white">
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] z-[9999] bg-white transform transition-transform duration-300 ease-in-out shadow-2xl ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 bg-white border-b border-violet-200">
            <span className="text-2xl font-bold text-violet-900">
              THE <span className="text-violet-600">OJ</span>
            </span>
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="p-2 rounded-full hover:bg-violet-100 transition-colors"
            >
              <X size={24} className="text-violet-600 hover:text-violet-800" />
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col space-y-6 p-6 bg-white">
            {!token ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/login");
                }}
                className="w-full py-2 font-semibold rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-105 transition-all duration-300 shadow-md"
              >
                Login
              </button>
            ) : (
              <>
                {navItemsWithAdmin.map(({ label, path }) => (
                  <NavLink
                    key={label}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-xl font-semibold text-violet-600 relative transition-all duration-300 hover:text-violet-800
                       ${isActive ? "after:w-full text-violet-800" : "after:w-0"}
                       after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-violet-600 after:transition-all after:duration-300 hover:after:w-full`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
                <div
                  className="flex items-center space-x-3 mt-6 cursor-pointer p-3 rounded-lg hover:bg-violet-50 transition-colors border border-violet-200"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/my-profile");
                  }}
                >
                  <img
                    src={adminData?.profileImage}
                    alt="profile"
                    className="w-10 h-10 rounded-full border-2 border-violet-300 object-cover"
                  />
                  <span className="text-violet-700 font-medium">My Profile</span>
                </div>
                <LogoutButton
                  onLogout={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="mt-4 px-5 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
