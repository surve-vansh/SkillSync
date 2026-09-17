import { useState } from "react";
import { Outlet } from "react-router-dom";
import { RiMenuLine } from "react-icons/ri";
import MentorSidebar from "../common/MentorSidebar";
import "./MentorLayout.css";

const MentorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="mentor-layout">
      <MentorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <header className="mentor-mobile-header">
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <RiMenuLine size={26} />
        </button>

        <span className="mobile-logo">SkillSync</span>
      </header>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="mentor-main-content">
        <div className="mentor-page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MentorLayout;
