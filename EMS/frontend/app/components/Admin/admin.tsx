import { useEMSContext } from "../../context/EMSContext";
import {  useState } from "react";

export default function AdminPanel() {
  const { contract, auditorAddress, setAuditorAddress, whitelistAddress, setWhitelistAddress } = useEMSContext();
  const [isAuditor, setIsAuditor] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);



  // Set Auditor
  const handleSetAuditor = async () => {
    if (!contract) return alert("Please connect your wallet first!");
    try {
      const tx = await contract.setAuditor(auditorAddress, isAuditor);
      await tx.wait();
      alert("Auditor status updated successfully!");
    } catch (error) {
      console.error("Error setting auditor:", error);
    }
  };


  // Set Whitelisted User
  const handleSetWhitelistedUser = async () => {
    if (!contract) return alert("Please connect your wallet first!");
    try {
      const tx = await contract.setWhiteListedUsers(whitelistAddress, isWhitelisted);
      await tx.wait();
      alert("Whitelist status updated successfully!");
    } catch (error) {
      console.error("Error setting whitelist user:", error);
    }
  };


  return (
    <div className="p-4 font-sans">
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Set Auditor</h2>
        <input type="text" placeholder="Auditor Address" value={auditorAddress} onChange={(e) => setAuditorAddress(e.target.value)} className="block border p-2 w-full" />
        <select onChange={(e) => setIsAuditor(e.target.value === "true")} className="block border p-2 w-full mt-2">
          <option value="false">Remove</option>
          <option value="true">Assign</option>
        </select>
        <button onClick={handleSetAuditor} className="mt-2 p-2 bg-green-500 text-white rounded">Set Auditor</button>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Set Whitelist User</h2>
        <input type="text" placeholder="User Address" value={whitelistAddress} onChange={(e) => setWhitelistAddress(e.target.value)} className="block border p-2 w-full" />
        <select onChange={(e) => setIsWhitelisted(e.target.value === "true")} className="block border p-2 w-full mt-2">
          <option value="false">Remove</option>
          <option value="true">Whitelist</option>
        </select>
        <button onClick={handleSetWhitelistedUser} className="mt-2 p-2 bg-green-500 text-white rounded">Set Whitelist</button>
      </div>
    </div>
  );
}
