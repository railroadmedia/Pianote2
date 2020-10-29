import AsyncStorage from '@react-native-community/async-storage';
import {getToken} from './UserDataAuth';

export default {
    rootUrl: 'https://staging.pianote.com',
    tryCall: async function (url, method, body) {
        try {
            if (body) body = body ? JSON.stringify(body) : null;
            let token = await AsyncStorage.getItem('token');
            
            token = `Bearer ${token}`;
            let headers = body
                ? {
                      Authorization: token,
                      'Content-Type': 'application/json',
                  }
                : {
                      Authorization: token,
                  };
            let newUrl = url;
            if (!url.includes('https')) {
                newUrl = url.replace('http', 'https')
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
                const res = await getToken(email, pass);
                response = await fetch(url, {
                    body,
                    headers,
                    method: method || 'GET',
                });
                let newJson = await response.json();
                return newJson;
            }
            return json;
        } catch (error) {
            return error;
        }
    },
};
