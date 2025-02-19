import { useEMSContext } from "../../context/EMSContext";

export default function AuditorPanel() {
  const { contract, setWhitelistAddress, setEvidenceDescription,
    caseId,evidenceId, evidenceDetails, setCaseId, setEvidenceId
   } = useEMSContext();

   const handleRedeemEvidenceDetails = async () => {
    if (!contract) return alert("Please connect your wallet first!");
    try {
      const details = await contract.redeemEvidenceDetails(caseId, evidenceId);
  
      const formattedDetails = {
        description: details[0], // Adjust based on contract return type
        owner: details[1],
        timestamp: Number(details[2]), // Ensure it's a number
        createdDateTime: details[3],
      };
  
      setEvidenceDetails(formattedDetails);
    } catch (error) {
      console.error("Error redeeming evidence details:", error);
    }
  };
  
  return(
      <div className="mt-6">
        <p>{whitelistAddress}</p>
        <h2 className="text-lg font-semibold">Redeem Evidence Details</h2>
        <input type="number" placeholder="Case ID" value={caseId} onChange={(e) => setCaseId(Number(e.target.value))} className="block border p-2 w-full" />
        <input type="number" placeholder="Evidence ID" value={evidenceId} onChange={(e) => setEvidenceId(Number(e.target.value))} className="block border p-2 w-full" />
        <button onClick={handleRedeemEvidenceDetails} className="mt-2 p-2 bg-yellow-500 text-white rounded">Redeem Evidence</button>
        {evidenceDetails && (
  <div className="mt-4 p-4 border rounded bg-gray-100">
    <h3 className="text-md font-semibold">Evidence Details</h3>
    <p><strong>Description:</strong> {evidenceDetails.description}</p>
    <p><strong>Owner:</strong> {evidenceDetails.owner}</p>
    <p><strong>Timestamp:</strong> {new Date(evidenceDetails.timestamp * 1000).toLocaleString()}</p>
    <p><strong>Created Date/Time:</strong> {evidenceDetails.createdDateTime}</p>
  </div>
)}
      </div>
    )



}
