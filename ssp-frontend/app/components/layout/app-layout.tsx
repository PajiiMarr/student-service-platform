import { useLocation } from "react-router";
import { Header } from "./header";
import { Footer } from "./footer";

export function AppLayout({ children, isLoggedIn = false }: { children: React.ReactNode; isLoggedIn?: boolean }) {
  const location = useLocation();
  const path = location.pathname;

  const isAdminOrStudent =
    path.startsWith("/admin") || path.startsWith("/student");

  if (isAdminOrStudent) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header isLoggedIn={isLoggedIn} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <a href="/">
            <img src="jobili.svg" alt="Jobili" className="w-15 h-10" />
          </a>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-gray-100 mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Jobili. All rights reserved.
        </div>
      </footer>
    </div>
  );
}