import { Model, Document } from "mongoose";
import { DatabaseInsertionError, NotFoundError, UnknownError } from "../../../errors/errors";
import { BaseEntity } from '../../../entity/deserializable';


export class MongoBaseRepo<T>{
    model: Model<T>
    entity: BaseEntity & T;

    constructor(model: Model<T>, entity: BaseEntity & T) {
        this.model = model;
        this.entity = entity;
    }

    async filter(filters?: Object): Promise<T[]> {
        try {
            const data = await this.model.find();
            const res = <Array<T>>await this.format_data(data);

            return res;
        } catch (error) {
            throw new NotFoundError();
        }

    }

    async get(filters:{}): Promise<T>{
        try{
            const data = await this.model.findOne(filters);
            const res = <T> await this.format_data(data!);
            
            return res;
        } catch (error){
            throw new NotFoundError();
        }
    };

    async get_by_id(id: string): Promise<T> {
        try {
            const data = <Document>await this.model.findById(id = id);

            return <T>this.format_data(data);
        } catch (error) {
            throw new NotFoundError();
        }
    }

    async create(data: T): Promise<T>{
        try {
            const new_doc = new this.model(data);
            
            return <T> this.format_data(await new_doc.save());
          } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
                throw new DatabaseInsertionError(error.message);
              } else {
                throw new DatabaseInsertionError();
              }
          }
    }

    async format_data(data: Document | Document[]): Promise<T[] | T> {
        let res: T | T[];
        if (Array.isArray(data)) {
            res = [];
            for (const item of data) {
                res.push(<T>await this.to_object(item));
            }
        } else {
            res = await this.to_object(data);
        }

        return res;
    }

    async to_object(data: Document): Promise<T> {
        return this.entity.deserialize({ "id": data._id.toString(), ...data.toObject() })
    }
}
