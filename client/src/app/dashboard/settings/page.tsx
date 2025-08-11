import { ROUTES } from "@/utils/constants";
import { redirect } from "next/navigation";

export default function SettingsPage() {
  redirect(ROUTES.SETTINGS.DEFAULT);
}
