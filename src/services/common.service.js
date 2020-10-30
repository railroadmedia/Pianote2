import AsyncStorage from '@react-native-community/async-storage';
import {getToken} from './UserDataAuth';

export default {
    rootUrl: 'https://staging.pianote.com',
    tryCall: async function (url, method, body) {
        try {
            if (body) body = body ? JSON.stringify(body) : null;
            let headers = body
                ? {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json',
                  }
                : {
                      Authorization: `Bearer ${token}`,
                  };
            let newUrl = url;
            if (!url.includes('https')) {
                newUrl = url.replace('http', 'https');
            }
            let response = await fetch(newUrl, {
                body,
                headers,
                method: method || 'GET',
            });
            let json = await response.json();

            if (
                json.error === 'TOKEN_EXPIRED' ||
                json.error === 'Token not provided'
            ) {
                let email = await AsyncStorage.getItem('email');
                let pass = await AsyncStorage.getItem('password');
                token = (await getToken(email, pass)).token;
                response = await fetch(url, {
                    body,
                    headers,
                    method: method || 'GET',
                });
                return await response.json();
            }
            return json;
        } catch (error) {
            return error;
        }
    },
};
