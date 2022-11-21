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
  const member = createMember[0].id;
  for (let c of choice) {
    const { rows: subcategory } = await client.query(
      `
        SELECT *
        FROM subcategory
        WHERE name = $1
        `,
      [c],
    );
    if (!subcategory[0]) {
      throw 404;
    }
    console.log(subcategory);
    const { rows: choice } = await client.query(
      `
        INSERT INTO choice
        (member_id, subcategory_id)
        VALUES ($1, $2)
        RETURNING *
        `,
      [member, subcategory[0].id],
    );
  }
  return convertSnakeToCamel.keysToCamel(createMember);
};

module.exports = { createMemberChoice };
