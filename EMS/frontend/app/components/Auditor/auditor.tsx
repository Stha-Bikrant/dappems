import { useEMSContext } from "../../context/EMSContext";


export default function AuditorPanel() {
  const { contract, auditorAddress, caseId, evidenceDescription, createdDateTime,courtId,caseDescription, startDateTime
    , evidenceId, setEvidenceDescription, setCourtId, setCaseDescription,setStartDateTime,setCaseId, setCreatedDateTime
    ,setEvidenceId, setEvidenceDetails, evidenceDetails
  } = useEMSContext();


  const handleRegisterCase = async () => {
    if (!contract) return alert("Please connect your wallet first!");
    try {
      const tx = await contract.registerCase(courtId, caseDescription, startDateTime);
      await tx.wait();
      alert("Case registered successfully!");
    } catch (error) {
      console.error("Error registering case:", error);
    }
  };

  const handleRegisterEvidence = async () => {
    if (!contract) return alert("Please connect your wallet first!");
    try {
      const tx = await contract.registerEvidence(caseId, evidenceDescription, createdDateTime);
      await tx.wait();
      alert("Evidence registered successfully!");
    } catch (error) {
      console.error("Error registering evidence:", error);
    }
  };
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
  

  return (
      <div className="p-4 font-sans">
        <p>Auditor: {auditorAddress}</p>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Register Case</h2>
        <input type="text" placeholder="Court ID" value={courtId} onChange={(e) => setCourtId(e.target.value)} className="block border p-2 w-full" />
        <input type="text" placeholder="Case Description" value={caseDescription} onChange={(e) => setCaseDescription(e.target.value)} className="block border p-2 w-full mt-2" />
        <input type="text" placeholder="Start Date/Time" value={startDateTime} onChange={(e) => setStartDateTime(e.target.value)} className="block border p-2 w-full mt-2" />
        <button onClick={handleRegisterCase} className="mt-2 p-2 bg-green-500 text-white rounded">Register Case</button>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Register Evidence</h2>
        <input type="number" placeholder="Case ID" value={caseId} onChange={(e) => setCaseId(Number(e.target.value))} className="block border p-2 w-full" />
        <input type="text" placeholder="Evidence Description" value={evidenceDescription} onChange={(e) => setEvidenceDescription(e.target.value)} className="block border p-2 w-full mt-2" />
        <input type="text" placeholder="Created Date/Time" value={createdDateTime} onChange={(e) => setCreatedDateTime(e.target.value)} className="block border p-2 w-full mt-2" />
        <button onClick={handleRegisterEvidence} className="mt-2 p-2 bg-green-500 text-white rounded">Register Evidence</button>
      </div>

      <div className="mt-6">
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
    </div>
  );

}
