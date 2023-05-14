import { atom } from "jotai";

export const createClientAtom = atom({
  name: "",
  email: "",
  invoice: "",
});

export const createClientAtomDate = atom<Date | undefined>(undefined);
