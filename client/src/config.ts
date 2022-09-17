// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'ogw3muw3c8'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-15f23zoa.us.auth0.com',            // Auth0 domain
  clientId: '3sKc8QEyBsuy6BB68fRqW2JE0aAJLA8x',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
