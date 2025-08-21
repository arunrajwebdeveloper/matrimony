import { ROUTES } from "@/utils/constants";
import { redirect } from "next/navigation";

export default function UsersPage() {
  redirect(ROUTES.PROFILE);
}
