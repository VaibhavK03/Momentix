import mongoose, {Schema} from "mongoose";

const postSchema = new Schema (
    {
        postuploader:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        caption:{
            type: String,
            required: true
        },
        images: {
            type: String,
            required: true
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        comments: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Comment",
            },
        ]
    },
    {
        timestamps: true
    }
)


export const Post = mongoose.model("Post", postSchema);