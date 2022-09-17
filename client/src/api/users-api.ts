import { apiEndpoint } from '../config'
import { User } from '../types/User';
import { CreateUserRequest } from '../types/CreateUserRequest';
import Axios from 'axios'
import { UpdateUserRequest } from '../types/UpdateUserRequest';

export async function getUsers(idToken: string): Promise<User[]> {
  console.log('Fetching user')

  const response = await Axios.get(`${apiEndpoint}/users`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Users:', response.data)
  return response.data.items
}

export async function createUser(
  idToken: string,
  newUser: CreateUserRequest
): Promise<User> {
  const response = await Axios.post(`${apiEndpoint}/users`,  JSON.stringify(newUser), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchUser(
  idToken: string,
  clientId: string,
  updatedUser: UpdateUserRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/users/${clientId}`, JSON.stringify(updatedUser), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteUser(
  idToken: string,
  clientId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/users/${clientId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  clientId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/users/${clientId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
