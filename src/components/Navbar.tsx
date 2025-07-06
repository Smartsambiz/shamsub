import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFrontendAuth } from '../contexts/AuthContext';
import { Menu, X, Wallet, User, LogOut, Smartphone } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useFrontendAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-blue-700 font-bold text-xl">
              <Smartphone className="h-8 w-8" />
              <span>Shamsub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/services/data" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
              Data Plans
            </Link>
            <Link to="/services/airtime" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
              Airtime
            </Link>
            <Link to="/services/utilities" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
              Utilities
            </Link>
            <Link to="/services/tv" className="text-gray-700 hover:text-blue-700 font-medium transition-colors">
              TV Subscription
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-700 font-medium transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>{user.email}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-700 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/services/data"
              className="block px-3 py-2 text-gray-700 hover:text-blue-700 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Data Plans
            </Link>
            <Link
              to="/services/airtime"
              className="block px-3 py-2 text-gray-700 hover:text-blue-700 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Airtime
            </Link>
            <Link
              to="/services/utilities"
              className="block px-3 py-2 text-gray-700 hover:text-blue-700 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Utilities
            </Link>
            <Link
              to="/services/tv"
              className="block px-3 py-2 text-gray-700 hover:text-blue-700 font-medium"
              onClick={() => setIsOpen(false)}
            >
              TV Subscription
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-700 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;