/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractTransaction, EventFilter, Signer } from "ethers";
import { Listener, Provider } from "ethers/providers";
import { Arrayish, BigNumber, BigNumberish, Interface } from "ethers/utils";
import {
  TransactionOverrides,
  TypedEventDescription,
  TypedFunctionDescription
} from ".";

interface CompanyAuthenticationInterface extends Interface {
  functions: {
    addUser: TypedFunctionDescription<{
      encode([userAddress, name, isAdmin, companyId]: [
        string,
        string,
        boolean,
        BigNumberish
      ]): string;
    }>;

    getCompany: TypedFunctionDescription<{
      encode([id]: [BigNumberish]): string;
    }>;

    getUser: TypedFunctionDescription<{
      encode([userAddress]: [string]): string;
    }>;

    isUserRegistered: TypedFunctionDescription<{ encode([]: []): string }>;

    removeUser: TypedFunctionDescription<{
      encode([userAddress]: [string]): string;
    }>;

    addCompany: TypedFunctionDescription<{
      encode([companyName]: [string]): string;
    }>;
  };

  events: {
    CompanyAdded: TypedEventDescription<{
      encodeTopics([addedBy, id]: [null, null]): string[];
    }>;

    UserAdded: TypedEventDescription<{
      encodeTopics([addedBy, userAddress]: [null, null]): string[];
    }>;

    UserRemoved: TypedEventDescription<{
      encodeTopics([removedBy, userAddress]: [null, null]): string[];
    }>;
  };
}

export class CompanyAuthentication extends Contract {
  connect(signerOrProvider: Signer | Provider | string): CompanyAuthentication;
  attach(addressOrName: string): CompanyAuthentication;
  deployed(): Promise<CompanyAuthentication>;

  on(event: EventFilter | string, listener: Listener): CompanyAuthentication;
  once(event: EventFilter | string, listener: Listener): CompanyAuthentication;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): CompanyAuthentication;
  removeAllListeners(eventName: EventFilter | string): CompanyAuthentication;
  removeListener(eventName: any, listener: Listener): CompanyAuthentication;

  interface: CompanyAuthenticationInterface;

  functions: {
    addUser(
      userAddress: string,
      name: string,
      isAdmin: boolean,
      companyId: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    getCompany(id: BigNumberish): Promise<{ name: string }>;

    getUser(
      userAddress: string
    ): Promise<{ name: string; companyId: BigNumber; role: BigNumber }>;

    isUserRegistered(): Promise<boolean>;

    removeUser(
      userAddress: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    addCompany(
      companyName: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;
  };

  addUser(
    userAddress: string,
    name: string,
    isAdmin: boolean,
    companyId: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  getCompany(id: BigNumberish): Promise<{ name: string }>;

  getUser(
    userAddress: string
  ): Promise<{ name: string; companyId: BigNumber; role: BigNumber }>;

  isUserRegistered(): Promise<boolean>;

  removeUser(
    userAddress: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  addCompany(
    companyName: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  filters: {
    CompanyAdded(addedBy: null, id: null): EventFilter;

    UserAdded(addedBy: null, userAddress: null): EventFilter;

    UserRemoved(removedBy: null, userAddress: null): EventFilter;
  };

  estimate: {
    addUser(
      userAddress: string,
      name: string,
      isAdmin: boolean,
      companyId: BigNumberish
    ): Promise<BigNumber>;

    getCompany(id: BigNumberish): Promise<BigNumber>;

    getUser(userAddress: string): Promise<BigNumber>;

    isUserRegistered(): Promise<BigNumber>;

    removeUser(userAddress: string): Promise<BigNumber>;

    addCompany(companyName: string): Promise<BigNumber>;
  };
}
