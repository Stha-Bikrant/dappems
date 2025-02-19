// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract EMS is Ownable {
    address Admin = msg.sender;

    // Role mappings
    mapping(address => bool) private auditors; //For Admin controlled Auditors
    mapping(address => bool) private whitelistedUsers; //For Admin controlled Whitelisters

    // Events
    event AuditorUpdated(address indexed auditor, bool status);
    event WhitelistedUsersUpdated(address indexed auditor, bool status);
    //--
    event CaseRegistered(
        uint256 indexed caseId,
        string courtId,
        string caseDescription,
        string startDateTime
    );

    // Structs
    struct Evidence {
        string description;
        address owner;
        uint256 timestamp;
        string createdDateTime;
    }

    struct Case {
        string courtId;
        string caseDescription;
        uint256 totalEvidences;
        string startDateTime;
        bool initialised;
    }

    // State variables
    uint256 public totalCases = 0;

    //mapping
    mapping(uint256 => Case) public cases; // Mapping of case IDs to cases
    mapping(uint256 => mapping(uint256 => Evidence)) public evidences; // Nested mapping for case-specific evidence

    event EvidenceRegistered(
        uint256 indexed caseId,
        uint256 indexed evidenceId,
        string description,
        address owner,
        uint256 timestamp,
        string createdDateTime
    );
    constructor() Ownable(Admin) {}

    // Modifiers
    modifier onlyAuditor() {
        require(auditors[msg.sender], "Error: Caller is not an auditor");
        _;
    }

    modifier onlyWhitelisted() {
        require(
            whitelistedUsers[msg.sender] || msg.sender == owner(),
            "Error: Caller is not authorized"
        );
        _;
    }

    modifier onlyAuditorOrWhitelisted() {
        require(
            auditors[msg.sender] || whitelistedUsers[msg.sender],
            "Error: Caller is neither auditor nor whitelisted user"
        );
        _;
    }

    // Admin Functions
    // Function to set an auditor (only admin/owner)
    function setAuditor(address _auditor, bool _status) external onlyOwner {
        auditors[_auditor] = _status;
        emit AuditorUpdated(_auditor, _status);
    }

    // Function to check if an address is an auditor
    function isAuditor(address _auditor) external view returns (bool) {
        return auditors[_auditor];
    }

    // Function to set an auditor (only admin/owner)
    function setWhiteListedUsers(
        address _auditor,
        bool _status
    ) external onlyOwner {
        whitelistedUsers[_auditor] = _status;
        emit WhitelistedUsersUpdated(_auditor, _status);
    }

    // Function to check if an address is an auditor
    function isWhiteListedUsers(address _auditor) external view returns (bool) {
        return whitelistedUsers[_auditor];
    }

    //Auditors Function
    // Case Management
    function registerCase(
        string memory _courtId,
        string memory _caseDescription,
        string memory _startDateTime
    ) external onlyAuditor {
        require(bytes(_courtId).length > 0, "Error: Court ID cannot be empty");
        require(
            bytes(_caseDescription).length > 0,
            "Error: Case description cannot be empty"
        );
        require(
            bytes(_startDateTime).length > 0,
            "Error: Start date/time cannot be empty"
        );

        totalCases++;
        Case storage newCase = cases[totalCases];
        newCase.courtId = _courtId;
        newCase.caseDescription = _caseDescription;
        newCase.totalEvidences = 0;
        newCase.startDateTime = _startDateTime;
        newCase.initialised = true;

        emit CaseRegistered(
            totalCases,
            _courtId,
            _caseDescription,
            _startDateTime
        );
    }

    // Evidence Management with NFT Minting
    function registerEvidence(
        uint256 _caseId,
        string memory _description,
        string memory _createdDateTime
    ) external onlyAuditor {
        require(_caseId > 0 && _caseId <= totalCases, "Error: Invalid case ID");
        require(
            bytes(_description).length > 0,
            "Error: Description cannot be empty"
        );
        require(
            bytes(_createdDateTime).length > 0,
            "Error: Created date/time cannot be empty"
        );

        Case storage contextCase = cases[_caseId];
        require(contextCase.initialised, "Error: Case does not exist");

        uint256 evidenceId = ++contextCase.totalEvidences;
        evidences[_caseId][evidenceId] = Evidence({
            description: _description,
            owner: msg.sender,
            timestamp: block.timestamp,
            createdDateTime: _createdDateTime
        });

        emit EvidenceRegistered(
            _caseId,
            evidenceId,
            _description,
            msg.sender,
            block.timestamp,
            _createdDateTime
        );
    }

    // Redeem  to View Evidence Details
    function redeemEvidenceDetails(
        uint _caseID,
        uint _evidenceID
    )
        external
        view
        onlyAuditorOrWhitelisted
        returns (
            string memory description,
            address owner,
            uint256 timestamp,
            string memory createdDateTime
        )
    {
        // Retrieve the evidence details
        Evidence storage evd = evidences[_caseID][_evidenceID];
        return (evd.description, evd.owner, evd.timestamp, evd.createdDateTime);
    }
}
