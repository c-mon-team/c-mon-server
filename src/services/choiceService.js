const convertSnakeToCamel = require("../modules/convertSnakeToCamel");
const { extractValues } = require("../modules/extractValues");

const getGroupCategoryResultByMemberId = async (client, memberId) => {
  const { rows: category } = await client.query(
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
  if (category.length < 1) return { categoryList: [] };

  const categoryId = extractValues(category, "id");

  const { rows: memberList } = await client.query(
    `
      SELECT c.id, m.name FROM "category" c
      JOIN "subcategory" s
      ON c.id=s.category_id
      JOIN "choice" ch
      ON s.id=ch.subcategory_id
      JOIN "member" m
      ON ch.member_id=m.id
      WHERE m.id IN (${memberId})
      AND c.id IN (${categoryId.join(",")});
      `
  );

  const member = memberList.reduce((result, m) => {
    const a = result.find(({ id }) => id === m.id);
    a
      ? a.memberList.push(m.name)
      : result.push({ id: m.id, memberList: [m.name] });
    return result;
  }, []);

  const map = new Map();
  category.forEach((item) => map.set(item.id, item));
  member.forEach((item) => map.set(item.id, { ...map.get(item.id), ...item }));
  const result = Array.from(map.values());

  return convertSnakeToCamel.keysToCamel(result);
};

module.exports = { getGroupCategoryResultByMemberId };
