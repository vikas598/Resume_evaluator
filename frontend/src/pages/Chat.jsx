import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const threadId = localStorage.getItem("thread_id");
    const token = localStorage.getItem("token");

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
                }
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

            <div className="min-h-screen bg-slate-100 flex flex-col">

                {/* Chat Messages */}
                <div className="flex-1 max-w-4xl mx-auto w-full p-6 overflow-y-auto">

                    {messages.length === 0 && (
                        <div className="text-center mt-20">
                            <h1 className="text-4xl font-bold text-blue-600">
                                AI Resume Assistant
                            </h1>

                            <p className="text-gray-500 mt-4">
                                Ask anything about your resume or evaluation.
                            </p>

                            <div className="mt-8 flex flex-wrap justify-center gap-3">
                                <button
                                    onClick={() => setInput("Why is my score low?")}
                                    className="bg-white px-4 py-2 rounded-full shadow hover:bg-gray-100"
                                >
                                    Why is my score low?
                                </button>

                                <button
                                    onClick={() => setInput("Which skills are missing?")}
                                    className="bg-white px-4 py-2 rounded-full shadow hover:bg-gray-100"
                                >
                                    Which skills are missing?
                                </button>

                                <button
                                    onClick={() => setInput("How can I improve my resume?")}
                                    className="bg-white px-4 py-2 rounded-full shadow hover:bg-gray-100"
                                >
                                    Improve my resume
                                </button>
                            </div>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex mb-4 ${
                                msg.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-xl px-4 py-3 rounded-xl ${
                                    msg.role === "user"
                                        ? "bg-blue-600 text-white"
                                        : "bg-white shadow text-gray-800"
                                }`}
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex justify-start mb-4">
                            <div className="bg-white shadow rounded-xl px-4 py-3 text-gray-500">
                                🤖 Thinking...
                            </div>
                        </div>
                    )}

                </div>

                {/* Input Area */}
                <div className="bg-white border-t p-4">

                    <div className="max-w-4xl mx-auto flex gap-3">

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your resume..."
                            className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !loading) {
                                    handleSend();
                                }
                            }}
                        />

                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className={`px-6 rounded-lg text-white transition ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {loading ? "Sending..." : "Send"}
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default Chat;