

const Story = require("./stories.model");
const User = require("../user/user.model");

const GetStories = async (req, res) => {
    try {
      let auth = req.body;
      let user = await User.findById(auth._id).populate({ path: "stories" });
      return res.status(200).json({ stories: user.stories, status: true });
    } catch (error) {
      return res.status(500).json({ message: error?.message, status: false })
    }
  }
  
  
  const GetStoryById = async (req, res) => {
    try {
      let { id } = req.params;
      let story = await Story.findById(id).populate({ path: "author", select: 'name displayName gender _id image' });
      return res.status(200).json({ story, status: true });
    } catch (error) {
      return res.status(500).json({ message: error?.message, status: false })
    }
  }
  
  const DeleteStory = async (req, res) => {
    try {
      let { id } = req.params;
      let auth = req.user;
      let story = await Story.findOne({ _id: id, author: auth._id });
  
      await cloudinary.api.delete_resources([story.media.filename], {
        resource_type: story?.media?.mimetype?.split("/")[0] ?? "video",
        type: "upload",
      });
  
      await Story.findByIdAndDelete(id);
  
      let user = await User.findById(auth._id);
  
      user.stories = user.stories.filter((s) => s._id.toString() !== id);
      await user.save();
  
      return res.status(200).json({ stories: user.stories, status: true });
    } catch (error) {
      return res.status(500).json({ message: error?.message, status: false })
    }
  }
  const AddStory = async (req, res) => {
    try {
      const auth = req.body;
      const media = req.file;
      const { title, caption } = req.body;
      console.log(req.body);
  // return
      if (!auth._id || !media) {
        return res.status(400).json({ message: 'Author ID and media are required', status: false });
      }
  
      const story = await Story.create({
        author: auth._id,
        media: media.path, // Store the path or any other relevant information about the media
        title: title || "",
        caption: caption || "",
      });
  
      const user = await User.findByIdAndUpdate(
        auth._id,
        { $push: { stories: story._id } },
        { new: true }
      ).populate({ path: 'stories' });
  
      return res.status(200).json({
        message: 'Story has been added successfully.',
        status: true,
        stories: user.stories
      });
  
    } catch (error) {
      return res.status(500).json({ message: error.message, status: false });
    } 
  }


  module.exports = {
    GetStories,
    GetStoryById,
    AddStory,
    DeleteStory,
  };