// components/AuthLayout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-[100vh] font-manrope">
            <div className="hidden h-[100vh] lg:flex w-1/2 items-center justify-center">
                <img src="/images/conovabg.png" alt="Login illustration" className="w-[100%]  " />
            </div>

            <div className="flex w-full lg:w-1/2 h-[100vh]  items-center justify-center px-4 md:px-16">
                {children}

            </div>
        </div>
    );
}
