import { ethers } from "@nomiclabs/buidler";

async function main() {
  const factory = await ethers.getContract("CompanyAuthentication");

  let contract = await factory.deploy("Coca Cola");
  await contract.deployed();

  console.log("Contract address: ", contract.address);
  console.log("Transaction hash", contract.deployTransaction.hash);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
