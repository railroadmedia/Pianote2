export default {
  rootUrl: 'https://staging.pianote.com',
  //'https://www.pianote.com',
  //'https://staging.pianote.com'
  tryCall: async function (url, method, body) {
    try {
      if (body) body = body ? JSON.stringify(body) : null;
      let headers = body
        ? {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        : {
            Authorization: `Bearer ${token}`
          };
      let newUrl = url;
      if (!url.includes('https')) {
        newUrl = url.replace('http', 'https');
      }
      let response = await fetch(newUrl, {
        body,
        headers,
        method: method || 'GET'
      });
      let json = await response.json();

      if (
        json.error === 'TOKEN_EXPIRED' ||
        json.error === 'Token not provided'
      ) {
        response = await fetch(newUrl, {
          body,
          headers,
          method: method || 'GET'
        });
        return await response.json();
      }
      return json;
    } catch (error) {
      return {
        title: 'Something went wrong...',
        message: `Pianote is down, we are working on a fix and it should be back shortly, thank you for your patience.`
      };
    }
  }
};
