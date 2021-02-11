import { getToken } from 'Pianote2/src/services/UserDataAuth.js';
import { updateFcmToken } from 'Pianote2/src/services/notification.service.js';

export let cache = {};
export default {
  rootUrl: 'https://staging.pianote.com',
  tryCall: async function (url, method, body) {
    try {
      //
      if (body) body = body ? JSON.stringify(body) : null;
      let headers = body
        ? {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        : {
            Authorization: `Bearer ${token}`
          };

      // URL calling --> change to https
      let newUrl = url;
      if (!url.includes('https')) {
        newUrl = url.replace('http', 'https');
      }

      // make call
      let response = await fetch(newUrl, {
        body,
        headers,
        method: method || 'GET'
      });

      // if error, get new token call again
      if (
        response.error == 'TOKEN_EXPIRED' ||
        response.error == 'Token not provided'
      ) {
        // reset global token
        await getToken();
        updateFcmToken();

        // remake headers w new GLOBAL TOKEN
        let headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // new call
        let res = await fetch(newUrl, {
          body,
          headers,
          method: method || 'GET'
        });

        // return new call
        return await res.json();
      }

      // if no error send initial result
      return await response.json();
    } catch (error) {
      return {
        title: 'Something went wrong...',
        message: `Pianote is down, we are working on a fix and it should be back shortly, thank you for your patience.`
      };
    }
  }
};
