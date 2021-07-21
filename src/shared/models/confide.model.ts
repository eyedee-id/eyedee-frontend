export interface ConfideModel {
  user_id: string;
  at_created: number;
  confide_id: string;

  name?: string;
  username?: string;
  photo_url?: string;
  total_comment?: number;
  text: string;
  hashtags?: Array<string>;
  at_created_string: string;
}
