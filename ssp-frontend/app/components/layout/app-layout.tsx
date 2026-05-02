import { useLocation } from "react-router";
import { Header } from "./header";
import { Footer } from "./footer";

const EXEMPTED_PATTERNS = [
  /^\/profiling\/?$/,  // Matches both /profiling and /profiling/
  /^\/signup\/?$/,  // Matches both /profiling and /profiling/
  /^\/student\/profiling\/?$/,  // Matches both /student/profiling and /student/profiling/
  /^\/auth\//,
  /^\/api\//,
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  const isExempted = EXEMPTED_PATTERNS.some(pattern => 
    pattern.test(location.pathname)
  );
  
  if (isExempted) {
    return <>{children}</>;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}