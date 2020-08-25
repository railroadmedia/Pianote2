import {configure} from '@musora/services';

export async function getToken(username, password) {
    // return userID, expiry, token, tokenType
    try {
        let response = await fetch(
            `https://staging.pianote.com/usora/api/login?email=${username}&password=${password}`,
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
