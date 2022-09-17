import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { UserItem } from '../models/UserItem'
import { UserUpdate } from '../models/UserUpdate';

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('UsersAccess')

export class UsersAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly usersTable = process.env.USERS_TABLE) {
    }

    async getUsersForUser(userId: string): Promise<UserItem[]> {
        logger.info(`Get all users for user: ${userId}`)
        const result = await this.docClient.query({
            TableName: this.usersTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        return result.Items as UserItem[]
    }

    async createUser(user: UserItem): Promise<UserItem> {
        logger.info(`Createing a user with id ${user.clientId}`)
        await this.docClient.put({
          TableName: this.usersTable,
          Item: user
        }).promise()
    
        return user
    }

    async updateUser(user: UserUpdate, userId: string, clientId: string) {
        logger.info(`Updating a user with id: ${clientId}`)
        await this.docClient.update({
            TableName: this.usersTable,
            Key: {
                userId,
                clientId
            },
            UpdateExpression: 'set #nameUser = :name, dueDate = :dueDate, done = :done',
            ConditionExpression: 'clientId = :clientId',
            ExpressionAttributeValues: {
                ':clientId': clientId,
                ':name': user.name,
                ':dueDate': user.dueDate,
                ':done': user.done
            },
            ExpressionAttributeNames: {
                '#nameUser': 'name'
            }
        }).promise()
    }

    async deleteUser(userId: string, clientId: string) {
        logger.info(`Deleting a client with id: ${clientId}`)
        await this.docClient.delete({
            TableName: this.usersTable,
            Key: {
                userId,
                clientId
            }
        }).promise()
    }

    async createAttachmentPresignedUrl(clientId: string, userId: string, attachmentUrl: string) {
        const result = await this.docClient.update({
            TableName: this.usersTable,
            Key: {
                userId,
                clientId
            },
            UpdateExpression: 'set attachmentUrl=:attachmentUrl ',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl
            }
        }).promise();
        return result;
    }
}
