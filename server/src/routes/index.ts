import express from 'express';
const router = express.Router();

type QuertType = {
  roomName: string
  
}
/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.params);
  console.log(req.query);
  // query: QuertType = req.query;
  // params: QuertType = req.params;
  res.send('indexsdsdsdff');
});

module.exports = router;