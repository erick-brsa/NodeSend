import mongoose from "mongoose";

const Schema = mongoose.Schema;

const LinkSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    original_name: {
        type: String,
        required: true,
    },
    downloads: {
        type: Number,
        default: 1,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    password: {
        type: String,
        default: null,
    }
}, {
    timestamps: true,
});

export default mongoose.model("Link", LinkSchema);