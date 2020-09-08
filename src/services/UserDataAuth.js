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

export async function getUserData() {
    // return profile details
    try {
        const auth = await getToken();
        let data = await fetch(
            'http://app-staging.pianote.com/api/profile',
            {method: 'GET', headers: {Authorization: `Bearer ${auth.token}`}},
        );

        let userData = await data.json()
        
        // update data
        await AsyncStorage.multiSet([
            ['totalXP', userData.totalXp.toString()],
            ['rank', userData.xpRank.toString()],
            ['userId', userData.id.toString()],
            ['displayName', userData.display_name.toString()],
            ['profileURI', userData.profile_picture_url.toString()],
            ['joined', userData.created_at.toString()],
        ])
        return await userData;
    } catch (error) {
        console.log(error);
        return new Error(error);
    }
}

export async function logOut() {
    // return profile details
    try {
        const auth = await getToken();
        let response = await fetch(
            'https://staging.pianote.com/usora/api/logout',
            {
                headers: {Authorization: `Bearer ${auth.token}`},
            },
        );
        console.log(await response.json());
        return await response.json();
    } catch (error) {
        console.log(error);
        return new Error(error);
    }
}
