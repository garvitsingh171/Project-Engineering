const router = require("express").Router();
const controller = require("../controllers/post.controller");

router.get("/", controller.getPosts);
router.get("/:id", controller.getPost);
router.post("/", controller.createPost);
router.patch("/:id/publish", controller.publishPost);

module.exports = router;