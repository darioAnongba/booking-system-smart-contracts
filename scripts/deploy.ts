import { ethers } from "@nomiclabs/buidler";

async function main() {
  const factory = await ethers.getContract("Counter");

  let contract = await factory.deploy();

  // The address the Contract WILL have once mined
  console.log(contract.address);

  // The transaction that was sent to the network to deploy the Contract
  console.log(contract.deployTransaction.hash);

  await contract.deployed();
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
