import mongoose from "mongoose";

const autoresponseSchema = new mongoose.Schema({
    name: String,
    keywords: Object,
    title: String,
    body: String,
    author: Object,
});

export default mongoose.model("autoresponse", autoresponseSchema);