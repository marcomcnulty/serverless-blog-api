import dynamoDb from '../libs/dynamodb_lib';
import { iPost } from './../types/iPost';
import { iCreatePostRequest } from '../types/requestTypes/iCreatePostRequest';
import { iUpdatePostRequest } from '../types/requestTypes/iUpdatePostRequest';

export class PostsAccess {
  constructor(private readonly postsTable = process.env.POSTS_TABLE) {}

  // don't need to return db item just postReq properties for testing
  async createPost(post: iCreatePostRequest): Promise<iPost> {
    const params = {
      TableName: this.postsTable,
      Item: post,
      ReturnValues: 'ALL_NEW',
    };

    await dynamoDb.put(params);

    return params.Item as iPost;
  }

  async getPost(postId: string, userId: string): Promise<iPost> {
    const params = {
      TableName: this.postsTable,
      Key: {
        userId,
        postId,
      },
    };

    const res = await dynamoDb.get(params);

    return res.Item as iPost;
  }

  async getPosts(userId: string): Promise<iPost[]> {
    const params = {
      TableName: this.postsTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };

    const res = await dynamoDb.query(params);

    return res.Items as iPost[];
  }

  async updatePost(post: iUpdatePostRequest): Promise<iPost> {
    const params = {
      TableName: this.postsTable,
      Key: {
        userId: post.userId,
        postId: post.postId,
      },
      UpdateExpression:
        'SET title = :title, content = :content, coverUrl = :coverUrl',
      ExpressionAttributeValues: {
        ':title': post.title || null,
        ':content': post.content || null,
        ':coverUrl': post.coverUrl || null,
      },
      ReturnValues: 'ALL_NEW',
    };

    const res = await dynamoDb.update(params);

    return res.Attributes as iPost;
  }
}
