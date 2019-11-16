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

interface BookingSystemInterface extends Interface {
  functions: {
    getNbRooms: TypedFunctionDescription<{ encode([]: []): string }>;

    removeEvent: TypedFunctionDescription<{
      encode([id]: [BigNumberish]): string;
    }>;

    getEvent: TypedFunctionDescription<{
      encode([id]: [BigNumberish]): string;
    }>;

    addEvent: TypedFunctionDescription<{
      encode([title, room, year, month, day, startTime, endTime]: [
        string,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish
      ]): string;
    }>;
  };

  events: {
    EventAdded: TypedEventDescription<{
      encodeTopics([addedBy, id]: [null, null]): string[];
    }>;

    EventRemoved: TypedEventDescription<{
      encodeTopics([removedBy, id]: [null, null]): string[];
    }>;
  };
}

export class BookingSystem extends Contract {
  connect(signerOrProvider: Signer | Provider | string): BookingSystem;
  attach(addressOrName: string): BookingSystem;
  deployed(): Promise<BookingSystem>;

  on(event: EventFilter | string, listener: Listener): BookingSystem;
  once(event: EventFilter | string, listener: Listener): BookingSystem;
  addListener(
    eventName: EventFilter | string,
    listener: Listener
  ): BookingSystem;
  removeAllListeners(eventName: EventFilter | string): BookingSystem;
  removeListener(eventName: any, listener: Listener): BookingSystem;

  interface: BookingSystemInterface;

  functions: {
    getNbRooms(): Promise<number>;

    removeEvent(
      id: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;

    getEvent(
      id: BigNumberish
    ): Promise<{
      owner: string;
      title: string;
      room: number;
      year: number;
      month: number;
      day: number;
      startTime: number;
      endTime: number;
    }>;

    addEvent(
      title: string,
      room: BigNumberish,
      year: BigNumberish,
      month: BigNumberish,
      day: BigNumberish,
      startTime: BigNumberish,
      endTime: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>;
  };

  getNbRooms(): Promise<number>;

  removeEvent(
    id: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  getEvent(
    id: BigNumberish
  ): Promise<{
    owner: string;
    title: string;
    room: number;
    year: number;
    month: number;
    day: number;
    startTime: number;
    endTime: number;
  }>;

  addEvent(
    title: string,
    room: BigNumberish,
    year: BigNumberish,
    month: BigNumberish,
    day: BigNumberish,
    startTime: BigNumberish,
    endTime: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>;

  filters: {
    EventAdded(addedBy: null, id: null): EventFilter;

    EventRemoved(removedBy: null, id: null): EventFilter;
  };

  estimate: {
    getNbRooms(): Promise<BigNumber>;

    removeEvent(id: BigNumberish): Promise<BigNumber>;

    getEvent(id: BigNumberish): Promise<BigNumber>;

    addEvent(
      title: string,
      room: BigNumberish,
      year: BigNumberish,
      month: BigNumberish,
      day: BigNumberish,
      startTime: BigNumberish,
      endTime: BigNumberish
    ): Promise<BigNumber>;
  };
}
