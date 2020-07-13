import * as Router from 'koa-joi-router'
import UserController from '../controllers/user.controller'

const Joi = Router.Joi
const UserRoutes = Router()

UserRoutes.prefix('/user')

/* Fetches User data based on the userId param */
UserRoutes.param('userId', async (id, context, next) => await UserController.findUserById(id, context, next))

/* All routes regarding Users */
UserRoutes
.route([
  { /* Create a user */
    method: 'POST',
    path: '/',
    validate: {
      type: 'json',
      body: {
        firstName: Joi
          .string()
          .required()
          .min(1),
        lastName: Joi
          .string()
          .required()
          .min(1),
        userName: Joi
          .string()
          .required()
          .min(1)
          .max(15),
        email: Joi
          .string()
          .required()
          .email(),
        password: Joi
          .string()
          .required()
          /*
          * Minimum eight and maximum 10 characters,
          * at least one uppercase letter,
          * one lowercase letter,
          * one number,
          * and one special character
          *
          */
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/),
      }
    },
    handler: async (context, next) => await UserController.insertUser(context, next)
  },
  { /* Get User by userId */
    method: 'GET',
    path: '/:userId',
    handler: async (context, next) => await UserController.returnUser(context, next)
  }
])

export default UserRoutes