import { ArrowLeft } from "lucide-react";

import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="max-940:px-[15px] px-[50px] max-860:px-[10px] font-manrope flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="font-[700] text-[80px] text-[#134562] mb-2">404</h1>
        <h2 className="font-[700] text-[28px] text-black mb-4">
          Page Not Found
        </h2>
        <p className="text-[#A5A8B5] text-[16px] font-[400] mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 bg-[#134562] text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors duration-200 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-[600] text-[14px]">Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
