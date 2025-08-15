import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
// Navigation Bar structure
  return (
    <nav className="bg-gray-600 text-white py-3 px-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold">IT Asset Management</Link>
      <div>
        {user ? (
          <>
            <Link to="/assets" className="text-sm px-4 py-2 leading-none rounded-full hover:bg-gray-700">Manage Assets</Link>
            <Link to="/profile" className="text-sm px-4 py-2 leading-none rounded-full hover:bg-gray-700">Manage Profile</Link>
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-2 leading-none rounded-full hover:bg-gray-700 text-white bg-red-500"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" 
            className="bg-gray-600 px-4 py-2 rounded-full hover:bg-gray-700 ">Login</Link>
            <Link
              to="/register"
              className="bg-green-700 px-4 py-2 rounded-full hover:bg-gray-700 text-white"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
