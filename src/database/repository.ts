import {
  Db,
  Collection,
  Cursor,
  FilterQuery,
  InsertOneWriteOpResult,
  WithId,
  OptionalId,
  InsertWriteOpResult,
  UpdateWriteOpResult,
  DeleteWriteOpResultObject,
  FindAndModifyWriteOpResultObject,
} from "mongodb"
import {
  IWrite,
  IRead,
  UpdateParams,
  DeleteOneParams,
  DeleteManyParams,
  IReadWrite,
  FindUpdate,
} from "./interfaces/opperations"
import mainDb from './index'

/* Generic repository for all immediate mongoDb queries call */
export default class Repository<T> implements IWrite<T>, IRead<T>, IReadWrite<T> {
  protected readonly collection: Collection<T>
  protected readonly collectionName: string
  private readonly db: Db = mainDb.db

  constructor(name: string){
    this.collectionName = name
    this.collection = this.db.collection(name)
  }

  /* Write Opperations */
  find = async (query?: FilterQuery<T>): Promise<Cursor<T>> => this.collection.find<T>(query)
  findOne = async (query: FilterQuery<T>): Promise<T | null> => await this.collection.findOne<T>(query)

  /* Read Opperations */
  insertOne = async (doc: OptionalId<T>): Promise<InsertOneWriteOpResult<WithId<T>>> => await this.collection.insertOne(doc)
  insertMany = async (docs: OptionalId<T>[]): Promise<InsertWriteOpResult<WithId<T>>> => await this.collection.insertMany(docs)
  updateOne = async (params: UpdateParams<T>): Promise<UpdateWriteOpResult> => await this.collection.updateOne(params.filter, params.update, params.options)
  updateMany = async (params: UpdateParams<T>): Promise<UpdateWriteOpResult> => await this.collection.updateMany(params.filter, params.update, params.options)
  deleteOne = async (params: DeleteOneParams<T>): Promise<DeleteWriteOpResultObject> => await this.collection.deleteOne(params.filter, params.options)
  deleteMany = async (params: DeleteManyParams<T>): Promise<DeleteWriteOpResultObject> => await this.collection.deleteMany(params.filter, params.options)

  /* Read & Write Opperations */
  findOneAndUpdate = async (params: FindUpdate<T>): Promise<FindAndModifyWriteOpResultObject<T>> => await this.collection.findOneAndUpdate(params.filter, params.update, params.options)
}

