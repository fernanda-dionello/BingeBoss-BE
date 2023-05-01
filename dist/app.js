"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_connection = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@binge-boss-db.41afdlo.mongodb.net/?retryWrites=true&w=majority`;
mongoose_1.default.connect(db_connection);
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "connection failed: "));
db.once("open", function () {
    console.log("Connected to the database successfully");
});
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("Hello World! I'm Binge Boss");
});
app.listen(port, () => {
    return console.log(`Starting Library app - port ${port}`);
});
