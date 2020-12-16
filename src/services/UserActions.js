import commonService from './common.service';
import { Platform } from 'react-native';

export async function likeContent(contentID) {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/railcontent/content-like?content_id=${contentID}`,
    'PUT'
  );
}

export async function unlikeContent(contentID) {
  try {
    return commonService.tryCall(
      `${commonService.rootUrl}/api/railcontent/content-like?content_id=${contentID}`,
      'DELETE'
    );
  } catch (error) {
    console.log('ERROR DISLIKING CONTENT: ', error);
    return new Error(error);
  }
}

export async function addToMyList(contentID) {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/railcontent/add-to-my-list?content_id=${contentID}`,
    'PUT'
  );
}

export async function removeFromMyList(contentID) {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/railcontent/remove-from-my-list?content_id=${contentID}`,
    'PUT'
  );
}

export async function resetProgress(contentID) {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/reset?content_id=${contentID}`,
    'PUT'
  );
}

export async function markComplete(contentID) {
  try {
    return commonService.tryCall(
      `${
        commonService.rootUrl
      }/api/complete?content_id=${contentID}&device_type=${
        Platform.OS === 'ios' ? 'ios' : 'android'
      }`,
      'PUT'
    );
  } catch (error) {
    console.log('ERROR MARKING AS COMPLETE: ', error);
    return new Error(error);
  }
}

export async function markStarted(contentID) {
  try {
    return commonService.tryCall(
      `${
        commonService.rootUrl
      }/api/railcontent/start?content_id=${contentID}&device_type=${
        Platform.OS === 'ios' ? 'ios' : 'android'
      }`,
      'PUT'
    );
  } catch (error) {
    console.log('ERROR MARKING AS STARTED: ', error);
    return new Error(error);
  }
}

export async function logout() {
  return this.tryCall(
    `${commonService.rootUrl}/laravel/public/api/logout`,
    'PUT'
  );
}

export async function updateUserDetails(picture, name, phoneNr, firebaseToken) {
  let reqUrl = `${commonService.rootUrl}/api/profile/update?`;
  if (picture) reqUrl += `file=${picture}`;
  if (name) reqUrl += `display_name=${name}`;
  if (phoneNr) reqUrl += `phone_number=${phoneNr}`;
  if (firebaseToken)
    reqUrl += `firebase_token_${
      Platform.OS === 'ios' ? 'ios' : 'android'
    }=${firebaseToken}`;
  return commonService.tryCall(reqUrl, 'POST');
}

export async function getMediaSessionId(
  id,
  content_id,
  length_in_seconds,
  media_category
) {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/media?media_category=${media_category}&media_id=${id}&content_id=${content_id}&media_length_seconds=${length_in_seconds}&media_type=video`,
    'PUT'
  );
}
export async function updateUsersVideoProgress(id, seconds, lengthInSeconds) {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/media/${id}?seconds_played=${seconds}&current_second=${seconds}&length_in_seconds=${lengthInSeconds}`,
    'PUT'
  );
}
