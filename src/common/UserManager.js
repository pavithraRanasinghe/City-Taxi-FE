import * as Constants from './Constants';

export const LogOutUser = async () => {
  try {
    localStorage.removeItem(Constants.USER);
    window.location.href = '/login?expire=true';
  } catch (e) {
    console.log(e);
  }
};

export const LogOut = async () => {
  try {
    localStorage.removeItem(Constants.USER);
    window.location.href = "/login";
  } catch (e) {
    console.log(e);
  }
};
