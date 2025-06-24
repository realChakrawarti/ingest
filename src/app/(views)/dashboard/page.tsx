"use client";

import withAuth from "~/features/auth/with-auth-hoc";

import Dashboard from "~/views/dashboard";

function DashboardPage() {
  return <Dashboard />;
}

export default withAuth(DashboardPage);
