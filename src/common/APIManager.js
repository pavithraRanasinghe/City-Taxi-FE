import * as Constants from '../common/Constants';
import { getUser } from './PersistanceManager';
import { LogOutUser } from './UserManager';

export const request = (endPoint, requestType, body) =>
  new Promise(async (resolve, reject) => {
    var token = '';

    const user = getUser();
    if (user) {
      token = 'Bearer ' + user.token;
    }

    fetch(Constants.BASE_API + endPoint, {
      method: requestType,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: body,
    })
      .then(response => {
        response
          .json()
          .then(json => {
            if (response.ok) {
              resolve(json);
            } else if (response.status === 417) {
              reject(json);
            } else {
              if (response.status === 401 || response.status === 403) {
                LogOutUser();
              }
              reject(json);
            }
          })
          .catch(error => {
            if (response.status === 401 || response.status === 403) {
              LogOutUser();
            }
            reject(response.status);
          });
      })
      .catch(error => {
        reject(error);
      });
  });

export const fileUpload = (endPoint, requestType, body) =>
  new Promise(async (resolve, reject) => {
    var token = '';

    const user = await getUser();
    if (user) {
      token = 'Bearer ' + user.token;
    }

    fetch(Constants.BASE_API + endPoint, {
      method: requestType,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: token,
      },
      body: body,
    })
      .then(response => {
        response
          .json()
          .then(json => {
            if (response.ok) {
              resolve(json);
            } else {
              if (response.status === 401) {
                LogOutUser();
              }
              // showAlert(json.status, json.message, 'danger');
              reject(json.status);
            }
          })
          .catch(error => {
            console.log('ERR', error);
            // console.log("ERS", response.status);
            // showAlert(response.status, error.description, 'danger');
            reject(response.status);
          });
      })
      .catch(error => {
        reject(error);
      });
  });
