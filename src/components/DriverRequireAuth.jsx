import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { getUser } from "../common/PersistanceManager";
import { DRIVER } from "../common/Constants";

const DriverRequireAuth = () => {
  const user = getUser();
  console.log("USER AUTH : ", user);
  if (!user || user.userId === 0 || user.userType !== DRIVER) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default DriverRequireAuth;
