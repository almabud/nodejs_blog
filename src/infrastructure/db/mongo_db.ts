import mongoose from 'mongoose';
import { Db } from './db';
import { DatabaseConnectionError } from '../../errors/errors';


export class MongoDb implements Db{
    _db_url: string;

    constructor(db_url: string){
        this._db_url = db_url
    }
    
    set db_url(db_url: string){
        this._db_url = db_url
    }

    get db_url():string{
        return this._db_url
    }

    async connect(): Promise<void> {
        try {
          await mongoose.connect(this.db_url);
          console.log('Connected to MongoDB');
        } catch (error) {
          console.error('MongoDB connection error:', error);
          throw new DatabaseConnectionError('Can not connect to the database.');
        }
      }
}
