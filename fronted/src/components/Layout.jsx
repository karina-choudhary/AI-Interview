import React, { useState, useEffect } from "react"; // FIX: useEffect import kiya
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function Layout() {
  const [showSidebar, setShowSidebar] = useState(false);
  
  // FIX: Internet connection track karne ke liye state
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    // Browser ke online/offline events listen karne ke liye
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <div className="layout">
      <Navbar setShowSidebar={setShowSidebar} />

      <div className="layout-body">
        <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        <main className="main-content">
          {/* FIX: Agar online hai toh page dikhao, nahi toh offline component */}
          {isOnline ? (
            <Outlet />
          ) : (
            <div className="offline-page">
              <h2>No Internet Connection</h2>
              <p>Please check your internet and try again.</p>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Layout;
