import IComment from './IComment';

export interface INotificationUser {
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

export interface INotificationDisplayData {
  message: string;
  new: boolean;
  color: 'orange' | 'blue';
  type: string;
  field:
    | 'notify_on_lesson_comment_reply'
    | 'notify_on_lesson_comment_like'
    | 'notify_on_forum_post_like'
    | 'notify_on_forum_post_reply'
    | 'notify_on_forum_followed_thread_reply';
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
