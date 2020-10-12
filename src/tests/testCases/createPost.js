import * as uuid from 'uuid';
import { expect } from 'chai';
import { anAuthenticatedUser } from '../steps/given';
import { when } from '../steps/when';

describe('Given an authenticated user', async () => {
  let user;

  before(async () => {
    // await init();
    user = await anAuthenticatedUser();
  });

  after(async () => {
    // await tearDown.anAuthenticatedUser(user);
  });

  describe('When we invoke the POST /posts endpoint', async () => {
    it('Should return the created post', async () => {
      const res = await when.weinvokeCreatePost(user, {
        postId: uuid.v4(),
        title: 'Test Title',
        content: 'This is the content of the blog post',
      });

      expect(res.statusCode).to.equal(201);
    });
  });
});
