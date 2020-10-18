import { expect } from 'chai';
import { given } from '../steps/given';
import { when } from '../steps/when';
import { init } from '../steps/init';

describe('Given an authenticated user', async () => {
  let user;

  before(async () => {
    // get env variables
    await init();
    // returns a userId and token
    user = await given.anAuthenticatedUser();
  });

  describe('When we invoke the GET /posts/{userId}/{postId} endpoint', async () => {
    it('Should return a post', async () => {
      const createPostRes = await when.weInvokeCreatePost(user, {
        title: 'Test Title',
        content: 'This is the content of the blog post',
      });

      const data = JSON.parse(createPostRes.body);

      const getPostRes = await when.weInvokeGetPost(
        data.userId,
        data.postId,
        user.token
      );

      expect(getPostRes.statusCode).to.equal(200);
      expect(getPostRes.body).to.not.be.null;
    });
  });
});
