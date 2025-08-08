import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navigation from "@/components/navigation/Navigation";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <ProtectedRoute>
      <div className="flex main-container">
        <div className="w-[25%] px-2">
          <div className="mt-5">
            <div className="py-4">
              <h3 className="font-semibold text-black text-md mb-6">Main</h3>
              <Navigation />
            </div>
          </div>
        </div>
        {children}
      </div>
    </ProtectedRoute>
  );
}
