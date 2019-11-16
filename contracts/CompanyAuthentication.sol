pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

contract CompanyAuthentication {
    uint256 private ADMIN_ROLE = 1;
    uint256 private USER_ROLE = 2;

    mapping (address => User) private _users;
    mapping (uint256 => Company) private _companies;
    uint256 private _companiesCount;

    struct User {
        string name; // For convenience, won't be added to Blockchain normally
        uint256 companyId;
        uint256 role;
    }

    struct Company {
        string name;
    }

    event CompanyAdded(address addedBy, uint256 id);
    event UserAdded(address addedBy, address userAddress);
    event UserRemoved(address removedBy, address userAddress);

    /**
     * Verifies that the user has the admin role
     */
    modifier onlyAdmin() {
        require(_users[msg.sender].role == ADMIN_ROLE, "Not enough permissions: Admins");
        _;
    }

    /**
     * Verifies that the user is registered
     */
    modifier onlyUser() {
        require(isUserRegistered(msg.sender), "Not enough permissions: Users");
        _;
    }

    constructor(string memory companyName, string memory userName) public {
        _addCompany(companyName);
        _addUser(msg.sender, userName, true, _companiesCount);
    }

    /**
     * Adds a new company
     */
    function addCompany(string memory companyName) public onlyAdmin returns (bool) {
        require(_companiesCount + 1 > _companiesCount, "Overflow number of companies");

        return _addCompany(companyName);
    }

    /**
     * Gets a company
     */
    function getCompany(uint256 id) public view onlyUser returns (Company memory) {
        return _companies[id];
    }

    /**
     * Adds a user
     */
    function addUser(address userAddress, string memory name, bool isAdmin, uint256 companyId) public onlyAdmin returns (bool) {
        require(userAddress != address(0), "Invalid 0x0 address");
        require(bytes(_companies[companyId].name).length != 0, "Company not found");

        return _addUser(userAddress, name, isAdmin, companyId);
    }

    /**
     * Removes a user
     */
    function removeUser(address userAddress) public onlyAdmin {
        require(_users[msg.sender].companyId == _users[userAddress].companyId, "Not enough permissions: Company");

        delete _users[userAddress];

        emit UserRemoved(msg.sender, userAddress);
    }

    /**
     * Gets a user
     */
    function getUser(address userAddress) public onlyUser view returns (User memory) {
        return _users[userAddress];
    }

    /**
     * Logs in by returning the user corresponding to msg.sender
     */
    function login() public onlyUser view returns (User memory) {
        return getUser(msg.sender);
    }

    /**
     * Returns true if the caller is a verified user
     */
    function isUserRegistered(address userAddress) public view returns (bool) {
        return _users[userAddress].role != 0;
    }

    // No remove or update user, just add a new one to override

    function _addUser(address userAddress, string memory name, bool isAdmin, uint256 companyId) private returns (bool) {
        User memory user = User(name, companyId, isAdmin ? ADMIN_ROLE : USER_ROLE);
        _users[userAddress] = user;

        emit UserAdded(msg.sender, userAddress);

        return true;
    }

    function _addCompany(string memory companyName) private returns (bool) {
         _companiesCount = _companiesCount + 1;
        Company memory company = Company(companyName);
        _companies[_companiesCount] = company;

        emit CompanyAdded(msg.sender, _companiesCount);

        return true;
    }
}