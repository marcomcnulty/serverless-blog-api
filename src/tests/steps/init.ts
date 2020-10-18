let isInitialised = false;

export const init = async () => {
  if (isInitialised) {
    return;
  }

  process.env.AWS_REGION = 'eu-west-2';
  process.env.POSTS_TABLE = 'dev-posts';
  process.env.TEST_POST_ID = 'c7e54d9d-718a-4c07-9ff2-e3ee5a6dfbd4';

  isInitialised = true;
};
