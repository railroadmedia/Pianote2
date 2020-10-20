import {configure} from '@musora/services';
import AsyncStorage from '@react-native-community/async-storage';

export async function getToken() {
    try {
        const data = await AsyncStorage.multiGet(['token', 'tokenTime', 'email', 'password']);
        let timeNow = new Date().getTime() / 1000;
        let token = data[0][1]
        let tokenTime = data[1][1]
        let email = data[2][1]
        let password = data[3][1]
        
        if(typeof token == 'undefined' || token == null || (Number(timeNow) - Number(tokenTime) > 3600)) {
            // if token dies not exist or is expired
            let response = await fetch(`http://app-staging.pianote.com/usora/api/login?email=${email}&password=${password}`, {method: 'PUT'});
            response = await response.json();
            
            await AsyncStorage.multiSet([
                ['token', response.token], 
                ['tokenTime', JSON.stringify(timeNow)]
            ]);
            await configure({authToken: response.token});
            return response;
        } else {
            let response = {'token': token}
            return response;
        }
    } catch (error) {
        console.log('getToken Error', error);
        return new Error(error);
    }
}

export async function getUserData() {
    // return profile details
    try {
        const auth = await getToken();
        let data = await fetch('http://app-staging.pianote.com/api/profile', {
            method: 'GET',
            headers: {Authorization: `Bearer ${auth.token}`},
        });

        let userData = await data.json();
        // update data
        await AsyncStorage.multiSet([
            ['totalXP', userData.totalXp.toString()],
            ['rank', userData.xpRank.toString()],
            ['userId', userData.id.toString()],
            ['displayName', userData.display_name.toString()],
            ['profileURI', userData.profile_picture_url.toString()],
            ['joined', userData.created_at.toString()],
            [
                'weeklyCommunityUpdatesClicked',
                userData.notify_weekly_update.toString(),
            ],
            [
                'commentRepliesClicked',
                userData.notify_on_lesson_comment_reply.toString(),
            ],
            [
                'commentLikesClicked',
                userData.notify_on_lesson_comment_like.toString(),
            ],
            [
                'forumPostRepliesClicked',
                userData.notify_on_forum_post_reply.toString(),
            ],
            [
                'forumPostLikesClicked',
                userData.notify_on_forum_post_like.toString(),
            ],
            [
                'notifications_summary_frequency_minutes',
                userData.notify_weekly_update.toString(),
            ],
        ]);
        return await userData;
    } catch (error) {
        console.log('getUserData Error: ', error);
        return new Error(error);
    }
}

export async function logOut() {
    // return profile details
    try {
        const auth = await getToken();
        let response = await fetch(
            'https://app-staging.pianote/usora/api/logout',
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log(response);

        console.log(await response.json());
        return await response.json();
    } catch (error) {
        console.log(error);
        return new Error(error);
    }
}
