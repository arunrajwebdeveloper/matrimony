import AuthBanner from "@/components/auth/AuthBanner";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-dvh">
      <div className="h-dvh w-full relative flex">
        <AuthBanner />
      </div>
      <div className="h-dvh w-[420px] flex-none overflow-y-auto py-10 px-12">
        {children}
      </div>
    </div>
  );
}
