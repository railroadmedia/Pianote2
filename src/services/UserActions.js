import AsyncStorage from '@react-native-community/async-storage';
import commonService from './common.service';
import { Platform } from 'react-native';

export async function likeContent(contentID) {
  return await commonService.tryCall(
    `${commonService.rootUrl}/api/railcontent/content-like?content_id=${contentID}`,
    'PUT'
  );
}

export async function unlikeContent(contentID) {
  return await commonService.tryCall(
    `${commonService.rootUrl}/api/railcontent/content-like?content_id=${contentID}`,
    'DELETE'
  );
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
    `${commonService.rootUrl}/musora-api/reset?content_id=${contentID}`,
    'PUT'
  );
}

export async function markComplete(contentID) {
  return commonService.tryCall(
    `${
      commonService.rootUrl
    }/musora-api/complete?content_id=${contentID}&device_type=${
      Platform.OS === 'ios' ? 'ios' : 'android'
    }`,
    'PUT'
  );
}

export async function updateUserDetails(picture, name, phoneNr, firebaseToken) {
  let reqUrl = `${commonService.rootUrl}/musora-api/profile/update?`;
  if (picture) reqUrl += `file=${picture}`;
  if (name) reqUrl += `display_name=${name}`;
  if (phoneNr) reqUrl += `phone_number=${phoneNr}`;
  if (firebaseToken)
    reqUrl += `firebase_token_${isiOS ? 'ios' : 'android'}=${firebaseToken}`;
  return commonService.tryCall(reqUrl, 'POST');
}

export async function getMediaSessionId(
  id,
  content_id,
  length_in_seconds,
  media_category
) {
  return commonService.tryCall(
    `${commonService.rootUrl}/musora-api/media?media_category=${media_category}&media_id=${id}&content_id=${content_id}&media_length_seconds=${length_in_seconds}&media_type=video`,
    'PUT'
  );
}
export async function updateUsersVideoProgress(id, seconds, lengthInSeconds) {
  return commonService.tryCall(
    `${commonService.rootUrl}/musora-api/media/${id}?seconds_played=${seconds}&current_second=${seconds}&length_in_seconds=${lengthInSeconds}`,
    'PUT'
  );
}
export function removeAllMessages(userId) {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/chat/delete-user-messages?user_id=${userId}`,
    'POST'
  );
}
export function toggleBlockStudent(user) {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/chat/${
      user.banned ? 'unban-user' : 'ban-user'
    }?user_id=${user.id}`,
    'POST'
  );
}
