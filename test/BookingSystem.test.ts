import { ethers } from "@nomiclabs/buidler";
import chai from "chai";
import { deployContract, getWallets, solidity } from "ethereum-waffle";

import BookingSystemArtifact from "../artifacts/BookingSystem.json";
import { BookingSystem } from "../typechain/BookingSystem";

import CompanyAuthenticationArtifact from "../artifacts/CompanyAuthentication.json";
import { CompanyAuthentication } from "../typechain/CompanyAuthentication";

chai.use(solidity);
const { expect } = chai;

const MOCK_ROOM = 2;
const MOCK_YEAR = 2019;
const MOCK_MONTH = 11;
const MOCK_DAY = 31;
const MOCK_START_TIME = 9;
const MOCK_END_TIME = 11;

describe("BookingSystem", () => {
  const provider = ethers.provider;
  let [adminWallet, userWallet, anonymousWallet] = getWallets(provider);
  let bookingSystem: BookingSystem;
  let auth: CompanyAuthentication;

  const mockUserName = "Dario Anongba Varela";
  const mockNbRooms = 10;

  beforeEach(async () => {
    auth = (await deployContract(adminWallet, CompanyAuthenticationArtifact, [
      "Coca Cola",
      mockUserName
    ])) as CompanyAuthentication;

    await auth.addUser(userWallet.address, "User", false, 1);

    bookingSystem = (await deployContract(adminWallet, BookingSystemArtifact, [
      auth.address,
      mockNbRooms
    ])) as BookingSystem;
  });

  describe("Get number of rooms", () => {
    it("should successfully get the number of rooms as a user", async () => {
      const nbRooms = await bookingSystem.getNbRooms();
      expect(nbRooms).to.eq(mockNbRooms);
    });

    it("should fail to get the number of rooms as a non user", async () => {
      const bookingSystemAsAnonymous = bookingSystem.connect(anonymousWallet);

      try {
        await bookingSystemAsAnonymous.getNbRooms();
        expect.fail();
      } catch (error) {
        expect(error.message).to.equal(
          "VM Exception while processing transaction: revert Not enough permissions: Users"
        );
      }
    });
  });

  describe("Add Event", () => {
    describe("Validation", () => {
      it("should fail to add an event if room is invalid", async () => {
        try {
          await addEvent(0);
          expect.fail();
        } catch (error) {
          expect(error.message).to.equal(
            "VM Exception while processing transaction: revert Invalid room number"
          );
        }

        try {
          await addEvent(mockNbRooms + 1);
          expect.fail();
        } catch (error) {
          expect(error.message).to.equal(
            "VM Exception while processing transaction: revert Invalid room number"
          );
        }
      });

      it("should fail to add an event if month is invalid", async () => {
        try {
          await addEvent(MOCK_ROOM, MOCK_YEAR, 0);
          expect.fail();
        } catch (error) {
          expect(error.message).to.equal(
            "VM Exception while processing transaction: revert Invalid month"
          );
        }

        try {
          await addEvent(2, MOCK_YEAR, 13);
          expect.fail();
        } catch (error) {
          expect(error.message).to.equal(
            "VM Exception while processing transaction: revert Invalid month"
          );
        }
      });

      it("should fail to add an event if day is invalid", async () => {
        try {
          await addEvent(MOCK_ROOM, MOCK_YEAR, MOCK_MONTH, 0);
          expect.fail();
        } catch (error) {
          expect(error.message).to.equal(
            "VM Exception while processing transaction: revert Invalid day"
          );
        }

        try {
          await addEvent(MOCK_ROOM, MOCK_YEAR, MOCK_MONTH, 32);
          expect.fail();
        } catch (error) {
          expect(error.message).to.equal(
            "VM Exception while processing transaction: revert Invalid day"
          );
        }
      });

      it("should fail to add an event if startTime is invalid", async () => {
        try {
          await addEvent(MOCK_ROOM, MOCK_YEAR, MOCK_MONTH, MOCK_DAY, 25);
          expect.fail();
        } catch (error) {
          expect(error.message).to.equal(
            "VM Exception while processing transaction: revert Invalid start time or end time"
          );
        }
      });

      it("should fail to add an event if endTime is invalid", async () => {
        try {
          await addEvent(
            MOCK_ROOM,
            MOCK_YEAR,
            MOCK_MONTH,
            MOCK_DAY,
            MOCK_START_TIME,
            25
          );
          expect.fail();
        } catch (error) {
          expect(error.message).to.equal(
            "VM Exception while processing transaction: revert Invalid start time or end time"
          );
        }
      });

      it("should fail to add an event if startTime is endTime than startTime", async () => {
        try {
          await addEvent(2, MOCK_YEAR, MOCK_MONTH, MOCK_DAY, 11, 9);
          expect.fail();
        } catch (error) {
          expect(error.message).to.equal(
            "VM Exception while processing transaction: revert start time must be smaller than end time"
          );
        }
      });
    });

    it("should successfully add an event as a user", async () => {
      const event = await addEvent();

      expect(event.room).to.equal(2);
      expect(event.year).to.equal(MOCK_YEAR);
      expect(event.month).to.equal(MOCK_MONTH);
      expect(event.day).to.equal(MOCK_DAY);
      expect(event.startTime).to.equal(MOCK_START_TIME);
      expect(event.endTime).to.equal(MOCK_END_TIME);
    });

    it("should successfully add non conflicting events on the same day for the same room", async () => {
      await addEvent(MOCK_ROOM, MOCK_YEAR, MOCK_MONTH, MOCK_DAY, 0, 5);
      await addEvent(MOCK_ROOM, MOCK_YEAR, MOCK_MONTH, MOCK_DAY, 5, 15);
      const event2 = await addEvent(
        MOCK_ROOM,
        MOCK_YEAR,
        MOCK_MONTH,
        MOCK_DAY,
        15,
        24
      );

      expect(event2.startTime).to.eq(15);
      expect(event2.endTime).to.eq(24);
    });

    it("should successfully book events for different rooms", async () => {
      const event0 = await addEvent(1);
      expect(event0.room).to.eq(1);

      const event1 = await addEvent(2);
      expect(event1.room).to.eq(2);

      const event2 = await addEvent(3);
      expect(event2.room).to.eq(3);
    });

    it("should successfully book events for same room but different dates (day)", async () => {
      await addEvent();
      await addEvent(MOCK_ROOM, MOCK_YEAR, MOCK_MONTH, 12);
      const event2 = await addEvent(MOCK_ROOM, MOCK_YEAR, MOCK_MONTH, 13);

      expect(event2.day).to.eq(13);
    });

    it("should fail to add an event as a non user", async () => {
      const bookingSystemAsAnonymous = bookingSystem.connect(anonymousWallet);

      try {
        await bookingSystemAsAnonymous.addEvent(
          "Event title",
          MOCK_ROOM,
          MOCK_YEAR,
          MOCK_MONTH,
          MOCK_DAY,
          MOCK_START_TIME,
          MOCK_END_TIME
        );
        expect.fail();
      } catch (error) {
        expect(error.message).to.equal(
          "VM Exception while processing transaction: revert Not enough permissions: Users"
        );
      }
    });

    it("should fail to add an event in an already booked range", async () => {
      await addEvent();

      try {
        await addEvent();
        expect.fail();
      } catch (error) {
        expect(error.message).to.equal(
          "VM Exception while processing transaction: revert Desired time range is not available"
        );
      }
    });
  });

  describe("Remove event", () => {
    beforeEach(async () => {
      await addEvent(); // Will always be ID 1
    });

    it("Should successfully remove an event if caller is owner", async () => {
      await removeEvent(1);
    });

    it("should fail to remove an event if caller is not owner", async () => {
      const bookingSystemAsUser = bookingSystem.connect(userWallet);

      try {
        await removeEvent(1, bookingSystemAsUser);
        expect.fail();
      } catch (error) {
        expect(error.message).to.equal(
          "VM Exception while processing transaction: revert Event does not exist or caller is not event owner"
        );
      }
    });

    it("should fail to remove an inexistent event", async () => {
      try {
        await removeEvent(2);
        expect.fail();
      } catch (error) {
        expect(error.message).to.equal(
          "VM Exception while processing transaction: revert Event does not exist or caller is not event owner"
        );
      }
    });

    it("should fail to remove an event as a non user", async () => {
      const bookingSystemAsAnonymous = bookingSystem.connect(anonymousWallet);

      try {
        await removeEvent(1, bookingSystemAsAnonymous);
        expect.fail();
      } catch (error) {
        expect(error.message).to.equal(
          "VM Exception while processing transaction: revert Not enough permissions: Users"
        );
      }
    });
  });

  const addEvent = async (
    roomNumber: number = MOCK_ROOM,
    year: number = MOCK_YEAR,
    month: number = MOCK_MONTH,
    day: number = MOCK_DAY,
    startTime: number = MOCK_START_TIME,
    endTime: number = MOCK_END_TIME
  ) => {
    const tx = await bookingSystem.addEvent(
      "Event title",
      roomNumber,
      year,
      month,
      day,
      startTime,
      endTime
    );
    const txReceipt = await tx.wait();

    const eventObj = txReceipt.events![0];
    const args = eventObj.args as any;
    expect(eventObj.event).to.equal("EventAdded");
    expect(args.addedBy).to.equal(adminWallet.address);

    return await bookingSystem.getEvent(args.id);
  };

  const removeEvent = async (
    eventId: number,
    currBookingSystem: BookingSystem = bookingSystem
  ) => {
    const tx = await currBookingSystem.removeEvent(eventId);
    const txReceipt = await tx.wait();

    const eventObj = txReceipt.events![0];
    const args = eventObj.args as any;
    expect(eventObj.event).to.equal("EventRemoved");
    expect(args.removedBy).to.equal(
      await currBookingSystem.signer.getAddress()
    );
    expect(args.id).to.equal(eventId);
  };
});
