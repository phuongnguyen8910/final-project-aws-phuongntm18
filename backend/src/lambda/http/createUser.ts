import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateUserRequest } from '../../requests/CreateUserRequest'
import { getUserId } from '../utils';
import { createUser } from '../../businessLogic/users'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newUser: CreateUserRequest = JSON.parse(event.body)
    const userId = getUserId(event)

    const user = await createUser(newUser, userId)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: user
      })
    }
})


handler.use(
  cors({
    credentials: true
  })
)
