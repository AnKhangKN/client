import React, { useState, useRef, useEffect } from "react";
import { PiFilesLight, PiImagesSquareLight } from "react-icons/pi";
import { VscSend } from "react-icons/vsc";
import { IoClose } from "react-icons/io5";

const MessageBoxComponent = ({ handleCloseMessageBox, userName }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: `Xin chào ${userName}!`, sender: "them" },
    { id: 2, text: "Chào bạn 👋", sender: "me" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messageEndRef = useRef(null);

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() === "") return;

    const newMsg = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: "me",
    };
    setMessages([...messages, newMsg]);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-12 lg:bottom-0 lg:right-20 right-5 w-96">
      <div className="bg-white flex flex-col border border-gray-200 lg:shadow-2xl rounded-t-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-3 bg-gray-50">
          <div className="flex gap-2 items-center">
            <div className="h-10 w-10 rounded-full bg-gray-300"></div>
            <div className="flex flex-col">
              <div className="font-semibold text-gray-800">Người dùng</div>
              <div className="text-xs text-gray-500">Đang hoạt động</div>
            </div>
          </div>

          <div
            onClick={handleCloseMessageBox}
            className="text-gray-600 hover:text-red-500 cursor-pointer text-xl"
          >
            <IoClose />
          </div>
        </div>

        {/* Message body */}
        <div className="p-3 bg-gray-50">
          <div className="overflow-y-auto max-h-96 h-96 flex flex-col gap-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-1.5 rounded-2xl max-w-[75%] text-sm break-words whitespace-pre-wrap ${
                    msg.sender === "me"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="flex items-center justify-between border-t border-gray-200 p-2 bg-white">
          {/* Icons */}
          <div className="flex items-center gap-2">
            <div className="text-green-600 p-1 text-2xl hover:bg-gray-200 rounded-full cursor-pointer">
              <PiImagesSquareLight />
            </div>
            <div className="text-indigo-600 p-1 text-2xl hover:bg-gray-200 rounded-full cursor-pointer">
              <PiFilesLight />
            </div>
          </div>

          {/* Input + Send */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1 w-64">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 outline-none text-sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div
              className="text-indigo-600 p-1 text-xl cursor-pointer hover:text-indigo-800"
              onClick={handleSend}
            >
              <VscSend />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBoxComponent;
