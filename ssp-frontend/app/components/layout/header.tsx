// app/components/header.tsx
import { Link, Form } from "react-router";   // <-- Note: Form is from react-router
import { House } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            <img src="jobili.svg" alt="" className="w-15 h-10" />
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
            {/* Replace the static button with a Form */}
            <Form method="post" action="/logout">
              <button type="submit" className="text-red-600 hover:text-red-800">
                Logout
              </button>
            </Form>
          </div>
        </div>
      </nav>
    </header>
  );
}