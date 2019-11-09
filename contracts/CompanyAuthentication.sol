pragma solidity 0.5.11;
pragma experimental ABIEncoderV2;

contract CompanyAuthentication {
    uint256 private ADMIN_ROLE = 1;
    uint256 private USER_ROLE = 2;

    mapping (address => User) private users;
    mapping (uint256 => Company) private companies;
    uint256 private companiesCount;

    struct User {
        uint256 companyId;
        uint256 role;
    }

    struct Company {
        string name;
    }

    event CompanyAdded(address addedBy, uint256 id);
    event UserAdded(address addedBy, address userAddress);
    event UserRemoved(address addedBy, address userAddress);

    /**
     * Verifies that the called has the admin role
     */
    modifier onlyAdmin() {
        require(users[msg.sender].role == ADMIN_ROLE, "Not enough permissions: Admins");
        _;
    }

    /**
     * Verifies that the called is a registered user
     */
    modifier onlyUser() {
        require(isUserRegistered(), "Not enough permissions: Users");
        _;
    }

    constructor(string memory companyName) public {
        _addCompany(companyName);
        _addUser(msg.sender, true, companiesCount);
    }

    /**
     * Adds a new company
     */
    function addCompany(string memory companyName) public onlyAdmin returns (bool) {
        require(companiesCount + 1 > companiesCount, "Overflow number of companies");

        return _addCompany(companyName);
    }

    /**
     * Gets a company
     */
    function getCompany(uint256 id) public view onlyUser returns (Company memory) {
        return companies[id];
    }

    /**
     * Adds a user
     */
    function addUser(address userAddress, bool isAdmin, uint256 companyId) public onlyAdmin returns (bool) {
        require(userAddress != address(0), "Invalid 0x0 address");
        require(users[msg.sender].companyId == companyId, "Not enough permissions: Company");

        return _addUser(userAddress, isAdmin, companyId);
    }

    /**
     * Removes a user
     */
    function removeUser(address userAddress) public onlyAdmin {
        require(users[msg.sender].companyId == users[userAddress].companyId, "Not enough permissions: Company");

        delete users[userAddress];

        emit UserRemoved(msg.sender, userAddress);
    }

    /**
     * Gets a user
     */
    function getUser(address userAddress) public onlyUser view returns (User memory) {
        return users[userAddress];
    }

    /**
     * Returns true if the caller is a verified user
     */
    function isUserRegistered() public view returns (bool) {
        return users[msg.sender].role != 0;
    }

    // No remove or update user, just add a new one to override

    function _addUser(address userAddress, bool isAdmin, uint256 companyId) private returns (bool) {
        User memory user = User(companyId, isAdmin ? ADMIN_ROLE : USER_ROLE);
        users[userAddress] = user;

        emit UserAdded(msg.sender, userAddress);

        return true;
    }

    function _addCompany(string memory companyName) private returns (bool) {
        uint256 newCount = companiesCount + 1;
        Company memory company = Company(companyName);
        companies[newCount] = company;
        companiesCount = newCount;

        emit CompanyAdded(msg.sender, newCount);

        return true;
    }
}