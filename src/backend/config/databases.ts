import mongoose from "mongoose";

export default {
    "inventory": mongoose.createConnection("mongodb://localhost/inventory"),
    "fluentd": mongoose.createConnection("mongodb://localhost/fluentd"),
}