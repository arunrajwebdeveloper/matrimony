import AuthBanner from "@/components/auth/AuthBanner";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh">
      <div className="h-dvh w-full relative flex items-center justify-center">
        <AuthBanner />
      </div>
      <div className="h-dvh w-[450px] flex-none overflow-y-auto py-10 px-16">
        {children}
      </div>
    </div>
  );
}
