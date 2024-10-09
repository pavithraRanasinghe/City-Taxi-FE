import * as Constants from "./Constants";

export const setUser = async (user) => {
  try {
    const jsonValue = JSON.stringify(user);
    localStorage.setItem(Constants.USER, jsonValue);
  } catch (e) {
    console.error(e);
  }
};

export const getUser = () => {
  try {
    const value = localStorage.getItem(Constants.USER);
    return JSON.parse(value);
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const removeUser = async (user) => {
  try {
    localStorage.removeItem(Constants.USER);
  } catch (e) {
    console.error(e);
  }
};