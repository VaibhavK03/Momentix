import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; 

const commentSchema = new mongoose.Schema({
  commenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comment: {
    type: String,
    required: true, 
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  tweet:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tweet"
  },
}, { timestamps: true });

commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", commentSchema);
