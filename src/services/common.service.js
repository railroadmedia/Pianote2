import AsyncStorage from '@react-native-community/async-storage';
import {userLogin, configure} from '@musora/services';

export default {
    tryCall: async function (url, method, body) {
        try {
            if (body) body = body ? JSON.stringify(body) : null;
            let token = await AsyncStorage.getItem('token');
            token = `Bearer ${JSON.parse(token)}`;

            let headers = {Authorization: token};

            let response = await fetch(url, {
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
                const {response, error} = await userLogin({
                    email,
                    password: pass,
                });
                await configure({authToken: response.data.token});
                await AsyncStorage.multiSet([
                    ['token', JSON.stringify(response.data.token)],
                    ['tokenTime', JSON.stringify(response.data.token)],
                ]);
                response = await fetch(url, {
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
