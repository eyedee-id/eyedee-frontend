export interface ApiModel<T> {
  status: boolean;
  data: T;
  meta?: {
    limit?: number,
  };

  message?: string;
}
