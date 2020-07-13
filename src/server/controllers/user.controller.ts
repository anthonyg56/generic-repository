import { IUser } from '../../database/interfaces/entities'
import User from '../../database/entities/user'
import * as Router from 'koa-joi-router'
import { ObjectId } from 'mongodb'
import { Next, Context } from 'koa'

export interface IUserController {
  insertUser: Router.FullHandler;
  findUserById(id: string, context: Context, next: Next): Promise<any>;
  returnUser: Router.FullHandler;
}

/* User middleware for handling requests and response from the client & server */
const UserController: IUserController = {
  /* Inserts a user into the Db */
  insertUser: async (context, next) => {
    const { request, response, state } = context
    const { user } = state

    const body: IUser =  await request.body
    const results = await user.createUser(body)

    const error = () => {
      response.body = { message: 'There was an error adding the user' }
      response.status = 500
    }
    const success = () => {
      response.body = { message: 'User successfully added to db', entity: user.getUser }
      response.status = 200
    }

    results.result.ok === 1 ? success() : error()

    await next()
  },
  /* Return user to client */
  returnUser: async (context, next) => {
    const { response, state } = context

    response.body = { message: "Found user", entity: state.user.getEntity }

    await next()
  },
  /* Find user based on the id param */
  findUserById: async (id, context, next) => {
    const user = new User()
    const objectId = new ObjectId(id)

    await user.findUserById(objectId)
    context.state.user = user

    await next()
  },
}

export default UserController