const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const responseMessage = require('../modules/responseMessage');
const db = require('../db/db');
const nanoid = require('nanoid');
const groupService = require('../services/groupService');

const createGroup = async (req, res) => {
  const { group } = req.body;
  if (!group) return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  let client;
  try {
    client = await db.connect(req);
    const code = nanoid();
    console.log(code);
    const data = await groupService.createGroup(client, group, code);
    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

module.exports = { createGroup };
