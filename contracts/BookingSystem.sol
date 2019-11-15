pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

import './CompanyAuthentication.sol';

contract BookingSystem {
    CompanyAuthentication private _auth;
    uint16 private _nbRooms;

    // Mapping : Room => date (timestamp) => time => availability (yes or no)
    mapping (uint16 => mapping(uint256 => mapping(uint8 => bool)) ) private _availabilities; 

    /**
     * Verifies that the user is registered
     */
    modifier onlyUser() {
        require(_auth.isUserRegistered(), "Not enough permissions: Users");
        _;
    }

    constructor(CompanyAuthentication auth, uint16 nbRooms) public {
        _auth = auth;
        _nbRooms = nbRooms;
    }

    /**
     * Adds a new event
     */
    function addEvent(
        string memory name,
        uint256 room,
        uint16 year,
        uint8 month,
        uint8 day,
        uint8 startTime,
        uint8 endTime
    ) public onlyUser returns (bool) {

    }
}