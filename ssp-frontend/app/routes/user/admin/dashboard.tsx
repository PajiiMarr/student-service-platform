import type { Route } from "./+types/dashboard";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard - Admin" }, { name: "dashboard" }];
}

export async function loader({ request, context }: Route.LoaderArgs) {}

export async function action({ request, context }: Route.ActionArgs) {}

export default function AdminDashboard() {
  return <></>;
}
