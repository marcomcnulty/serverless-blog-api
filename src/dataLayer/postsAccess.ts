import { iPost } from './../types/iPost';
import dynamoDb from '../libs/dynamodb_lib';

export class PostsAccess {
  constructor(private readonly postsTable = process.env.POSTS_TABLE) {}

  async createPost(post: iPost): Promise<iPost> {
    const params = {
      TableName: this.postsTable,
      Item: post,
    };

    await dynamoDb.put(params);

    return params.Item;
  }

  async getPost(postId: string, userId: string): Promise<any> {
    const params = {
      TableName: this.postsTable,
      Key: {
        userId,
        postId,
      },
    };

    const res = await dynamoDb.get(params);

    return res.Item;
  }
}
