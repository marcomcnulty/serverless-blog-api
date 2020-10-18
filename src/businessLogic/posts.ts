// import { getUserId } from './../utils';
import * as uuid from 'uuid';
import { iCreatePostRequest } from '../types/requestTypes/iCreatePostRequest';
import { iGetPostRequest } from '../types/requestTypes/iGetPostRequest';
import { iPost } from '../types/iPost';
import { PostsAccess } from '../dataLayer/postsAccess';

const postsAccess = new PostsAccess();

export const createPost = async (
  createPostRequest: iCreatePostRequest,
  userId: string
): Promise<iPost> => {
  const postId: string = uuid.v4();
  // const userId: string = getUserId(auth);

  return await postsAccess.createPost({
    userId,
    postId,
    title: createPostRequest.title,
    content: createPostRequest.content,
    coverUrl: createPostRequest.coverUrl,
    createdAt: new Date().toISOString(),
  });
};

export const getPost = async (
  getPostRequest: iGetPostRequest
): Promise<iPost> => {
  return await postsAccess.getPost(
    getPostRequest.postId,
    getPostRequest.userId
  );
};
