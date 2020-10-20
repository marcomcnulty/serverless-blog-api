import { expect } from 'chai';
import { given } from '../steps/given';
import { when } from '../steps/when';
import { init } from '../steps/init';

describe('Given an authenticated user', async () => {
  // user must be authenticated to update a post
  let user, createPostRes, parsedCreateData;

  before(async () => {
    // get env variables
    await init();
    // returns a userId and token
    user = await given.anAuthenticatedUser();
    createPostRes = await given.aBlogPost(user);
    parsedCreateData = JSON.parse(createPostRes.body);
  });

  describe('When we invoke the PUT /posts/{userId}/{postId} endpoint', async () => {
    it('Should Update a Post', async () => {
      const { postId } = parsedCreateData;
      const res = await when.weInvokeUpdatePost({ ...user }, postId, {
        title: 'Updated Test Title',
        content: 'Updated content of the blog post',
      });

      expect(res.statusCode).to.equal(200);

      const parsedUpdateData = JSON.parse(res.body);
      expect(parsedUpdateData.title).to.equal('Updated Test Title');
      expect(parsedUpdateData.content).to.equal(
        'Updated content of the blog post'
      );
    });
  });
});
