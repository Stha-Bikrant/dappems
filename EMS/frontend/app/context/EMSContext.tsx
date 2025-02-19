"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ethers } from "ethers";
import ContractAddress from "@/contracts/contract-address.json";
import abi from "@/contracts/EMS.json";

// Define the context type
interface EMSContextType {
  account: string | null;
  userRole: string;
  contract: any;
  connectWallet: () => Promise<void>;
  auditorAddress: string;
  setAuditorAddress: (address: string) => void;
  whitelistAddress: string;
  setWhitelistAddress: (address: string) => void;
  courtId: string;
  setCourtId: (id: string) => void;
  caseDescription: string;
  setCaseDescription: (desc: string) => void;
  startDateTime: string;
  setStartDateTime: (date: string) => void;
  caseId: number | "";
  setCaseId: (id: number | "") => void;
  evidenceId: number | "";
  setEvidenceId: (id: number | "") => void;
  evidenceDescription: string;
  setEvidenceDescription: (desc: string) => void;
  createdDateTime: string;
  setCreatedDateTime: (date: string) => void;

  evidenceDetails: {
    description: string;
    owner: string;
    timestamp: number;
    createdDateTime: string;
  } | null;
  setEvidenceDetails: (details: {
    description: string;
    owner: string;
    timestamp: number;
    createdDateTime: string;
  } | null) => void;
  
}

// Create context with default values
const EMSContext = createContext<EMSContextType | null>(null);

// Define the provider props type
interface EMSProviderProps {
  children: ReactNode;
}

export const EMSProvider: React.FC<EMSProviderProps> = ({ children }) => {
  // Wallet & Role Management
  const [account, setAccount] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("unknown");
  const [contract, setContract] = useState<any>(null);

  // Case & Evidence Management
  const [auditorAddress, setAuditorAddress] = useState("");
  const [whitelistAddress, setWhitelistAddress] = useState("");
  const [courtId, setCourtId] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [caseId, setCaseId] = useState<number | "">("");
  const [evidenceId, setEvidenceId] = useState<number | "">("");

  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [createdDateTime, setCreatedDateTime] = useState("");

  const [evidenceDetails, setEvidenceDetails] = useState<{
    description: string;
    owner: string;
    timestamp: number;
    createdDateTime: string;
  } | null>(null);


  const CONTRACT_ADDRESS = ContractAddress.EMS;
  const CONTRACT_ABI = abi.abi;

  // Connect Wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const address = await signer.getAddress();

      setAccount(address);
      setContract(contract);
      await checkUserRole(address, contract);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Check User Role
  const checkUserRole = async (address: string, contract: any) => {
    if (!contract) return;
    try {
      const isAdmin = await contract.owner();
      const isAuditor = await contract.isAuditor(address);
      const isWhitelistUser = await contract.isWhiteListedUsers(address);

      if (address.toLowerCase() === isAdmin.toLowerCase()) {
        setUserRole("admin");
      } else if (isAuditor) {
        setUserRole("auditor");
      } else if (isWhitelistUser) {
        setUserRole("whitelistUser");
      } else {
        setUserRole("unknown");
      }
    } catch (error) {
      console.error("Error checking role:", error);
    }
  };

  // Initialize Contract
  useEffect(() => {
    const initContract = async () => {
      if (!window.ethereum) return alert("Please install MetaMask!");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contract);
    };
    initContract();
  }, []);

  return (
    <EMSContext.Provider
      value={{
        account,
        userRole,
        contract,
        connectWallet,
        auditorAddress,
        setAuditorAddress,
        whitelistAddress,
        setWhitelistAddress,
        courtId,
        setCourtId,
        caseDescription,
        setCaseDescription,
        startDateTime,
        setStartDateTime,
        caseId,
        setCaseId,
        evidenceId, 
        setEvidenceId,
        evidenceDescription,
        setEvidenceDescription,
        createdDateTime,
        setCreatedDateTime,
        evidenceDetails,
        setEvidenceDetails

      }}
    >
      {children}
    </EMSContext.Provider>
  );
};

// Hook to use the context
export const useEMSContext = () => {
  const context = useContext(EMSContext);
  if (!context) {
    throw new Error("useEMSContext must be used within an EMSProvider");
  }
  return context;
};
