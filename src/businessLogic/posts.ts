import * as uuid from 'uuid';
import { iCreatePostRequest } from '../types/requestTypes/iCreatePostRequest';
import { iPost } from '../types/iPost';
import { getUserId } from '../utils';
import { PostsAccess } from '../dataLayer/postsAccess';

const postsAccess = new PostsAccess();

export const createPost = async (
  createPostRequest: iCreatePostRequest,
  headers: any
): Promise<iPost> => {
  const postId: string = uuid.v4();
  const userId: string = getUserId(headers.Authorization);

  return await postsAccess.createPost({
    userId,
    postId,
    title: createPostRequest.title,
    content: createPostRequest.content,
    coverUrl: createPostRequest.coverUrl,
    createdAt: new Date().toISOString(),
  });
};
