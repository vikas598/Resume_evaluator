import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import api from "../services/api";

function ChatSidebar({ open, onClose }) {
  const [menuOpen, setMenuOpen] = useState(null);
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

  useEffect(() => {
    const closeMenu = () => setMenuOpen(null);

    window.addEventListener("click", closeMenu);

    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, []);

  useEffect(() => {
    const handleThreadUpdate = () => {
      fetchThreads();
    };

    window.addEventListener("threadUpdated", handleThreadUpdate);

    return () => {
      window.removeEventListener("threadUpdated", handleThreadUpdate);
    };
  }, []);

  useEffect(() => {
    const refreshThreads = () => {
      fetchThreads();
    };

    window.addEventListener("threadUpdated", refreshThreads);

    return () => {
      window.removeEventListener("threadUpdated", refreshThreads);
    };
  }, []);

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
              <h2 className="text-2xl font-bold text-evaluate">Chats</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <p className="text-gray-500">Loading chats...</p>
              ) : threads.length === 0 ? (
                <p className="text-gray-500">No previous chats.</p>
              ) : (
                threads.map((thread) => (
                  <div
                    key={thread.thread_id}
                    className="group relative flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-100 transition"
                  >
                    <button
                      onClick={() => openThread(thread.thread_id)}
                      className="flex-1 text-left truncate"
                    >
                      <p className="font-medium truncate">📝 {thread.title}</p>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(
                          menuOpen === thread.thread_id
                            ? null
                            : thread.thread_id,
                        );
                      }}
                      className="opacity-0 group-hover:opacity-100 transition px-2 text-lg text-gray-500 hover:text-black"
                    >
                      ⋮
                    </button>

                    {menuOpen === thread.thread_id && (
                      <div className="absolute right-2 top-11 w-36 bg-white border rounded-lg shadow-lg z-50">
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                          Rename
                        </button>

                        <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
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
