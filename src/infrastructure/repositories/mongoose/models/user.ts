import mongoose, { Schema, model } from "mongoose";
import { User as UserEntity } from "../../../../entity/user";

const userSchema = new Schema<UserEntity>({
    name         : { type: String, required: true },
    email        : { type: String, required: true, unique: true },
    password     : { type: String, required: true },
    created_at   : { type: Date, default: Date.now },
    updated_at   : { type: Date, default: Date.now },
});

// Create the Mongoose model for the User entity
const UserModel = model<UserEntity>('User', userSchema);

export default UserModel;
  