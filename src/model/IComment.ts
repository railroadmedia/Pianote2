import IUser from './IUser';

interface LikeUser {
  id: number;
  display_name: string;
  avatar_url: string;
}

export default interface IComment {
  id: number;
  comment: string;
  content_id: number;
  user_id: number;
  display_name: string;
  created_on: string;
  replies: IComment[];
  like_count: number;
  like_users: LikeUser[];
  is_liked: boolean;
  user: IUser;
}
