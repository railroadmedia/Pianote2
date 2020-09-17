import {configure} from '@musora/services';
import AsyncStorage from '@react-native-community/async-storage';

export async function getToken() {
    try {
        const email = await AsyncStorage.getItem('email');
        const password = await AsyncStorage.getItem('password');

        let response = await fetch(
            `http://app-staging.pianote.com/usora/api/login?email=${email}&password=${password}`,
            {method: 'PUT'},
        );

        let data = await response.json();

        await configure({authToken: data.token});

        return data;
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

        console.log('USER DATA: ', userData);

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
