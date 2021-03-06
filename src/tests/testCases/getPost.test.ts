import { expect } from 'chai';
import { given } from '../steps/given';
import { when } from '../steps/when';
import { init } from '../steps/init';

describe('When we invoke the GET /posts/{userId}/{postId} endpoint', async () => {
  /*
   * An authentiated user is only required to create a post - the result of which is parsed
   * and used to retrieve from DB for the purpose of this test.
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

  it('Should return a post', async () => {
    const getPostRes = await when.weInvokeGetPost(
      parsedCreateData.userId,
      parsedCreateData.postId
    );
    expect(getPostRes.statusCode).to.equal(200);

    const parsedPostData = JSON.parse(getPostRes.body);
    expect(parsedPostData.title).to.equal('Test Title');
  });
});
