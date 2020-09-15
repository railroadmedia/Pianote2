import commonService from './common.service';
import {Platform} from 'react-native';

const rootUrl = 'http://app-staging.pianote.com';

export async function likeContent(contentID) {
    try {
        return commonService.tryCall(
            `${rootUrl}/api/railcontent/content-like?content_id=${contentID}`,
            'PUT',
        );
    } catch (error) {
        console.log('ERROR LIKING CONTENT: ', error);
        return new Error(error);
    }
}

export async function unlikeContent(contentID) {
    try {
        return commonService.tryCall(
            `${rootUrl}/api/railcontent/content-like?content_id=${contentID}`,
            'DELETE',
        );
    } catch (error) {
        console.log('ERROR DISLIKING CONTENT: ', error);
        return new Error(error);
    }
}

export async function addToMyList(contentID) {
    return commonService.tryCall(
        `${rootUrl}/api/railcontent/add-to-my-list?content_id=${contentID}`,
        'PUT',
    );
}

export async function removeFromMyList(contentID) {
    return commonService.tryCall(
        `${rootUrl}/api/railcontent/remove-from-my-list?content_id=${contentID}`,
        'PUT',
    );
}

export async function markComplete(contentID) {
    console.log(
        `${rootUrl}/api/complete?content_id=${contentID}&device_type=${
            Platform.OS === 'ios' ? 'ios' : 'android'
        }`,
    );
    try {
        return commonService.tryCall(
            `${rootUrl}/api/complete?content_id=${contentID}&device_type=${
                Platform.OS === 'ios' ? 'ios' : 'android'
            }`,
            'PUT',
        );
    } catch (error) {
        console.log('ERROR MARKING AS COMPLETE: ', error);
        return new Error(error);
    }
}

export async function updateUsersVideoProgress(id, seconds, lengthInSeconds) {
    try {
        let response = await commonService.tryCall(
            `${rootUrl}/api/media/${id}?seconds_played=${seconds}&current_second=${seconds}&length_in_seconds=${lengthInSeconds}`,
            'PUT',
        );
        console.log('UPDATE VIDEO PROGRESS: ', response);
    } catch (error) {
        console.log('ERROR UPDATING PROGRESS: ', error);
        return new Error(error);
    }
}

export async function logout() {
    return this.tryCall(`${rootUrl}/laravel/public/api/logout`, 'PUT');
}

export async function updateUserDetails(picture, name, phoneNr, firebaseToken) {
    let reqUrl = `${authService.rootUrl}/api/profile/update?`;
    if (picture) reqUrl += `file=${picture}`;
    if (name) reqUrl += `display_name=${name}`;
    if (phoneNr) reqUrl += `phone_number=${phoneNr}`;
    if (firebaseToken)
        reqUrl += `firebase_token_${
            commonService.isiOS ? 'ios' : 'android'
        }=${firebaseToken}`;
    return commonService.tryCall(reqUrl, 'POST');
}
