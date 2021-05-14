import commonService from './common.service';

export function likeContent(id) {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/railcontent/content-like?content_id=${id}`,
    'PUT'
  );
}
export function unlikeContent(id) {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/railcontent/content-like?content_id=${id}`,
    'DELETE'
  );
}
export function addToMyList(id) {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/railcontent/add-to-my-list?content_id=${id}`,
    'PUT'
  );
}
export function removeFromMyList(id) {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/railcontent/remove-from-my-list?content_id=${id}`,
    'PUT'
  );
}
export function getDownloadableContent(id) {
  return commonService.tryCall(
    `${commonService.rootUrl}/musora-api/content/${id}?download=true`
  );
}
