import { expect } from 'chai';
import { given } from '../steps/given';
import { when } from '../steps/when';
import { init } from '../steps/init';
import { join } from 'path';

describe('When we invoke the GET /posts/{userId} endpoint', async () => {
  /*
   * An authentiated user is only required to create multiple posts - the result of which is parsed
   * and used to retrieve from DB for the purpose of this test.
   */
  let user, createPostsRes;

  before(async () => {
    // get env variables
    await init();
    // returns a userId and token
    user = await given.anAuthenticatedUser();
    createPostsRes = await given.multipleBlogPosts(user);
  });

  it('Should return an array of posts', async () => {
    const getPostsRes = await when.weInvokeGetPosts(createPostsRes[0].userId);

    expect(getPostsRes.statusCode).to.equal(200);

    const parsedPostsRes = JSON.parse(getPostsRes.body);
    expect(parsedPostsRes).to.have.length.greaterThan(1);

    for (const post of parsedPostsRes) {
      expect(post).to.have.property('title');
      expect(post).to.have.property('content');
    }
  });
});
