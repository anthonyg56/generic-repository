import {
  Cursor,
  FilterQuery,
  OptionalId,
  InsertOneWriteOpResult,
  WithId,
  InsertWriteOpResult,
  UpdateWriteOpResult,
  UpdateQuery,
  UpdateManyOptions,
  DeleteWriteOpResultObject,
  CommonOptions,
  FindOneAndUpdateOption,
  FindAndModifyWriteOpResultObject
} from 'mongodb';

/* Interfaces & types for different db opperations */

export type InsertResults<T> = Promise<InsertOneWriteOpResult<WithId<T>>> | Promise<InsertWriteOpResult<WithId<T>>>

export type UpdateParams<T> = {
  filter: FilterQuery<T>,
  update: UpdateQuery<T> | Partial<T>,
  options?: UpdateManyOptions
}
export type DeleteOneParams<T> = {
  filter: FilterQuery<T>,
  options?: CommonOptions & { bypassDocumentValidation?: boolean }
}
export type DeleteManyParams<T> = {
  filter: FilterQuery<T>,
  options?: CommonOptions
}
export type FindUpdate<T> = {
  filter: FilterQuery<T>,
  update: UpdateQuery<T> | T,
  options?: FindOneAndUpdateOption
}

export interface IRead<T> {
  find(query?: FilterQuery<T>): Promise<Cursor<T>>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
}
export interface IWrite<T> {
  insertOne(docs: OptionalId<T>): InsertResults<T>; /* Returns document _id in a promise */
  insertMany(docs: OptionalId<T>[]): InsertResults<T>;
  updateOne(params: UpdateParams<T>): Promise<UpdateWriteOpResult>;
  updateMany(params: UpdateParams<T>): Promise<UpdateWriteOpResult>
  deleteOne(params: DeleteOneParams<T>): Promise<DeleteWriteOpResultObject>;
  deleteMany(params: DeleteManyParams<T>): Promise<DeleteWriteOpResultObject>;
}
export interface IReadWrite<T> {
  findOneAndUpdate(params: FindUpdate<T>): Promise<FindAndModifyWriteOpResultObject<T>>;
}