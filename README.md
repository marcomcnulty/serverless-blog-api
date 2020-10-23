# Udacity Capstone

This is a serverless backend api deployed with Serverless framework to AWS. It is the first step towards a Serverless blogging application. Currently, all the backend MVP functionality for blog posts has been implemented.

This can be tested with the included Postman collection.

The resources deployed with this service consist of:

- API Gateway
- AWS Lambda Functions:
  - Full CRUD operations
  - Custom Authorizer with Auth0
  - Signed URL generator for uploading files directly to S3

- DynamoDB tables for posts and user profiles (not currently implemented)

- S3 bucket for cover images belonging to each post

### What does it do?

Once the frontend is implemented, a user arriving at the home page will see profile pictures of other users who have already signed up with a short snippet of the blurb from their profile page introducing themselves.

Clicking on one of these users, will take you to that user's profile, where you see the full "about me" blurb as well as a list of their posts (thumbail version of the uploaded cover image and short snippet of text).

Clicking on any of these will bring you to the full post.

This means that a user does not need to authenticate in order to call the following functions: "GetPosts", "GetPost" - only to create, update or delete their own profiles/posts.

Once a user logs in via Auth0, they will be able to create their own profile, as well as create, update, delete their own posts.

### Auth and Routing

The routes currently implemented are:

- Create - POST - /posts
- Read (many) - GET - /posts/{userId}
- Read (single) - GET - /posts/{userId}/{postId}
- Update - PUT - /posts/{userId}/{postId}
- Delete - DELETE - /posts/{userId}/{postId}
- SignedUrl - POST - /posts/{userId}/{postId}/attachment

Calling a protected route (Create, Update, Delete, SignedUrl) will result in the custom authorizer handler being called first that checks for the expected authorization token. Additionally, the Create, Update, Delete functions take the userId from the API Gateway requestContext object rather than the path parameters and this is checked before DB operations to ensure a user is authorized to perform the requested action.

### What else?

An example of a request validator is included (for Create Post) that shows how requests can be screened by API Gateway and accepted or denied depending on whether they satisfy the JSON schema. This can save costs by preventing unnecessary Lambda calls.

The Ports and Adapters pattern has been followed, where the database and business logic layer are self-contained to make the app more portable and resistant to vendor lock-in.

The src/tests directory holds an _events_ directory for local testing with the serverless-offline-plugin, as well as _testCases_, and _steps_ directories that contain acceptance and integration tests (Mocha and Chai) for the main CRUD operations. AWSXRay tracing and logging with Winston has been enabled for a better debugging experience also.
