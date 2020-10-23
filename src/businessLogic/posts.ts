import * as uuid from 'uuid';
import { iCreatePostRequest } from '../types/requestTypes/iCreatePostRequest';
import { iUpdatePostRequest } from '../types/requestTypes/iUpdatePostRequest';
import { iGetPostRequest } from '../types/requestTypes/iGetPostRequest';
import { iPost } from '../types/iPost';
import { PostsAccess } from '../dataLayer/postsAccess';
import { createLogger } from '../utils';

const logger = createLogger('BusinessLogic');

// instantiate the posts DB layer
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
  const { userId, postId } = updatePostRequest;
  const checkAuth = await isAuthorized(userId, postId);

  if (!checkAuth) {
    logger.error('Failed to update post, no post with matching userId/postId!');
    throw new Error('Invalid request - no post with matching userId/postId');
  }

  return await postsAccess.updatePost(updatePostRequest);
};

// TODO: type for deletePostRequest... how to merge GetPostRequest interface??
export const deletePost = async (deletePostRequest): Promise<boolean> => {
  const { userId, postId } = deletePostRequest;
  const checkAuth = await isAuthorized(userId, postId);

  if (!checkAuth) {
    logger.error('Failed to delete post, no post with matching userId/postId!');
    throw new Error('Invalid request - no post with matching userId/postId');
  }

  return await postsAccess.deletePost({ ...deletePostRequest });
};

// returns an aws signed url for direct upload to S3 bucket
export async function generateUploadUrl(postId: string): Promise<string> {
  return await postsAccess.generateUploadUrl(postId);
}

// updates the post with the image url
export async function setCoverUrl(
  userId: string,
  postId: string
): Promise<boolean> {
  return await postsAccess.setCoverUrl(postId, userId);
}

// checks whether a post with supplied userId/postId exists - prevents a user
// from updating/deleting a post belonging to another user.
export const isAuthorized = async (
  userId: string,
  postId: string
): Promise<boolean> => {
  return await postsAccess.isAuthorized(userId, postId);
};
