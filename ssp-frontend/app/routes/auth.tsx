// app/routes/auth.tsx (layout for public auth pages)
import { Outlet } from "react-router";
import { requireUnauthenticated } from "~/utils/auth-guard.server";

export async function loader({ request }: { request: Request }) {
  await requireUnauthenticated(request);
  return null;
}

export default function AuthLayout() {
  return <Outlet />;
}