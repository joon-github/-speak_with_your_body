"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(req.params);
    console.log(req.query);
    // query: QuertType = req.query;
    // params: QuertType = req.params;
    res.send('indexsdsdsdff');
});
module.exports = router;
