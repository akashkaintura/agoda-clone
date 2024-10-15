import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from '../../common/dto/create-property.dto';
import { UpdatePropertyDto } from '../../common/dto/update-property.dto';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PropertiesService {
  private readonly dynamoDb: AWS.DynamoDB.DocumentClient;
  private readonly tableName: string = 'Properties';

  constructor() {
    this.dynamoDb = new AWS.DynamoDB.DocumentClient({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async create(createPropertyDto: CreatePropertyDto) {
    const propertyId = uuidv4();
    const newProperty = {
      id: propertyId,
      ...createPropertyDto,
      createdAt: new Date().toISOString(),
    };

    const params = {
      TableName: this.tableName,
      Item: newProperty,
    };

    try {
      await this.dynamoDb.put(params).promise();
      return { id: propertyId, ...newProperty };
    } catch (error) {
      console.error('Error creating property:', error);
      throw new Error('Could not create property');
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
        throw new Error('Property not found');
      }
      return result.Item;
    } catch (error) {
      console.error('Error finding property:', error);
      throw new Error('Could not find property');
    }
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
    const updateExpression = [];
    const ExpressionAttributeValues = {};

    for (const [key, value] of Object.entries(updatePropertyDto)) {
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
      console.error('Error updating property:', error);
      throw new Error('Could not update property');
    }
  }
}
