const convertSnakeToCamel = require("../modules/convertSnakeToCamel");

const getGroupCategoryResult = async (client, groupId) => {
  const { rows } = await client.query(
    `
    SELECT c.id, c.name FROM "category" c
    JOIN "subcategory" s
    ON c.id=s.category_id
    JOIN "choice" ch
    ON s.id=ch.subcategory_id
    JOIN "member" m
    ON ch.member_id=m.id
    JOIN "group" g
    ON m.group_id=g.id
    WHERE g.id=$1
    GROUP BY c.id, c.name
    ORDER BY count(c.name) DESC
    LIMIT 3;
    `,
    [groupId]
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getMembersWithCategoryId = async (client, groupId, categoryId) => {
  const { rows } = await client.query(
    `
      SELECT c.id, m.name FROM "category" c
      JOIN "subcategory" s
      ON c.id=s.category_id
      JOIN "choice" ch
      ON s.id=ch.subcategory_id
      JOIN "member" m
      ON ch.member_id=m.id
      JOIN "group" g
      ON m.group_id=g.id
      WHERE g.id=$1
      AND c.id IN (${categoryId.join(",")});
      `,
    [groupId]
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { getGroupCategoryResult, getMembersWithCategoryId };
