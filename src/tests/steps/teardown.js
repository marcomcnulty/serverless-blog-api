const anAuthenticatedUser = async user => {
  let req = {
    // UserPoolId: process.env.cognito_user_pool_id,
    username: user.username,
  };

  // await cognito.adminDeleteUser(req).promise();

  console.log(`[${user.username}] - user deleted`);
};

module.exports = {
  anAuthenticatedUser
};
