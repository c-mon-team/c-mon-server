const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const responseMessage = require('../modules/responseMessage');
const db = require('../db/db');
const memberService = require('../services/memberService');

const createMemberChoice = async (req, res) => {
  const { groupId, userName, choice } = req.body;
  console.log(groupId);
  console.log(userName);
  console.log(choice[0]);
  if (!groupId || !userName || !choice) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  let client;
  try {
    client = await db.connect(req);

    const data = await memberService.createMemberChoice(client, groupId, userName, choice);
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

module.exports = { createMemberChoice };
