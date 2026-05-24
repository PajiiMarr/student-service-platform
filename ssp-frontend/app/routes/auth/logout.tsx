// app/routes/auth/logout.tsx
import { redirect } from "react-router";
import type { Route } from "./+types/logout";
import { serverAxios } from "~/utils/handler/server-axios";

export async function action({ request }: Route.ActionArgs) {
  try {
    const api = serverAxios(request);
    await api.post("/api/logout");
  } catch (error) {
    console.error("Logout API call failed:", error);
  }

  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax; Max-Age=0"
  );

  return redirect("/signin", { headers });
}

export default function Logout() {
  return null;
}