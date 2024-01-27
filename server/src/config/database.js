"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const dotenv_1 = require("dotenv"); // npm install dotenv
(0, dotenv_1.config)();
const db_info = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
exports.default = {
    init: function () {
        return mysql_1.default.createConnection(db_info);
    },
    connect: function (conn) {
        conn.connect(function (err) {
            if (err)
                console.error("mysql connection error :" + err);
            else
                console.log("mysql is connected successfully!");
        });
    },
};
