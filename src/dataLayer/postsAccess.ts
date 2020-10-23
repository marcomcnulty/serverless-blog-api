import dynamoDb from '../libs/dynamodb_lib';
import * as AWS from 'aws-sdk';
import { iPost } from './../types/iPost';
import { iCreatePostRequest } from '../types/requestTypes/iCreatePostRequest';
import { iUpdatePostRequest } from '../types/requestTypes/iUpdatePostRequest';

export class PostsAccess {
  constructor(
    private readonly postsTable = process.env.POSTS_TABLE,
    private readonly bucketName = process.env.FILES_S3_BUCKET
  ) {}

  // don't need to return db item just postReq properties for tests
  async createPost(post: iCreatePostRequest): Promise<iPost> {
    const params = {
      TableName: this.postsTable,
      Item: post,
    };

    await dynamoDb.put(params);

    return params.Item as iPost;
  }

  async getPost({ userId, postId }): Promise<iPost> {
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

  async isAuthorized(userId, postId): Promise<boolean> {
    const params = {
      TableName: this.postsTable,
      Key: {
        userId,
        postId,
      },
    };

    const res = await dynamoDb.get(params);

    return !!res.Item;
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

  async deletePost({ userId, postId }): Promise<any> {
    const params = {
      TableName: this.postsTable,
      Key: {
        userId,
        postId,
      },
    };

    await dynamoDb.delete(params);

    return { status: true };
  }

  async generateUploadUrl(postId: string): Promise<string> {
    const s3 = new AWS.S3({
      signatureVersion: 'v4',
    });

    return s3.getSignedUrl('putObject', {
      Bucket: process.env.FILES_S3_BUCKET,
      Key: postId,
      Expires: parseInt(process.env.SIGNED_URL_EXPIRATION),
    });
  }

  async setCoverUrl(postId: string, userId: string): Promise<boolean> {
    const coverUrl: string = `https://${this.bucketName}.s3.amazonaws.com/${postId}`;

    await dynamoDb.update({
      TableName: this.postsTable,
      Key: {
        postId,
        userId,
      },
      UpdateExpression: 'set #coverUrl = :coverUrl',
      ExpressionAttributeNames: {
        '#coverUrl': 'coverUrl',
      },
      ExpressionAttributeValues: {
        ':coverUrl': coverUrl,
      },
    });

    return true;
  }
}
