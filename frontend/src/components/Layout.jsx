import { useState } from "react";
import Navbar from "./Navbar";
import ChatSidebar from "./ChatSidebar";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar
        onOpenChats={() => setSidebarOpen(true)}
      />

      <ChatSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {children}
    </>
  );
}

export default Layout;