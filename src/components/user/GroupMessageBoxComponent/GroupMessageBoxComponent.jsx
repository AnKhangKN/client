import React, { useState, useRef, useEffect } from "react";
import { PiFilesLight, PiImagesSquareLight } from "react-icons/pi";
import { VscSend } from "react-icons/vsc";
import { IoClose } from "react-icons/io5";

const GroupMessageBoxComponent = ({ handleCloseMessageGroupBox }) => {
  // Danh sách tin nhắn
  const [messages, setMessages] = useState([
    { id: 1, text: "Xin chào mọi người 👋", sender: "them", author: "An" },
    { id: 2, text: "Chào An nha 😄", sender: "them", author: "Bình" },
    { id: 3, text: "Hello cả nhóm!", sender: "me", author: "Tôi" },
  ]);

  const [inputValue, setInputValue] = useState("");
  const messageEndRef = useRef(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Gửi tin nhắn
  const handleSend = () => {
    if (inputValue.trim() === "") return;

    const newMsg = {
      id: Date.now(),
      text: inputValue.trim(),
      sender: "me",
      author: "Tôi",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
  };

  // Nhấn Enter để gửi
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-12 lg:bottom-0 right-5 lg:right-20 w-96">
      <div className="bg-white flex flex-col lg:shadow-2xl border border-gray-200 rounded-t-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-3 bg-gray-50">
          <div className="flex gap-2 items-center">
            <div className="h-10 w-10 rounded-full bg-gray-300"></div>
            <div className="flex flex-col">
              <div className="font-semibold text-gray-800">Nhóm Lập Trình</div>
              <div className="text-xs text-gray-500">
                3 thành viên đang hoạt động
              </div>
            </div>
          </div>

          <div
            onClick={handleCloseMessageGroupBox}
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
                className={`flex flex-col ${
                  msg.sender === "me" ? "items-end" : "items-start"
                }`}
              >
                {/* Hiển thị tên người gửi nếu không phải là mình */}
                {msg.sender !== "me" && (
                  <div className="text-xs text-gray-500 ml-1 mb-0.5">
                    {msg.author}
                  </div>
                )}

                {/* Tin nhắn */}
                <div
                  className={`px-3 py-1.5 rounded-2xl max-w-[75%] text-sm whitespace-pre-wrap ${
                    msg.sender === "me"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  style={{ wordBreak: "break-word" }}
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
            <textarea
              rows="1"
              placeholder="Nhập tin nhắn..."
              className="flex-1 outline-none text-sm resize-none overflow-hidden"
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

export default GroupMessageBoxComponent;
