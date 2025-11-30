import { Navigate } from "react-router";
import { JSX } from "react";
import { getCookie } from "../Utils/cookies";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
 const token = getCookie("token");

  // لو مفيش token → رجع المستخدم على صفحة اللوجن
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PublicRoute;