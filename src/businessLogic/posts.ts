import * as uuid from 'uuid';
import { iCreatePostRequest } from '../types/requestTypes/iCreatePostRequest';
import { iUpdatePostRequest } from '../types/requestTypes/iUpdatePostRequest';
import { iGetPostRequest } from '../types/requestTypes/iGetPostRequest';
import { iPost } from '../types/iPost';
import { PostsAccess } from '../dataLayer/postsAccess';

const postsAccess = new PostsAccess();

export const createPost = async (
  createPostRequest: iCreatePostRequest
): Promise<iPost> => {
  const postId: string = uuid.v4();

  return await postsAccess.createPost({
    postId,
    ...createPostRequest,
    createdAt: new Date().toISOString(),
  });
};

export const getPost = async (
  getPostRequest: iGetPostRequest
): Promise<iPost> => {
  return await postsAccess.getPost({ ...getPostRequest });
};

export const getPosts = async (userId: string): Promise<iPost[]> => {
  return await postsAccess.getPosts(userId);
};

export const updatePost = async (
  updatePostRequest: iUpdatePostRequest
): Promise<iPost> => {
  const res = await postsAccess.updatePost(updatePostRequest);

  return res;
};

// TODO: type for deletePostRequest... how to merge GetPostRequest??
export const deletePost = async (deletePostRequest): Promise<boolean> => {
  return await postsAccess.deletePost({ ...deletePostRequest });
};

export async function generateUploadUrl(postId: string): Promise<string> {
  return await postsAccess.generateUploadUrl(postId);
}

export async function setCoverUrl(
  userId: string,
  postId: string
): Promise<boolean> {
  return await postsAccess.setCoverUrl(postId, userId);
}
