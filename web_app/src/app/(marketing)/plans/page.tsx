import { redirect } from "next/navigation";

// Plans page is temporarily hidden — redirects to home
export default function PlansPage() {
  redirect("/");
}
