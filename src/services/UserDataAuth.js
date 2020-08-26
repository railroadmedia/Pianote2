import {configure} from '@musora/services';
import AsyncStorage from '@react-native-community/async-storage';

export async function getToken() {
    // return userID, expiry, token, tokenType
    try {
        const email = await AsyncStorage.getItem('email');
        const password = await AsyncStorage.getItem('password');

        let response = await fetch(
            `https://staging.pianote.com/usora/api/login?email=${email}&password=${password}`,
            {method: 'PUT'},
        );

        let data = await response.json();
        console.log('TOKEN DATA: ', data);
        await configure({authToken: data.token});
        return data;
    } catch (error) {
        console.log(error);
        return new Error(error);
    }
}

export async function getUserData(token) {
    // return profile details
    try {
        let response = await fetch(
            'https://staging.pianote.com/usora/api/profile',
            {method: 'PUT', headers: {Authorization: `Bearer ${token}`}},
        );
        return await response.json();
    } catch (error) {
        console.log(error);
        return new Error(error);
    }
}
