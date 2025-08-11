import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
