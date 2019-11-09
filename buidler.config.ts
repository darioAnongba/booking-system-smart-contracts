import { BuidlerConfig, usePlugin } from "@nomiclabs/buidler/config";
import waffleDefaultAccounts from "ethereum-waffle/dist/config/defaultAccounts";

usePlugin("@nomiclabs/buidler-ethers");

const INFURA_API_KEY = "17bdf0c31aa347c3bcec2cf4e2f65a14";
const RINKEBY_PRIVATE_KEY =
  "0xbfcf1006876a5341bc519b34b835de4867221849480b4f511dfd6fa40c196e02";

const config: BuidlerConfig = {
  solc: {
    version: "0.5.11"
  },
  defaultNetwork: "buidlerevm",
  networks: {
    buidlerevm: {
      accounts: waffleDefaultAccounts.map(acc => ({
        balance: acc.balance,
        privateKey: acc.secretKey
      }))
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [RINKEBY_PRIVATE_KEY]
    }
  }
};

export default config;
