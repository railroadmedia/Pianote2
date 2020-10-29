import AsyncStorage from '@react-native-community/async-storage';
import {Platform} from 'react-native';
import commonService from './common.service';

export async function getToken(userEmail, userPass, purchases) {
    try {
        const data = await AsyncStorage.multiGet(['email', 'password']);
        let email = data[0][1];
        let password = data[1][1];

        let response = await fetch(
            `${commonService.rootUrl}/usora/api/login?email=${
                userEmail || email
            }&password=${userPass || password}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: purchases ? JSON.stringify(purchases) : {},
            },
        );
        let jsonRes = await response.json();
        return jsonRes;
    } catch (error) {
        console.log('getToken Error', error);
        return new Error(error);
    }
}
export async function forgotPass(emailAddress) {
    return commonService.tryCall(
        `${commonService.rootUrl}/api/forgot?email=${emailAddress}`,
        'PUT',
    );
}

export async function changePassword(email, pass, token) {
    console.log(email, pass, token);
    return commonService.tryCall(
        `${commonService.rootUrl}/api/change-password`,
        'PUT',
        {
            pass1: pass,
            user_login: email,
            rp_key: token,
        },
    );
}
export async function getUserData() {
    // return profile details
    try {
        let userData = await commonService.tryCall(
            `${commonService.rootUrl}/api/profile`,
        );
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
        return commonService.tryCall(
            `${commonService.rootUrl}/usora/api/logout`,
            'PUT',
        );
    } catch (error) {
        console.log(error);
        return new Error(error);
    }
}

export async function signUp(email, password, purchase, oldToken) {
    console.log('signup', email, password, purchase);
    let platform = '';
    let receiptType = '';
    let attributes;
    if (Platform.OS === 'ios') {
        platform = 'apple';
        receiptType = 'appleReceipt';
        attributes = {email, password, receipt: purchase.transactionReceipt};
    } else {
        platform = 'google';
        receiptType = 'googleReceipt';
        attributes = {
            email,
            password,
            package_name: `com.pianote2`,
            product_id: purchase.productId || purchase.product_id,
            purchase_token: purchase.purchaseToken || purchase.purchase_token,
        };
    }
    let token = await AsyncStorage.getItem('token');
    let headers;
    if (token) {
        token = `Bearer ${JSON.parse(token)}`;
        headers = {
            Authorization: token,
            'Content-Type': 'application/json',
        };
    } else {
        headers = {'Content-Type': 'application/json'};
    }

    console.log('signup token', token, headers);
    console.log(attributes);
    try {
        let response = await fetch(
            `${commonService.rootUrl}/mobile-app/${platform}/verify-receipt-and-process-payment`,
            {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    data: {
                        type: receiptType,
                        attributes: attributes,
                    },
                }),
            },
        );
        return await response.json();
    } catch (error) {
        console.log('err', error);
        return new Error(error);
    }
}

export async function restorePurchase(purchases) {
    let platform = Platform.OS === 'ios' ? 'apple' : 'google';
    let token = await AsyncStorage.getItem('token');
    console.log(token);
    if (token) token = `Bearer ${JSON.parse(token)}`;
    try {
        let response = await fetch(
            `${commonService.rootUrl}/mobile-app/${platform}/restore`,
            {
                method: 'POST',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    Platform.OS === 'ios'
                        ? {receipt: purchases[0].transactionReceipt}
                        : {purchases},
                ),
            },
        );
        return await response.json();
    } catch (error) {
        console.log(error);
        return new Error(error);
    }
}

export async function validateSignUp(purchases) {
    let platform = Platform.OS === 'ios' ? 'apple' : 'google';
    console.log(purchases);
    try {
        let response = await fetch(
            `${commonService.rootUrl}/mobile-app/${platform}/signup`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    Platform.OS === 'ios'
                        ? {receipt: purchases[0].transactionReceipt}
                        : {purchases},
                ),
            },
        );
        return await response.json();
    } catch (error) {
        console.log(error);
        return new Error(error);
    }
}
