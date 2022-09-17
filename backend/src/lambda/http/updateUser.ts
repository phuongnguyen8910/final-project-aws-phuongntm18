import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateUser } from '../../businessLogic/users'
import { UpdateUserRequest } from '../../requests/UpdateUserRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const clientId = event.pathParameters.clientId
    const updatedUser: UpdateUserRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    await updateUser(updatedUser, userId, clientId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
      })
    }
})

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
