"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-brand-mist/50">
      {/* Dark Evergreen Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-8 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

