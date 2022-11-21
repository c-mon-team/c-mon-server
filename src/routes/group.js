const express = require("express");
const group = require("../controllers/group");
const router = express.Router();

router.post("/", group.createGroup);
router.get("/:groupId/choice/member", group.getGroupResult);

module.exports = router;
