let isInitialised = false;

export const init = async () => {
  if (isInitialised) {
    return;
  }

  process.env.AWS_REGION = 'eu-west-2';
  process.env.POSTS_TABLE = 'dev-posts';

  isInitialised = true;
};
