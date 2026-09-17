import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../common/AdminsSidebar";
import { RiMenuLine } from "react-icons/ri";
import "./AdminLayout.css";

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="admin-layout">

            {/* Sidebar */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Mobile Header */}
            <header className="admin-mobile-header">

                <button
                    onClick={() => setSidebarOpen(true)}
                    className="admin-mobile-menu-btn"
                >
                    <RiMenuLine size={25} />
                </button>

                <span className="admin-mobile-logo">
                    SkillSync Admin
                </span>

            </header>

            {/* Main Content */}
            <main className="admin-main-content">
                <div className="admin-page-container">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};

export default AdminLayout;