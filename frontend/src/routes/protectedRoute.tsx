import { useNavigate } from "react-router-dom";
import { useAdmin } from "../contexts/AdminContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  console.log(user);

  if (!isAuthenticated) {
    navigate(
      {
        pathname: "/login",
      },
      { replace: true }
    );
    return;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
