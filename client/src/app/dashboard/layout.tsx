import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ChatWindow from "@/components/chat/ChatWindow";
import Header from "@/components/Header";
import NextTopLoader from "nextjs-toploader";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <ProtectedRoute>
      <NextTopLoader
        color="white"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        zIndex={9999}
        template={`<div class="fixed top-0 left-0 h-[3px] w-full z-[9999] bg-gradient-to-r from-indigo-600 to-pink-500 animate-gradientMove" role="bar"></div>`}
      />
      <Header />
      <div className="mt-[70px] mb-10">{children}</div>

      {/* CHAT WINDOW */}
      <ChatWindow />
    </ProtectedRoute>
  );
}
