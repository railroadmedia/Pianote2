import {getToken} from 'Pianote2/src/services/UserDataAuth.js';
import commonService from './common.service';
import {Platform} from 'react-native';

const rootUrl = 'http://app-staging.pianote.com/api';

export async function likeContent(contentID) {
    try {
        const auth = await getToken();
        let response = await fetch(
            `${rootUrl}/api/railcontent/content-like?content_id=${contentID}`,
            {
                method: 'PUT',
                headers: {Authorization: `Bearer ${auth.token}`},
            },
        );

        return await response.json();
    } catch (error) {
        console.log('ERROR LIKING CONTENT: ', error);
        return new Error(error);
    }
}

export async function unlikeContent(contentID) {
    try {
        const auth = await getToken();
        console.log(auth.token, 'LIKE AUTH');
        let response = await fetch(
            `${rootUrl}/railcontent/content-like?content_id=${contentID}`,
            {
                method: 'DELETE',
                headers: {Authorization: `Bearer ${auth.token}`},
            },
        );

        return await response.json();
    } catch (error) {
        console.log('ERROR DISLIKING CONTENT: ', error);
        return new Error(error);
    }
}

export async function addToMyList(contentID) {
    return commonService.tryCall(
        `${rootUrl}/railcontent/add-to-my-list?content_id=${contentID}`,
        'PUT',
    );
}

export async function removeFromMyList(contentID) {
    return commonService.tryCall(
        `${rootUrl}/railcontent/add-to-my-list?content_id=${contentID}`,
        'PUT',
    );
}

export async function resetProgress(contentID) {
    return commonService.tryCall(
        `${rootUrl}/railcontent/reset?content_id=${contentID}`,
        'PUT',
    );
}

export async function markAsComplete(contentID) {
    return commonService.tryCall(
        `${rootUrl}/complete?content_id=${contentID}&device_type=${
            Platform.OS === 'ios' ? 'ios' : 'android'
        }`,
        'PUT',
    );
}

export async function updateUsersVideoProgress(contentID, progress) {
    return commonService.tryCall(
        `${rootUrl}/railcontent/video/progress?content_id=${contentID}&progress=${progress}`,
        'PUT',
    );
}

export async function getUserDetails() {
    return this.tryCall(`${auth.rootUrl}/laravel/public/api/me`);
}

export async function logout() {
    return this.tryCall(`${auth.rootUrl}/laravel/public/api/logout`, 'PUT');
}

export async function myList(filters, page, limit) {
    let reqUrl = `${auth.rootUrl}/my-list?limit=${limit}&page=${page}&brand=drumeo`;
    if (filters && !filters.contentType.selected.includes('All')) {
        reqUrl = `${
            auth.rootUrl
        }/my-list?included_types[]=${filters.contentType.selected.toLowerCase()}&brand=drumeo`;
    }
    if (filters && !filters.difficulty.selected.includes('All')) {
        reqUrl += `&required_fields[]=difficulty,${filters.difficulty.selected}`;
    }
    return this.tryCall(reqUrl);
}

export async function inProgressFromMyList(filters) {
    let reqUrl = `${auth.rootUrl}/railcontent/content?included_types[]=course&included_types[]=song&included_types[]=play-along&included_types[]=shows&statuses[]=published&statuses[]=scheduled&required_user_states[]=started&sort=-published_on&brand=drumeo`;
    if (filters && !filters.contentType.selected.includes('All')) {
        reqUrl = `${
            auth.rootUrl
        }/railcontent/content?included_types[]=${filters.contentType.selected
            .toLowerCase()
            .replace(
                ' ',
                '-',
            )}&statuses[]=published&statuses[]=scheduled&required_user_states[]=started&sort=-published_on&brand=drumeo`;
    }
    if (filters && !filters.difficulty.selected.includes('All')) {
        reqUrl += `&required_fields[]=difficulty,${filters.difficulty.selected}`;
    }
    return this.tryCall(reqUrl);
}

export async function completedFromMyList(filters) {
    let reqUrl = `${auth.rootUrl}/railcontent/content?included_types[]=course&included_types[]=song&included_types[]=play-along&included_types[]=shows&statuses[]=published&statuses[]=scheduled&required_user_states[]=completed&sort=-published_on&brand=drumeo`;
    if (filters && !filters.contentType.selected.includes('All')) {
        reqUrl = `${
            auth.rootUrl
        }/railcontent/content?included_types[]=${filters.contentType.selected
            .toLowerCase()
            .replace(
                ' ',
                '-',
            )}&statuses[]=published&statuses[]=scheduled&required_user_states[]=completed&sort=-published_on&brand=drumeo`;
    }
    if (filters && !filters.difficulty.selected.includes('All')) {
        reqUrl += `&required_fields[]=difficulty,${filters.difficulty.selected}`;
    }
    return this.tryCall(reqUrl);
}
