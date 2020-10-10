const { expect } = require('chai');
const when = require('../steps/when');
const given = require('../steps/given');
const uuid = require('uuid');

describe('Given an authenticated user', async () => {
  let user;

  before(async () => {
    // await init();
    user = await given.anAuthenticatedUser();
  });

  after(async () => {
    await tearDown.anAuthenticatedUser(user);
  });

  describe('When we invoke the POST /posts endpoint', async () => {
    it(`Should return the created post`, async () => {
      const res = await when.weInvokeCreatePost(user, {
        postId: uuid.v4(),
        title: 'Test Title',
        content: 'This is the content of the blog post',
      });

      expect(res.statusCode).to.equal(200);
      // expect(res.body).to.have.lengthOf(4);
    });
  });
});
