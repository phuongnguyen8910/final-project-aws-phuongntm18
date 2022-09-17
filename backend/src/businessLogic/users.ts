import { UsersAccess } from '../dataAccess/usersAcess'
import { UserItem } from '../models/UserItem'
import { CreateUserRequest } from '../requests/CreateUserRequest'
import { UpdateUserRequest } from '../requests/UpdateUserRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const usersAcess = new UsersAccess()
const logger = createLogger('users')

export async function getUsersForUser(userId: string): Promise<UserItem[]> {
    logger.info(`getUsersForUser: ${userId}` , {
        key: userId
    })
    const result = usersAcess.getUsersForUser(userId)
    logger.info(`getUsersForUser: successfully`, {
        key: userId
    })
    return result
}

export async function createUser(createUserRequest: CreateUserRequest, userId: string): Promise<UserItem> {
    logger.info(`createUser: ${createUserRequest}`, {
        key: userId
    })
    const clientId = uuid.v4()

    const newUser: UserItem = {
        clientId: clientId,
        userId: userId,
        createdAt: new Date().toISOString(),
        name: createUserRequest.name,
        dueDate: createUserRequest.dueDate,
        done: false
    }

    const result = await usersAcess.createUser(newUser)
    logger.info(`createUser: successfully`, {
        key: userId,
        newUser: newUser
    })
    return result
}

export async function updateUser(updateUserRequest: UpdateUserRequest, userId: string, clientId: string) {
    logger.info(`updateUser: ${updateUserRequest}`, {
        key: userId
    })
    const updateUser: UserItem = {
        clientId: clientId,
        userId: userId,
        createdAt: new Date().toISOString(),
        name: updateUserRequest.name,
        dueDate: updateUserRequest.dueDate,
        done: updateUserRequest.done,
        attachmentUrl: null
    }

    await usersAcess.updateUser(updateUser, userId, clientId);
    logger.info(`updateUser: successfully`, {
        key: userId,
        updateUser: updateUser
    })
}

export async function deleteUser(userId: string, clientId: string) {
    logger.info(`deleteUser: ${clientId}`, {
        key: userId
    })
    await usersAcess.deleteUser(userId, clientId)
    logger.info(`deleteUser: successfully`, {
        key: userId
    })
}

export async function createAttachmentPresignedUrl(clientId: string, userId: string, attachmentUrl: string) {
    logger.info(`createAttachmentPresignedUrl: ${attachmentUrl}`, {
        key: userId
    })

    const result = await usersAcess.createAttachmentPresignedUrl(clientId, userId, attachmentUrl);

    logger.info(`createAttachmentPresignedUrl: successfully`, {
        key: userId
    })
    return result
  }


