import mongoose, { Schema, model } from "mongoose";
import { Post } from "../../../../entity/post";

const postSchema = new Schema<Post>({
    title        : { type: String, required: true },
    content      : { type: String, required: true, unique: true },
    author       : {type: mongoose.Schema.ObjectId, ref: 'User'},
    created_at   : { type: Date, default: Date.now },
    updated_at   : { type: Date, default: Date.now },
});

// Create the Mongoose model for the User entity
const postModel = model<Post>('Post', postSchema);

export default postModel;
  