import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { getUser } from "../common/PersistanceManager";
import { ADMIN } from "../common/Constants";

const AdminRequireAuth = () => {
  const user = getUser();
  if (!user || user.userId === 0 || user.userType !== ADMIN) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default AdminRequireAuth;
