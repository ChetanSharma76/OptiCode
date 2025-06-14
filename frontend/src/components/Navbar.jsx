import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.jpg";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { token, userData, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  // Only add Admin nav item if user is admin (lowercase)
  const isAdmin = userData?.role === "admin";

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Problems", path: "/problems" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
    // Admin link will be conditionally rendered below
  ];

  const onSubmitHandler = () => {
    setToken(false);
    localStorage.removeItem("token");
    toast.success("Logout successfully");
    navigate("/");
  };

  const NavItem = ({ name, path }) => (
    <li>
      <NavLink
        to={path}
        className={({ isActive }) =>
          `relative group text-lg font-medium transition-colors duration-300 ${
            isActive ? "text-violet-500" : "text-violet-400"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {name}
            <span
              className={`absolute left-0 -bottom-1 h-[2px] bg-violet-500 transition-all duration-300 ${
                isActive ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </>
        )}
      </NavLink>
    </li>
  );

  return (
    <>
      <nav className="w-full h-16 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/10 dark:bg-gray-900/30 border-b border-white/20 dark:border-gray-700 shadow-md fixed z-40 transition-all duration-300">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            onClick={() => navigate("/")}
            alt="Logo"
            className="h-10 w-10 rounded-full cursor-pointer hover:scale-105 transition duration-300"
          />
          <span className="text-2xl font-bold text-gray-300 dark:text-white">
            THE <span className="text-violet-400">OJ</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex lg:ml-80 space-x-5 text-md font-medium">
          {navItems.map(({ name, path }) => (
            <NavItem key={name} name={name} path={path} />
          ))}
          {isAdmin && (
            <NavItem name="Admin" path={`${import.meta.env.VITE_ADMIN_URL}`} />
          )}
        </ul>

        {/* Right Side (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {!token && !userData ? (
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 font-semibold rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-105 transition-all duration-300 shadow-md"
            >
              Login
            </button>
          ) : (
            <>
              <span onClick={() => navigate("/my-profile")} className="cursor-pointer">
                <img
                  src={userData?.profileImage}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md hover:ring-2 hover:ring-violet-400 transition duration-300"
                />
              </span>
              <LogoutButton onLogout={onSubmitHandler} />
            </>
          )}
        </div>

        {/* Hamburger Icon (Mobile) */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-violet-300 dark:text-white hover:text-violet-400 transition"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 backdrop-blur-md bg-white/10 dark:bg-gray-900/30 border-l border-white/20 dark:border-gray-700 shadow-md z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
          <span className="text-xl font-bold text-white">Menu</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-white hover:text-red-400 transition"
          >
            <X size={24} />
          </button>
        </div>

        <ul className="flex flex-col space-y-4 px-6 py-4">
          {navItems.map(({ name, path }) => (
            <li key={name}>
              <NavLink
                to={path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `relative group text-lg font-medium transition-all text-white ${
                    isActive ? "text-violet-300" : "hover:text-violet-200"
                  }`
                }
              >
                {name}
              </NavLink>
            </li>
          ))}
          {isAdmin && (
            <li>
              <NavLink
                to={`${import.meta.env.VITE_ADMIN_URL}`}
                onClick={() => setIsSidebarOpen(false)}
                className="text-violet-400 text-lg font-medium hover:text-violet-200 transition-all"
              >
                Admin
              </NavLink>
            </li>
          )}
        </ul>

        <div className="px-6 pt-2 space-y-4">
          {!token && !userData ? (
            <button
              onClick={() => {
                setIsSidebarOpen(false);
                navigate("/login");
              }}
              className="w-full py-2 font-semibold rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-105 transition-all duration-300 shadow-md"
            >
              Login
            </button>
          ) : (
            <>
              <div
                onClick={() => {
                  setIsSidebarOpen(false);
                  navigate("/my-profile");
                }}
                className="flex items-center gap-3 cursor-pointer"
              >
                <img
                  src={userData?.profileImage}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                />
                <span className="text-white">{userData?.username}</span>
              </div>
              <LogoutButton onLogout={onSubmitHandler} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
