import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../common/dto/create-user.dto';
import { UpdateUserDto } from '../../common/dto/update-user.dto';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private readonly dynamoDb: AWS.DynamoDB.DocumentClient;
  private readonly tableName: string = 'Users';

  constructor() {
    this.dynamoDb = new AWS.DynamoDB.DocumentClient({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async create(createUserDto: CreateUserDto) {
    const userId = uuidv4();
    const newUser = {
      id: userId,
      ...createUserDto,
      createdAt: new Date().toISOString(),
    };

    const params = {
      TableName: this.tableName,
      Item: newUser,
    };

    try {
      await this.dynamoDb.put(params).promise();
      return { id: userId, ...newUser };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Could not create user');
    }
  }

  async findOne(id: string) {
    const params = {
      TableName: this.tableName,
      Key: {
        id,
      },
    };

    try {
      const result = await this.dynamoDb.get(params).promise();
      if (!result.Item) {
        throw new Error('User not found');
      }
      return result.Item;
    } catch (error) {
      console.error('Error finding user:', error);
      throw new Error('Could not find user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateExpression = [];
    const ExpressionAttributeValues = {};

    for (const [key, value] of Object.entries(updateUserDto)) {
      updateExpression.push(`${key} = :${key}`);
      ExpressionAttributeValues[`:${key}`] = value;
    }

    const params = {
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: `set ${updateExpression.join(', ')}`,
      ExpressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    };

    try {
      const result = await this.dynamoDb.update(params).promise();
      return result.Attributes;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Could not update user');
    }
  }
}
