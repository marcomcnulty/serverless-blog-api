import * as uuid from 'uuid';
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

  describe('When we invoke the POST /posts endpoint', async () => {
    it('Should return 201 status', async () => {
      const res = await when.weInvokeCreatePost(user, {
        postId: uuid.v4(),
        title: 'Test Title',
        content: 'This is the content of the blog post',
      });

      expect(res.statusCode).to.equal(201);
    });
  });
});
