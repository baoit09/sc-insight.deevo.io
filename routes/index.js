var express = require('express');
const constants = require(__dirname + '/../utils/constants');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  let channelID = 'mychannel';
  let channelName = constants.ChannelDict[channelID];
  let chaincode = 'supplychain';
  res.render('templates/index', { channelID: channelID, channelName: channelName, chaincode: chaincode });
});

router.get('/block/:block_num', function (req, res, next) {
  let channelID = 'mychannel';
  let channelName = constants.ChannelDict[channelID];
  let block_num = req.params.block_num;
  res.render('templates/block-info', { channelID: channelID, channelName: channelName, num: block_num });
});

router.get('/channel/:channelID', function (req, res, next) {
  let channelID = req.params.channelID;
  let channelName = constants.ChannelDict[channelID];
  let txid = req.query.txid;
  res.render('templates/channel-info', { channelID: channelID, channelName: channelName, txid: txid });
});

module.exports = router;
