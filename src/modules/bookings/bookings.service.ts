import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from '../../common/dto/create-booking.dto';
import { UpdateBookingDto } from '../../common/dto/update-booking.dto';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingsService {
  private readonly dynamoDb: AWS.DynamoDB.DocumentClient;
  private readonly tableName: string = 'Bookings';

  constructor() {
    this.dynamoDb = new AWS.DynamoDB.DocumentClient({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async create(createBookingDto: CreateBookingDto) {
    const bookingId = uuidv4();
    const newBooking = {
      id: bookingId,
      ...createBookingDto,
      createdAt: new Date().toISOString(),
    };

    const params = {
      TableName: this.tableName,
      Item: newBooking,
    };

    try {
      await this.dynamoDb.put(params).promise();
      return { id: bookingId, ...newBooking };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Could not create booking');
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
        throw new Error('Booking not found');
      }
      return result.Item;
    } catch (error) {
      console.error('Error finding booking:', error);
      throw new Error('Could not find booking');
    }
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const updateExpression = [];
    const ExpressionAttributeValues = {};

    for (const [key, value] of Object.entries(updateBookingDto)) {
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
      console.error('Error updating booking:', error);
      throw new Error('Could not update booking');
    }
  }
}
