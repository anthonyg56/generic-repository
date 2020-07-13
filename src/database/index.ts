import { MongoClient } from 'mongodb'

class DataBase {
  private client: MongoClient
  private readonly dbName: string
  private readonly uri = process.env.MAIN_DB_URI as string

  constructor(name: string) {
    this.dbName = name
  }

  get db() {
    return this.client.db(this.dbName)
  }

  connect = async () => {
    if (this.client)
      return this.client
    const options = {
      useUnifiedTopology: true
    }
    const connection = await MongoClient.connect(this.uri, options)
    this.client = connection
  }
}

const mainDb = new DataBase('main')

export default mainDb