export interface iCreatePostRequest {
  postId?: string;
  userId: string;
  title: string;
  content: string;
  coverUrl?: string;
  createdAt?: string;
}
