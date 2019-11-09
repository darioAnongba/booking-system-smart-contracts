import { ethers } from "@nomiclabs/buidler";
import chai from "chai";
import { deployContract, getWallets, solidity } from "ethereum-waffle";

import CounterArtifact from "../artifacts/Counter.json";
import { Counter } from "../typechain/Counter";

chai.use(solidity);
const { expect } = chai;

describe("Counter", () => {
  const provider = ethers.provider;
  let [wallet] = getWallets(provider);
  let counter: Counter;

  beforeEach(async () => {
    counter = (await deployContract(wallet, CounterArtifact)) as Counter;
    const initialCount = await counter.getCount();

    expect(initialCount).to.eq(0);
    expect(counter.address).to.properAddress;
  });

  it("should count up", async () => {
    await counter.countUp();
    let count = await counter.getCount();
    expect(count).to.eq(1);

    await counter.countUp();
    count = await counter.getCount();
    expect(count).to.eq(2);
  });

  it("should count down", async () => {
    await counter.countUp();
    let count = await counter.getCount();
    expect(count).to.eq(1);

    await counter.countDown();
    count = await counter.getCount();
    expect(count).to.eq(0);
  });
});
