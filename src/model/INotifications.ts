import IComment from './IComment';

interface INotificationUser {
  id: number;
  email: string;
  display_name: string;
  profile_image_url: string;
}

export enum NotificationTypes {
  comment_reply = 'lesson comment reply',
  comment_like = 'lesson comment liked',
  forum_post_liked = 'forum post liked',
  forum_post_reply = 'forum post reply',
  forum_post_in_followed_thread = 'forum post in followed thread'
}

export default interface INotification {
  id: number;
  type: NotificationTypes;
  data: {
    commentId?: number;
    postId?: number;
    threadId?: number;
  };
  created_at: string;
  comment: IComment;
  recipient: INotificationUser;
  sender: INotificationUser;
  content: {
    id: number;
    title: string;
    url: string;
    mobile_app_url: string;
    musora_api_mobile_app_url: string;
    display_name: string;
    thumbnail_url: string;
  };
  thread?: { title: string };
}
