export interface ConfideModel {
  user_id: string;
  at_created: number;
  confide_id: string;

  name_?: string;
  username?: string;
  avatar_url?: string;
  total_comment?: number;
  text: string;
  hashtags?: Array<string>;
  at_created_string: string;
}
