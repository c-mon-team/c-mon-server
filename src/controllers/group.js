const util = require("../modules/util");
const statusCode = require("../modules/statusCode");
const responseMessage = require("../modules/responseMessage");
const db = require("../db/db");
const nanoid = require("nanoid");
const groupService = require("../services/groupService");
const choiceService = require("../services/choiceService");
const { extractValues } = require("../modules/extractValues");

const createGroup = async (req, res) => {
  const { group } = req.body;
  if (!group)
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  let client;
  try {
    client = await db.connect(req);
    const code = nanoid();
    console.log(code);
    const data = await groupService.createGroup(client, group, code);
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, responseMessage.SUCCESS, data));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          responseMessage.INTERNAL_SERVER_ERROR
        )
      );
  } finally {
    client.release();
  }
};

const getGroupResult = async (req, res) => {
  const { groupId } = req.params;
  const { id } = req.query;
  if (!groupId || !id)
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
  let client;
  try {
    client = await db.connect(req);

    let memberId;
    if (id == 0) {
      memberId = id;
    } else {
      memberId = id;
      console.log(memberId);
    }

    // 멤버 아이디로 카테고리 가져오기
    const category = await choiceService.getGroupCategoryResult(
      client,
      memberId
    );

    // 결과 없는 경우
    if (category.length < 1) {
      return res.status(statusCode.OK).send(
        util.success(statusCode.OK, responseMessage.SUCCESS, {
          categoryList: [],
        })
      );
    }

    // 카테고리 추출 후 멤버 가져오기
    const categoryId = extractValues(category, "id");
    const memberList = await choiceService.getMembersWithCategoryId(
      client,
      memberId,
      categoryId
    );

    // 멤버 데이터 가공
    const member = memberList.reduce((result, m) => {
      const a = result.find(({ id }) => id === m.id);
      a
        ? a.memberList.push(m.name)
        : result.push({ id: m.id, memberList: [m.name] });
      return result;
    }, []);

    // 카테고리-멤버 매핑
    const map = new Map();
    category.forEach((item) => map.set(item.id, item));
    member.forEach((item) =>
      map.set(item.id, { ...map.get(item.id), ...item })
    );
    const data = Array.from(map.values());

    // 결과
    res.status(statusCode.OK).send(
      util.success(statusCode.OK, responseMessage.SUCCESS, {
        categoryList: data,
      })
    );
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          responseMessage.INTERNAL_SERVER_ERROR
        )
      );
  } finally {
    client.release();
  }
};

module.exports = { createGroup, getGroupResult };
