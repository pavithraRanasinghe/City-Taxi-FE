import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { getUser } from "../common/PersistanceManager";

const RequireAuth = () => {
  const user = getUser();
  console.log("USER AUTH : ", user);
  if (!user || user.userId === 0) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default RequireAuth;
