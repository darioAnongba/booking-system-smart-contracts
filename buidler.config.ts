import { BuidlerConfig, usePlugin } from "@nomiclabs/buidler/config";
import waffleDefaultAccounts from "ethereum-waffle/dist/config/defaultAccounts";
import { config } from "dotenv";

// Use ENV variables from .env
config();

// Plugins
usePlugin("@nomiclabs/buidler-ethers");

const buidlerConfig: BuidlerConfig = {
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
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`${process.env.RINKEBY_PRIVATE_KEY}`]
    }
  }
};

export default buidlerConfig;
