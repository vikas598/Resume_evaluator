import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

import api from "../services/api";

function ChatSidebar({ open, onClose }) {
  const [renameId, setRenameId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

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
  const activeThreadId =
  location.pathname.startsWith("/chat/")
    ? location.pathname.split("/").pop()
    : null;

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


  const renameThread = async () => {
    try {
        const token = localStorage.getItem("token");

        await api.patch(
        `/threads/${renameId}`,
        {
            title: newTitle,
        },
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );

        setRenameId(null);
        setMenuOpen(null);

        fetchThreads();

        window.dispatchEvent(new Event("threadUpdated"));
    } catch (error) {
        console.error(error);
    }
    };

  const deleteThread = async (threadId) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this chat?"
    );

    if (!confirmed) return;

    try {
        const token = localStorage.getItem("token");

        await api.delete(`/threads/${threadId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        setMenuOpen(null);

        fetchThreads();

        window.dispatchEvent(new Event("threadUpdated"));
    } catch (error) {
        console.error(error);
    }
    };
const openThread = (threadId) => {
  onClose();
  if (threadId === activeThreadId) return;
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
                        className={`group relative flex items-center justify-between px-3 py-3 rounded-lg transition ${
                        activeThreadId === thread.thread_id
                            ? "bg-evaluate/10"
                            : "hover:bg-gray-100"
                        }`}
                  >
                    <button
                      onClick={() => openThread(thread.thread_id)}
                      className="flex-1 text-left truncate"
                    >
                      <p
                        className={`font-medium truncate ${
                            activeThreadId === thread.thread_id
                            ? "text-evaluate"
                            : ""
                        }`}
                        >
                        📝 {thread.title}
                      </p>
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
                        <button
                        onClick={() => {
                            setRenameId(thread.thread_id);
                            setNewTitle(thread.title);
                            setMenuOpen(null);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                        Rename
                        </button>

                        <button
                        onClick={() => deleteThread(thread.thread_id)}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                        >
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
      {renameId && (
        <>
            <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setRenameId(null)}
            />

            <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-96 p-6">
                <h2 className="text-xl font-semibold mb-4">
                Rename Chat
                </h2>

                <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                />

                <div className="flex justify-end gap-3 mt-5">
                <button
                    onClick={() => setRenameId(null)}
                    className="px-4 py-2 rounded-lg border"
                >
                    Cancel
                </button>

                <button
                    onClick={renameThread}
                    className="px-4 py-2 rounded-lg bg-evaluate text-white"
                >
                    Save
                </button>
                </div>
            </div>
            </div>
        </>
        )}
    </AnimatePresence>
  );
}

export default ChatSidebar;
