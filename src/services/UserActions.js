import commonService from './common.service';

export async function likeContent(contentID) {
  return await commonService.tryCall({
    url: `${commonService.rootUrl}/api/railcontent/content-like?content_id=${contentID}`,
    method: 'PUT'
  });
}

export async function unlikeContent(contentID) {
  return await commonService.tryCall({
    url: `${commonService.rootUrl}/api/railcontent/content-like?content_id=${contentID}`,
    method: 'DELETE'
  });
}

export async function addToMyList(contentID) {
  return commonService.tryCall({
    url: `${commonService.rootUrl}/api/railcontent/add-to-my-list?content_id=${contentID}`,
    method: 'PUT'
  });
}

export async function removeFromMyList(contentID) {
  return commonService.tryCall({
    url: `${commonService.rootUrl}/api/railcontent/remove-from-my-list?content_id=${contentID}`,
    method: 'PUT'
  });
}

export async function resetProgress(contentID) {
  return commonService.tryCall({
    url: `${commonService.rootUrl}/musora-api/reset?content_id=${contentID}`,
    method: 'PUT'
  });
}

export async function markComplete(contentID) {
  return commonService.tryCall({
    url: `${
      commonService.rootUrl
    }/musora-api/complete?content_id=${contentID}&device_type=${
      isiOS ? 'ios' : 'android'
    }`,
    method: 'PUT'
  });
}

export async function updateUserDetails(picture, name, phoneNr, firebaseToken) {
  let url = `${commonService.rootUrl}/musora-api/profile/update?`;
  if (picture) url += `file=${picture}`;
  if (name) url += `display_name=${name}`;
  if (phoneNr) url += `phone_number=${phoneNr}`;
  if (firebaseToken)
    url += `firebase_token_${isiOS ? 'ios' : 'android'}=${firebaseToken}`;
  return commonService.tryCall({ url, method: 'POST' });
}

export async function getMediaSessionId(
  id,
  content_id,
  length_in_seconds,
  media_category
) {
  return commonService.tryCall({
    url: `${commonService.rootUrl}/musora-api/media?media_category=${media_category}&media_id=${id}&content_id=${content_id}&media_length_seconds=${length_in_seconds}&media_type=video`,
    method: 'PUT'
  });
}

export async function updateUsersVideoProgress(id, seconds, lengthInSeconds) {
  return commonService.tryCall({
    url: `${commonService.rootUrl}/musora-api/media/${id}?seconds_played=${seconds}&current_second=${seconds}&length_in_seconds=${lengthInSeconds}`,
    method: 'PUT'
  });
}

export function removeAllMessages(userId) {
  return commonService.tryCall({
    url: `${commonService.rootUrl}/api/chat/delete-user-messages?user_id=${userId}`,
    method: 'POST'
  });
}

export function toggleBlockStudent(user) {
  return commonService.tryCall({
    url: `${commonService.rootUrl}/api/chat/${
      user.banned ? 'unban-user' : 'ban-user'
    }?user_id=${user.id}`,
    method: 'POST'
  });
}
