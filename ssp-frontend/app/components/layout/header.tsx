import { Link } from "react-router";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Your App
          </Link>
          
          <div className="space-x-4">
            <Link to="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            <Link to="/profile" className="hover:text-blue-600">
              Profile
            </Link>
            <button className="text-red-600 hover:text-red-800">
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}