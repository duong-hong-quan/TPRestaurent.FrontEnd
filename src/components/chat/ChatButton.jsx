import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import AI from "../../assets/imgs/AI.png";
import useCallApi from "../../api/useCallApi";

// Fake chat data
const initialMessages = [
  {
    id: 1,
    text: "Chào bạn tôi là trợ lý ảo AI của nhà hàng Thiên Phú",
    sender: "bot",
  },
  {
    id: 2,
    text: "Bạn cần tôi giúp đỡ gì không?",
    sender: "bot",
  },
];

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);
  const { callApi, loading } = useCallApi();

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: newMessage, sender: "user" },
      ]);
      setNewMessage("");

      try {
        const response = await callApi(
          `chatbot/test-chat?message=${newMessage}`,
          "GET"
        );
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: response.result,
            sender: "bot",
          },
        ]);
      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "Failed to get response from AI. Please try again.",
            sender: "bot",
          },
        ]);
      }
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed z-50 bottom-[0.5rem] right-[0.5rem]">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-[400px] h-[550px]  flex flex-col">
          <div
            onClick={toggleChat}
            className="bg-red-900 flex justify-start items-center text-white rounded-tr-lg rounded-tl-lg px-4 py-2 cursor-pointer"
          >
            <img src={AI} alt="" className="h-12 w-12" />
            <span className="">MR.CHEF AI</span>
            <span className="bg-[#4F970F] animate-pulse h-3 w-3 rounded-full inline-block ml-2"></span>{" "}
          </div>
          <div
            ref={chatContainerRef}
            className="flex-grow p-4 overflow-y-auto bg-[#FFF9EF]"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === "user" ? "bg-gray-100" : "bg-red-100"
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
            {loading && (
              <div className="mb-2 text-left">
                <span className="inline-block p-2 text-white rounded-lg bg-red-500 animate-pulse">
                  Thinking...
                </span>
              </div>
            )}
          </div>
          <div className="p-4 border-t flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-xl mx-2"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-red-900 text-white p-2 rounded-xl hover:bg-red-800"
              disabled={loading}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={toggleChat}
          className="bg-red-900 animate-bounce flex justify-between items-center text-white rounded-tr-lg rounded-tl-lg px-4 py-2 cursor-pointer"
        >
          <img src={AI} alt="" className="h-12 w-12 object-cover" />
          <span className="animate-pulse ">MR.CHEF AI</span>
          <span className="bg-[#4F970F] animate-pulse h-3 w-3 rounded-full inline-block ml-2"></span>{" "}
        </div>
      )}
    </div>
  );
};

export default ChatButton;
