import { createContext } from "react";

export const UserDetailContext = createContext({
  userDetail: null,
  setUserDetail: () => {
    console.warn("No UserDetailProvider found");
  }
});