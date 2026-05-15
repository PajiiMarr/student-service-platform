import { Link } from "react-router";
import { House } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Logo Placeholder
          </Link>

          <div>
            <Link to="/student">
              <House />
            </Link>
          </div>

          <div className="space-x-4">
            <Link to="/about" className="hover:text-blue-600">
              About
            </Link>
            <Link to="/profile" className="hover:text-blue-600">
              Profile
            </Link>
            <Link to="/signin" className="hover:text-blue-600">
              Sign In
            </Link>
            <button className="text-red-600 hover:text-red-800">Logout</button>
          </div>
        </div>
      </nav>
    </header>
  );
}
