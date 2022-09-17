import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createUser, deleteUser, getUsers, patchUser } from '../api/users-api'
import Auth from '../auth/Auth'
import { User } from '../types/User'

interface UsersProps {
  auth: Auth
  history: History
}

interface UsersState {
  users: User[]
  newUserName: string
  loadingUsers: boolean
}

export class Users extends React.PureComponent<UsersProps, UsersState> {
  state: UsersState = {
    users: [],
    newUserName: '',
    loadingUsers: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newUserName: event.target.value })
  }

  onEditButtonClick = (clientId: string) => {
    this.props.history.push(`/users/${clientId}/edit`)
  }

  onUserCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newUser = await createUser(this.props.auth.getIdToken(), {
        name: this.state.newUserName,
        dueDate
      })
      this.setState({
        users: [...this.state.users, newUser],
        newUserName: ''
      })
    } catch {
      alert('User creation failed')
    }
  }

  onUserDelete = async (clientId: string) => {
    try {
      await deleteUser(this.props.auth.getIdToken(), clientId)
      this.setState({
        users: this.state.users.filter(user => user.clientId !== clientId)
      })
    } catch {
      alert('User deletion failed')
    }
  }

  onUserCheck = async (pos: number) => {
    try {
      const user = this.state.users[pos]
      await patchUser(this.props.auth.getIdToken(), user.clientId, {
        name: user.name,
        dueDate: user.dueDate,
        done: !user.done
      })
      this.setState({
        users: update(this.state.users, {
          [pos]: { done: { $set: !user.done } }
        })
      })
    } catch {
      alert('User deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const users = await getUsers(this.props.auth.getIdToken())
      this.setState({
        users,
        loadingUsers: false
      })
    } catch (e) {
      alert(`Failed to fetch users: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">USERS</Header>

        {this.renderCreateUserInput()}

        {this.renderUsers()}
      </div>
    )
  }

  renderCreateUserInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New user',
              onClick: this.onUserCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderUsers() {
    if (this.state.loadingUsers) {
      return this.renderLoading()
    }

    return this.renderUsersList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading USERS
        </Loader>
      </Grid.Row>
    )
  }

  renderUsersList() {
    return (
      <Grid padded>
        {this.state.users.map((user, pos) => {
          return (
            <Grid.Row key={user.clientId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onUserCheck(pos)}
                  checked={user.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {user.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {user.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(user.clientId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onUserDelete(user.clientId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {user.attachmentUrl && (
                <Image src={user.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
