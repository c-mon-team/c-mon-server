const convertSnakeToCamel = require("../modules/convertSnakeToCamel");

const createGroup = async (client, group, code) => {
  const { rows } = await client.query(
    `
    INSERT INTO "group"
    (name, code)
    VALUES ($1, $2)
    RETURNING *
    `,
    [group, code]
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

module.exports = { createGroup };
