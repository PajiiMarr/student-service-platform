// app/components/header.tsx
import { Link, Form } from "react-router";
import {
  House,
  Briefcase,
  UserCircle,
  LogOut,
  PlusCircle,
  Info,
  LogIn,
} from "lucide-react";

export function Header({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <header className="bg-white shadow-sm border-b border-red-100">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo (persisted) */}
        <Link to="/" className="flex-shrink-0">
          <img src="jobili.svg" alt="Jobili" className="w-15 h-10" />
        </Link>
    
        <Link
          to="/student"
          className="text-gray-600 hover:text-red-700 transition-colors"
          aria-label="Home"
        >
          <House size={20} />
        </Link>

        {/* Home icon (persisted) */}
        <div className="flex items-center gap-5">
          <Link
            to="/student/jobs"
            className="text-gray-600 hover:text-red-700 transition-colors flex items-center gap-1"
            aria-label="Browse Jobs"
          >
            <Briefcase size={20} />
          </Link>

          {isLoggedIn && (
            <Link
              to="/student/jobs/new"
              className="text-gray-600 hover:text-red-700 transition-colors flex items-center gap-1"
              aria-label="Post a Job"
            >
              <PlusCircle size={20} />
            </Link>
          )}

          <Link
            to="/profile"
            className="text-gray-600 hover:text-red-700 transition-colors flex items-center gap-1"
            aria-label="Profile"
          >
            <UserCircle size={20} />
          </Link>

          {isLoggedIn ? (
            <Form method="post" action="/logout">
              <button
                type="submit"
                className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1"
                aria-label="Logout"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </Form>
          ) : (
            <Link
              to="/signin"
              className="text-gray-600 hover:text-red-700 transition-colors flex items-center gap-1"
              aria-label="Sign In"
            >
              <LogIn size={20} />
              <span className="hidden sm:inline text-sm">signin</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
