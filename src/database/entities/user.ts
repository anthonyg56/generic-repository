import Repository from "../repository"
import { ObjectID } from "mongodb"
import { IUser } from "../interfaces/entities"
import * as bcrypt from 'bcrypt'

/* Generic Services that set up query calls made to a repository */
export default class User {
  private readonly repository = new Repository<IUser>('users')
  public user: IUser

  constructor(data?: IUser){
    this.user = data
  }

  private hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    return hash
  }
  private comparePassword = async (password: string, hash: string) => {
    const match = await bcrypt.compare(password, hash)
    return match
  }

  login = async (email: string, password: string) => {
    const user = await this.repository.findOne({ email })
    if (!user)
      return null

    const isPassword = await this.comparePassword(password, user.password)
    if (!isPassword)
      return null

    this.user = user
    return user
  }

  createUser = async (data: IUser) => {
    const user = data

    user.password = await this.hashPassword(user.password)
    const results = await this.repository.insertOne(user)
    this.user = results.ops[0]
  }

  findUserById = async (id: ObjectID) => {
    this.user = await this.repository.findOne({ _id: id })
    return this.user
  }

  // updateEntity = async ()
}