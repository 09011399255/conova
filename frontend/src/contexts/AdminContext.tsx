import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect } from "react";
import { getUserProfile, UserProfileResponse } from "../api";
import { toast } from "react-toastify";
import { ClientError } from "../api/apiFetchWrapper";
import { useNavigate } from "react-router-dom";

interface AdminContextType {
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  user: UserProfileResponse | null;
  hasRole: (requiredRole: string) => boolean;
  userRole: string | undefined;
}

//Create context with default values, using | null cos of on mount
const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<UserProfileResponse, ClientError>({
    queryKey: ["userProfile"],
    queryFn: () => {
      console.log("Fetching user profile, omo");
      return getUserProfile();
    },

    staleTime: 0,

    gcTime: 0,
    retry: 1,
    retryOnMount: true,
    refetchOnWindowFocus: false,
  });

  //Atimes I wished tis thing has the onError that useMutation has

  const navigate = useNavigate();


  useEffect(() => {
    if (!error) return;

    console.error("Error fetching user profile:", error);
    console.error(error?.data);

    //EIther the 401 or the 403 would tell us
    switch (error.status) {
      case 401:
        toast.error("Authentication failed. Please log in again.");
        navigate("/login");
        break;
      case 403:
        toast.error("You don't have permission to access this resource.");
        navigate("/login");
        break;
      case 0:
        toast.error("Network error. Please check your connection.");
        break;
      default:
        toast.error(
          `Error: ${error?.message || "An unexpected error occurred."}`
        );
        break;
    }
  }, [error]);
  const isAdmin = false;
  const isAuthenticated = !!user;

  // Check if user has a specific role, I don't know but I feel I might use later
  const hasRole = (requiredRole: string): boolean => {
    if (!user) return false;

    // Check for a single role
    return user.role === requiredRole;
  };


  const contextValue: AdminContextType = {
    isAdmin: isAdmin || false,
    isAuthenticated,
    isLoading,
    error,
    user: user || null,
    hasRole,
    userRole: user?.role,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
