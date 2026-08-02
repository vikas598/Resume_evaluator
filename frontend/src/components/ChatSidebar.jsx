import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import api from "../services/api";

function ChatSidebar({ open, onClose }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchThreads = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get("/threads", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setThreads(response.data);
    } catch (error) {
      console.error("Failed to fetch threads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchThreads();
    }
  }, [open]);

  const openThread = (threadId) => {
    onClose();
    navigate(`/chat/${threadId}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed left-0 right-0 bottom-0 top-[80px] bg-black/40 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-[80px] left-0 bottom-0 w-80 bg-white shadow-2xl z-40 flex flex-col"
            initial={{ x: -350 }}
            animate={{ x: 0 }}
            exit={{ x: -350 }}
            transition={{ duration: 0.25 }}
          >
            <div className="p-5 border-b">
              <h2 className="text-2xl font-bold text-evaluate">
                Chats
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <p className="text-gray-500">Loading chats...</p>
              ) : threads.length === 0 ? (
                <p className="text-gray-500">No previous chats.</p>
              ) : (
                threads.map((thread) => (
                  <button
                    key={thread.thread_id}
                    onClick={() => openThread(thread.thread_id)}
                    className="w-full text-left px-3 py-3 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  >
                    <p className="font-medium truncate">
                      {thread.title}
                    </p>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ChatSidebar;