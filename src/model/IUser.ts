export default interface IUser {
  id: number;
  email: string;
  display_name: string;
  profile_picture_url: string;
  totalXp: string;
  xpRank: string;
  isMember: boolean;
  membershipExpirationDate: string | null;
  isLifetime: boolean;
  isPackOlyOwner: boolean;
  isAppleAppSubscriber: boolean;
  isGoogleAppSubscriber: boolean;
  notify_on_forum_followed_thread_reply: boolean;
  notify_on_forum_post_like: boolean;
  notify_on_lesson_comment_like: boolean;
  notify_on_lesson_comment_reply: boolean;
  notify_on_forum_post_reply: boolean;
  notifications_summary_frequency_minutes: string | null;
  notify_weekly_update: boolean;
  created_at: string;
}
