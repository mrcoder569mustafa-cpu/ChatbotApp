import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import toast from "react-hot-toast";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [newRequestLoading, setNewRequestLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [createLod, setCreateLod] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Gemini response via BACKEND
  const fetchResponse = async () => {
    if (!prompt.trim() || !selected) {
      return toast.error("Type a message and select a chat");
    }

    setNewRequestLoading(true);
    const question = prompt;
    setPrompt("");

    try {
      // POST request to Gemini backend
      const { data } = await axios.post(
        `${server}/api/gemini/chat`, // Updated route
        { prompt: question }
      );

      if (data?.candidates?.length > 0) {
        // Gemini API ka text extract karna
        const answer = data.candidates[0].content.parts[0].text;

        setMessages((prev) => [...prev, { question, answer }]);

        // Save chat conversation
        await axios.post(
          `${server}/api/chat/${selected}`,
          { question, answer },
          { headers: { token: localStorage.getItem("token") } }
        );
      } else {
        toast.error("AI response failed");
      }
    } catch (error) {
      console.error("Axios Error:", error.response || error.message);
      toast.error("AI response failed");
    } finally {
      setNewRequestLoading(false);
    }
  };

  // Fetch all chats
  const fetchChats = async () => {
    try {
      const { data } = await axios.get(`${server}/api/chat/all`, {
        headers: { token: localStorage.getItem("token") },
      });
      setChats(data);
      if (!selected && data.length > 0) setSelected(data[0]._id);
    } catch (error) {
      console.error("FetchChats Error:", error.response || error.message);
    }
  };

  // Fetch messages for selected chat
  const fetchMessages = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/chat/${selected}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setMessages(data.messages || []);
    } catch (error) {
      console.error("FetchMessages Error:", error.response || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new chat
  const createChat = async () => {
    setCreateLod(true);
    try {
      await axios.post(
        `${server}/api/chat/new`,
        {},
        { headers: { token: localStorage.getItem("token") } }
      );
      fetchChats();
    } catch (error) {
      console.error("CreateChat Error:", error.response || error.message);
      toast.error("Failed to create chat");
    } finally {
      setCreateLod(false);
    }
  };

  // Delete chat
  const deleteChat = async (id) => {
    try {
      await axios.delete(`${server}/api/chat/${id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      fetchChats();
    } catch (error) {
      console.error("DeleteChat Error:", error.response || error.message);
      toast.error("Failed to delete chat");
    }
  };

  // Auto fetch chats on mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Fetch messages when selected chat changes
  useEffect(() => {
    fetchMessages();
  }, [selected]);

  return (
    <ChatContext.Provider
      value={{
        fetchResponse,
        messages,
        prompt,
        setPrompt,
        newRequestLoading,
        chats,
        createChat,
        createLod,
        selected,
        setSelected,
        loading,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatData = () => useContext(ChatContext);
