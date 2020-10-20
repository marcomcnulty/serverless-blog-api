import { expect } from 'chai';
import { given } from '../steps/given';
import { when } from '../steps/when';
import { init } from '../steps/init';

describe('When we invoke the DELETE /posts/{userId}/{postId} endpoint', async () => {
  /*
   * An authentiated user is only required to create a post - the result of which is parsed
   * and used to retrieve data for deleting a post from the DB for this test.
   */
  let user, createPostRes, parsedCreateData;

  before(async () => {
    // get env variables
    await init();
    // returns a userId and token
    user = await given.anAuthenticatedUser();
    createPostRes = await given.aBlogPost(user);
    parsedCreateData = JSON.parse(createPostRes.body);
  });

  it('Should delete a post', async () => {
    const userId = parsedCreateData.userId;
    const token = user.token;

    const deletePostRes = await when.weInvokeDeletePost(
      { userId, token },
      parsedCreateData.postId
    );

    expect(deletePostRes.statusCode).to.equal(200);

    const parsedDeleteData = JSON.parse(deletePostRes.body);
    expect(parsedDeleteData.status).equal(true);
  });
});
