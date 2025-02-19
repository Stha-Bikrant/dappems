"use client";
import React from "react";
import { EMSProvider } from "@/app/context/EMSContext";
import AdminDashboard from "@/app/components/Admin/admin";
import AuditorDashboard from "@/app/components/Auditor/auditor";
import WhitelistUserDashboard from "@/app/components/WhiteListUsers/whitelist";
import { useEMSContext } from "@/app/context/EMSContext";

const MainPage: React.FC = () => {
  const { userRole, connectWallet, account } = useEMSContext();

  return (
    <div>
      <h1 className="text-2xl font-bold">Evidence Management System</h1>
      {!account ? (
        <button onClick={connectWallet} className="p-2 bg-blue-500 text-white rounded">
          Connect Wallet
        </button>
      ) : (
        <>
          {userRole === "admin" && <AdminDashboard />}
          {userRole === "auditor" && <AuditorDashboard />}
          {userRole === "whitelistUser" && <WhitelistUserDashboard />}
          {userRole === "unknown" && <p>Unauthorized Access</p>}
        </>
      )}
    </div>
  );
};

// Wrap the entire app with EMSProvider
export default function App() {
  return (
    <EMSProvider>
      <MainPage />
    </EMSProvider>
  );
}
