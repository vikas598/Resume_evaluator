import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { motion } from "framer-motion";

import { FaRobot, FaUserCircle, FaPaperPlane } from "react-icons/fa";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, loading, autoScroll]);

  const threadId = localStorage.getItem("thread_id");
  const token = localStorage.getItem("token");

  const handleScroll = () => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const threshold = 250;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      threshold;

    setAutoScroll(isNearBottom);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!threadId) {
      alert("Thread ID not found. Please upload a resume first.");
      return;
    }

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = input;
    setInput("");

    try {
      setLoading(true);

      const response = await api.post(
        "/chat",
        {
          thread_id: threadId,
          message: currentMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const assistantMessage = {
        role: "assistant",
        content: response.data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error.response?.data || error.message);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="h-screen bg-slate-100 flex flex-col pt-20">
        {/* Chat Messages */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto"
        >
          <div className="max-w-4xl mx-auto w-full p-6 pb-40">
            {messages.length === 0 && (
              <div className="text-center mt-16">
                <div className="text-7xl mb-4">🤖</div>

                <h1 className="text-5xl font-bold text-blue-600">
                  AI Resume Assistant
                </h1>

                <p className="mt-5 text-gray-500 text-lg">
                  Ask anything about your resume, evaluation or interview
                  preparation.
                </p>

                <div className="flex flex-wrap justify-center gap-3 mt-10">
                  {[
                    "Why is my score low?",
                    "Which skills are missing?",
                    "Improve my resume",
                    "Generate interview questions",
                    "ATS Tips",
                  ].map((question) => (
                    <button
                      key={question}
                      onClick={() => setInput(question)}
                      className="bg-white px-5 py-3 rounded-full shadow hover:shadow-lg hover:scale-105 transition"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex mb-6 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-start gap-3 max-w-3xl">
                  {msg.role === "assistant" && (
                    <div className="text-blue-600 text-3xl mt-1">
                      <FaRobot />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-5 py-4 shadow-md ${
                      msg.role === "assistant"
                        ? "bg-white text-gray-800"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    <div className="prose max-w-none prose-slate">
                      <div className="prose max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>

                  {msg.role === "user" && (
                    <div className="text-blue-600 text-3xl mt-1">
                      <FaUserCircle />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {loading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white shadow rounded-xl px-4 py-3 text-gray-500">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600 text-3xl">
                      <FaRobot />
                    </div>
                    <div className="bg-white rounded-2xl shadow-md px-5 py-4">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef}></div>
          </div>
        </div>

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
          <div className="max-w-5xl mx-auto p-5 flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your resume..."
              className="flex-1 rounded-full border px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="w-14 h-14 rounded-full bg-blue-600 text-white flex justify-center items-center hover:bg-blue-700 transition"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
