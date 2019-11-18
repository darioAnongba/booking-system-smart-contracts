pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

import './CompanyAuthentication.sol';

contract BookingSystem {
    CompanyAuthentication private _auth;
    uint16 private _nbRooms;
    uint256 private _eventCount;

    // Mapping : Room => date => time => availability (yes or no)
    mapping (uint16 => mapping(bytes32 => mapping(uint8 => bool)) ) private _availabilities; 
    mapping (uint256 => Event) private _events; 

    struct Event {
        address owner;
        string title; // Optional
        uint16 room;
        uint16 year;
        uint8 month;
        uint8 day;
        uint8 startTime;
        uint8 endTime;
        string timezone; // Optional 
    }

    event EventAdded(address addedBy, uint256 id);
    event EventRemoved(address removedBy, uint256 id);

    /**
     * Verifies that the user is registered
     */
    modifier onlyUser() {
        require(_auth.isUserRegistered(msg.sender), "Not enough permissions: Users");
        _;
    }

    constructor(CompanyAuthentication auth, uint16 nbRooms) public {
        _auth = auth;
        _nbRooms = nbRooms;
        _eventCount = 0;
    }

    /**
     * Gets the number of rooms
     */
    function getNbRooms() public onlyUser view returns (uint16) {
        return _nbRooms;
    }

    /**
     * Gets an event
     */
    function getEvent(uint256 id) public onlyUser view returns (Event memory) {
        return _events[id];
    }

    /**
     * Adds a new event
     */
    function addEvent(
        string memory title,
        uint16 room,
        uint16 year,
        uint8 month,
        uint8 day,
        uint8 startTime,
        uint8 endTime,
        string memory timezone
    ) public onlyUser returns (bool) {
        _verifyParams(room, month, day, startTime, endTime);

        bytes32 encodedDate = _encodeDate(year, month, day);
        _verifyAvailability(room, encodedDate, startTime, endTime);

        Event memory newEvent = Event(msg.sender, title, room, year, month, day, startTime, endTime, timezone);
        return _addEvent(newEvent);
    }

    /**
     * Removes an event
     */
    function removeEvent(uint256 id) public onlyUser returns (bool) {
        require(_events[id].owner == msg.sender, "Event does not exist or caller is not event owner");
        return _removeEvent(id);
    }

    /**
     * Creates a unique representation of a date
     */
    function _encodeDate(uint16 year, uint8 month, uint8 day) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(year, month, day));
    }

    function _verifyParams(
        uint16 room,
        uint8 month,
        uint8 day,
        uint8 startTime,
        uint8 endTime
    ) private view returns (bool) {
        require(room > 0 && room <= _nbRooms , "Invalid room number");
        require(month > 0 && month <= 12, "Invalid month");
        require(day > 0 && day <= 31, "Invalid day");
        require(startTime <= 24 && endTime <= 24, "Invalid start time or end time");
        require(startTime < endTime, "start time must be smaller than end time");

        return true;
    }

    function _verifyAvailability(
        uint16 room,
        bytes32 encodedDate,
        uint8 startTime,
        uint8 endTime
    ) private view returns (bool) {
        mapping(uint8 => bool) storage timeAvailabilities = _availabilities[room][encodedDate];

        for(uint8 i = startTime; i < endTime; i++) {
            require(!timeAvailabilities[i], "Desired time range is not available");
        }

        return true;
    }

    function _addEvent(Event memory newEvent) private returns (bool) {
        for(uint8 i = newEvent.startTime; i < newEvent.endTime; i++) {
            bytes32 encodedDate = _encodeDate(newEvent.year, newEvent.month, newEvent.day);
            _availabilities[newEvent.room][encodedDate][i] = true;
        }

        _eventCount = _eventCount + 1;
        _events[_eventCount] = newEvent;

        emit EventAdded(msg.sender, _eventCount);

        return true;
    }

    function _removeEvent(uint256 id) private returns (bool) {
        Event memory eventToRemove = getEvent(id);

        for(uint8 i = eventToRemove.startTime; i < eventToRemove.endTime; i++) {
            bytes32 encodedDate = _encodeDate(eventToRemove.year, eventToRemove.month, eventToRemove.day);
            _availabilities[eventToRemove.room][encodedDate][i] = false;
        }

        delete _events[id];

        emit EventRemoved(msg.sender, id);

        return true;
    }
}