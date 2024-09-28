import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { getUser } from "../common/PersistanceManager";
import { PASSENGER } from "../common/Constants";

const PassengerRequireAuth = () => {
  const user = getUser();
  console.log("USER AUTH : ", user);
  if (!user || user.userId === 0 || user.userType !== PASSENGER) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PassengerRequireAuth;
