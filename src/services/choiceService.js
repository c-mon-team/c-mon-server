const convertSnakeToCamel = require("../modules/convertSnakeToCamel");

const getGroupCategoryResult = async (client, memberId) => {
  const { rows } = await client.query(
    `
    SELECT c.id, c.name FROM "category" c
    JOIN "subcategory" s
    ON c.id=s.category_id
    JOIN "choice" ch
    ON s.id=ch.subcategory_id
    JOIN "member" m
    ON ch.member_id=m.id
    WHERE m.id IN (${memberId})
    GROUP BY c.id, c.name
    ORDER BY count(c.name) DESC
    LIMIT 3;
    `
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const getMembersWithCategoryId = async (client, memberId, categoryId) => {
  const { rows } = await client.query(
    `
      SELECT c.id, m.name FROM "category" c
      JOIN "subcategory" s
      ON c.id=s.category_id
      JOIN "choice" ch
      ON s.id=ch.subcategory_id
      JOIN "member" m
      ON ch.member_id=m.id
      WHERE  m.id IN (${memberId})
      AND c.id IN (${categoryId.join(",")});
      `
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

module.exports = { getGroupCategoryResult, getMembersWithCategoryId };
