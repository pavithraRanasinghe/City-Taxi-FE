import * as Constants from './Constants';

export const LogOutUser = async () => {
  try {
    localStorage.removeItem(Constants.USER);
    window.location.href = '/login?expire=true';
  } catch (e) {
    console.log(e);
  }
};
