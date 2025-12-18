import { useAuth } from "../context/AuthContext";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Wrench, User, FileText, Briefcase, MessageSquare, LogOut, Settings } from 'lucide-react';

export default function Layout() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const navItems = [
        { path: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
        { path: "/projects", icon: <FolderKanban size={20} />, label: "Projects" },
        { path: "/skills", icon: <Wrench size={20} />, label: "Skills" },
        { path: "/about", icon: <User size={20} />, label: "About" },
        { path: "/blogs", icon: <FileText size={20} />, label: "Blogs" },
        { path: "/experience", icon: <Briefcase size={20} />, label: "Experience" },
        { path: "/testimonials", icon: <MessageSquare size={20} />, label: "Testimonials" },
        { path: "/services", icon: <Settings size={20} />, label: "Services" },
        { path: "/messages", icon: <MessageSquare size={20} />, label: "Messages" },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold">Admin Panel</div>
                <nav className="flex-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-6 py-3 hover:bg-slate-800 transition-colors ${location.pathname === item.path ? "bg-slate-800 border-r-4 border-blue-500" : ""
                                }`}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded transition-colors"
                    >
                        <LogOut size={20} className="mr-3" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {navItems.find(i => i.path === location.pathname)?.label || "Dashboard"}
                        </h1>
                    </div>
                </header>
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
