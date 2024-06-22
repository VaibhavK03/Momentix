import mongoose, {Schema} from "mongoose";

const tweetSchema = new Schema (
    {
        tweetwriter:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        tweet:{
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


export const Tweet = mongoose.model("Tweet", tweetSchema);