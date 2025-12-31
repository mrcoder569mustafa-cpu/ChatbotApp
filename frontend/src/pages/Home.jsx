import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
import Header from "../components/Header";
import { ChatData } from "../context/ChatContext";

import { CgProfile } from "react-icons/cg";
import { FaRobot } from "react-icons/fa";
import { LoadingBig, LoadingSmall } from "../components/Loading";
import { IoMdSend } from "react-icons/io";




const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const {
    fetchResponse,
    messages,
    prompt,
    setPrompt,
    newRequestLoading,
    loading,
    chats,
    selected,
  } = ChatData();

  const messageContainerRef = useRef();

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return; // Empty prompt na bheje
    if (!selected) return alert("Select a chat first!");
    fetchResponse();
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 flex-col">
        {/* Hamburger for mobile */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-4 bg-gray-800 text-2xl"
        >
          <GiHamburgerMenu />
        </button>

        {/* Main chat area */}
        <div className="flex-1 p-6 mb-20 md:mb-0">
          <Header />

          {loading ? (
            <LoadingBig />
          ) : (
            <div
              className="flex-1 max-h-[600px] overflow-y-auto mb-20 md:mb-0 thin-scrollbar"
              ref={messageContainerRef}
            >
              {messages.length > 0 ? (
                messages.map((msg, idx) => (
                  <div key={idx}>
                    {/* User question */}
                    <div className="mb-4 p-4 rounded bg-blue-700 flex gap-2">
                      <div className="bg-white p-2 rounded-full text-black text-2xl h-10 flex items-center justify-center">
                        <CgProfile />
                      </div>
                      {msg.question}
                    </div>

                    {/* Bot answer */}
                    <div className="mb-4 p-4 rounded bg-gray-700 flex gap-2">
                      <div className="bg-white p-2 rounded-full text-black text-2xl h-10 flex items-center justify-center">
                        <FaRobot />
                      </div>
                      <p dangerouslySetInnerHTML={{ __html: msg.answer }} />
                    </div>
                  </div>
                ))
              ) : (
                <p>No chat yet</p>
              )}

              {newRequestLoading && <LoadingSmall />}
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      {chats.length > 0 && selected && (
        <div className="fixed bottom-0 right-0 left-0 md:left-auto p-4 bg-gray-900 w-full md:w-[75%]">
          <form
            onSubmit={submitHandler}
            className="flex justify-center items-center"
          >
            <input
              type="text"
              placeholder="Enter a prompt here"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-grow p-4 bg-gray-700 rounded-l text-white outline-none"
            />
            <button
              type="submit"
              className="p-4 bg-gray-700 rounded-r text-2xl text-white"
            >
              <IoMdSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;
