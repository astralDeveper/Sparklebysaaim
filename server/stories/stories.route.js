const express = require("express");
const router = express.Router();
const { GetStories, GetStoryById, DeleteStory, AddStory } = require("./stories.controller")

const { ProfileImageUploader, StorieUploader } = require("../../util/fileUploder")
const checkAccessWithKey = require("../../checkAccess");


// story routes 
router.post("/add-story",  StorieUploader, AddStory);
router.get("/get-stories", checkAccessWithKey(), GetStories);
router.get("/get-story/:id", checkAccessWithKey(), GetStoryById);
// route.get("/get-story", verifyToken, GetStoryWithoutId);
router.delete("/delete-story/:id", checkAccessWithKey(), DeleteStory);

module.exports = router;