import { Chat } from "../models/Chat.js";
import { Conversation } from "../models/Conversation.js";

//  Create new chat
export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chat = await Chat.create({
      user: userId,
    });

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get all chats of a user
export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a conversation (question + answer)
export const addConversation = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat)
      return res.status(404).json({ message: "No chat with this id" });

    // Create new conversation
    const conversation = await Conversation.create({
      chat: chat._id,
      question: req.body.question,
      answer: req.body.answer,
    });

    
    chat.latestMessage = req.body.question;
    await chat.save();

    // Return full conversation array to frontend
    const allConversations = await Conversation.find({ chat: chat._id });

    res.json({
      conversation: allConversations, // array of { question, answer }
      chat,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get conversation of a chat
export const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.find({ chat: req.params.id });

    if (!conversation || conversation.length === 0)
      return res.status(404).json({ message: "No conversation with this id" });

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Delete chat
export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat)
      return res.status(404).json({ message: "No chat with this id" });

    if (chat.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await chat.deleteOne();

    // Optional: delete all conversations of this chat
    await Conversation.deleteMany({ chat: chat._id });

    res.json({ message: "Chat Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
