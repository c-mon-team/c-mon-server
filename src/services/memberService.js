const convertSnakeToCamel = require('../modules/convertSnakeToCamel');

const createMemberChoice = async (client, groupId, userName, choice) => {
  const { rows: createMember } = await client.query(
    `
    INSERT INTO member
    (name, group_id)
    VALUES ($1, $2)
    RETURNING *
    `,
    [userName, groupId],
  );
  // const member = createMember[0].id
  // choice.map(x =>
  //     member
  // );

  return convertSnakeToCamel.keysToCamel(member[0]);
};

module.exports = { createMemberChoice };
