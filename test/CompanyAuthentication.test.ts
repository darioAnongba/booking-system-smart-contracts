import { ethers } from "@nomiclabs/buidler";
import chai from "chai";
import { deployContract, getWallets, solidity } from "ethereum-waffle";

import CompanyAuthenticationArtifact from "../artifacts/CompanyAuthentication.json";
import { CompanyAuthentication } from "../typechain/CompanyAuthentication";

chai.use(solidity);
const { expect } = chai;

describe("CompanyAuthentication", () => {
  const provider = ethers.provider;
  let [adminWallet, userWallet, anonymousWallet] = getWallets(provider);
  let auth: CompanyAuthentication;

  beforeEach(async () => {
    auth = (await deployContract(adminWallet, CompanyAuthenticationArtifact, [
      "Coca Cola"
    ])) as CompanyAuthentication;

    const isUserRegistered = await auth.isUserRegistered();
    expect(isUserRegistered).to.be.true;

    const user = await auth.getUser(adminWallet.address);
    expect(user.companyId).to.equal(1);
    expect(user.role).to.eq(1);
  });

  describe("Companies", () => {
    it("should successfully add a company as an admin", async () => {
      const tx = await auth.addCompany("Pepsi");
      const txReceipt = await tx.wait();

      const eventObj = txReceipt.events![0];
      const args = eventObj.args as any;
      expect(eventObj.event).to.equal("CompanyAdded");
      expect(args.addedBy).to.equal(adminWallet.address);
      expect(args.id).to.equal(2);

      const company = await auth.getCompany(args.id);
      expect(company.name).to.equal("Pepsi");
    });

    it("should fail to add a company as a non admin", async () => {
      const bookingSystemAsUser = auth.connect(userWallet);

      try {
        await bookingSystemAsUser.addCompany("Pepsi");
        expect.fail();
      } catch (error) {
        expect(error.message).to.equal(
          "VM Exception while processing transaction: revert Not enough permissions: Admins"
        );
      }
    });
  });

  describe("Users", () => {
    beforeEach(async () => {
      const tx = await auth.addCompany("Pepsi");
      await tx.wait();
    });

    it("should successfully add a user if admin", async () => {
      const companyId = 1;

      const addedUser = await addUser(userWallet.address, false, 1);
      expect(addedUser.companyId).to.equal(companyId);
      expect(addedUser.role).to.equal(2);

      const bookingSystemAsUser = auth.connect(userWallet);

      const isUserRegistered = await bookingSystemAsUser.isUserRegistered();
      expect(isUserRegistered).to.be.true;
    });

    it("should successfully add a user as admin if admin", async () => {
      const companyId = 1;

      const addedUser = await addUser(userWallet.address, true, 1);
      expect(addedUser.companyId).to.equal(companyId);
      expect(addedUser.role).to.equal(1);
    });

    it("should fail to add user if not from same company", async () => {
      const companyId = 2;

      try {
        await auth.addUser(userWallet.address, false, companyId);
        expect.fail();
      } catch (error) {
        expect(error.message).to.equal(
          "VM Exception while processing transaction: revert Not enough permissions: Company"
        );
      }
    });

    it("should fail to add user if not admin", async () => {
      const companyId = 1;
      await addUser(userWallet.address, false, companyId);

      const bookingSystemAsUser = auth.connect(userWallet);

      try {
        await bookingSystemAsUser.addUser(
          anonymousWallet.address,
          false,
          companyId
        );
        expect.fail();
      } catch (error) {
        expect(error.message).to.equal(
          "VM Exception while processing transaction: revert Not enough permissions: Admins"
        );
      }
    });

    it("should fail to get user if not user", async () => {
      const bookingSystemAsUser = auth.connect(anonymousWallet);

      try {
        await bookingSystemAsUser.getUser(adminWallet.address);
        expect.fail();
      } catch (error) {
        expect(error.message).to.equal(
          "VM Exception while processing transaction: revert Not enough permissions: Users"
        );
      }
    });

    const addUser = async (
      userAddress: string,
      isAdmin: boolean,
      companyId: number
    ) => {
      const tx = await auth.addUser(userAddress, isAdmin, companyId);
      const txReceipt = await tx.wait();

      const eventObj = txReceipt.events![0];
      const args = eventObj.args as any;
      expect(eventObj.event).to.equal("UserAdded");
      expect(args.addedBy).to.equal(adminWallet.address);
      expect(args.userAddress).to.equal(userWallet.address);

      return await auth.getUser(userWallet.address);
    };
  });
});
