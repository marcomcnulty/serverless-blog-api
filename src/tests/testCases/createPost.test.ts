import { expect } from 'chai';
import { given } from '../steps/given';
import { when } from '../steps/when';
import { init } from '../steps/init';

describe('Given an authenticated user', async () => {
  // user must be authenticated to create a post
  let user;

  before(async () => {
    // get env variables
    await init();
    // returns a userId and token
    user = await given.anAuthenticatedUser();
  });

  describe('When we invoke the POST /posts endpoint', async () => {
    it('Should Create a Post', async () => {
      const res = await when.weInvokeCreatePost(
        { ...user },
        {
          title: 'Test Title',
          content: 'This is the content of the blog post',
        }
      );

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.not.be.null;
    });
  });
});
