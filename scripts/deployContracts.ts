import { ethers } from "@nomiclabs/buidler";

async function main() {
  const authFactory = await ethers.getContract("CompanyAuthentication");
  let auth = await authFactory.deploy("Coca Cola", "Dario Anongba Varela");
  await auth.deployed();

  console.log("CompanyAuthentication address: ", auth.address);
  console.log(
    "CompanyAuthentication Transaction hash",
    auth.deployTransaction.hash
  );

  const bookingSystemFactory = await ethers.getContract("BookingSystem");
  let bookingSystem = await bookingSystemFactory.deploy(auth.address, 20);
  await bookingSystem.deployed();

  console.log("BookingSystem address: ", bookingSystem.address);
  console.log(
    "BookingSystem Transaction hash",
    bookingSystem.deployTransaction.hash
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
