// components/AuthLayout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex font-manrope relative min-h-screen">
      <div className="hidden h-[100vh] fixed  lg:flex w-1/2 items-center justify-center">
        <img
          src="/images/conovabg.png"
          alt="Login illustration"
          className="w-[100%]  "
        />
      </div>

      <div className="flex w-full lg:ml-[50%] lg:w-1/2  items-center justify-center px-4 md:px-16 py-12">
        {children}
      </div>
    </div>
  );
}
