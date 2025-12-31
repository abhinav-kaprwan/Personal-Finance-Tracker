import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">
        Personal Finance Tracker
      </h1>

      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-blue-600">
          Dashboard
        </Link>
        <Link to="/transactions" className="hover:text-blue-600">
          Transactions
        </Link>
        <Link to="/analytics" className="hover:text-blue-600">
          Analytics
        </Link>

        <span className="text-sm text-gray-600">
          Role: <b>{user?.role}</b>
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
