// app/routes/logout.tsx
import { redirect } from "react-router";
import type { Route } from "./+types/logout";

export async function action({ request }: Route.ActionArgs) {
  // Create headers that will clear the auth_token cookie
  const headers = new Headers();

  // Clear the cookie by setting it to an empty value with an immediate expiry
  headers.append(
    "Set-Cookie",
    "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax"
  );

  // If you have other cookies (e.g., refresh_token), clear them too
  // headers.append("Set-Cookie", "refresh_token=; ...");

  // Redirect to signin after clearing the cookie
  return redirect("/signin", { headers });
}