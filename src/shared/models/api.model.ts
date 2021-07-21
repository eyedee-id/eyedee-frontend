export interface ApiModel<T> {
  status: boolean;
  data: T;

  message?: string;
}
