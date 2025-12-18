import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

export default function Dashboard() {
    const [stats, setStats] = useState({ projects: 0, blogs: 0, messages: 0 });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [projectsData, blogsData, messagesData] = await Promise.all([
                api.get("/projects").catch(() => []),
                api.get("/blogs").catch(() => []),
                api.get("/contact").catch(() => [])
            ]);
            setStats({
                projects: projectsData.length,
                blogs: blogsData.length,
                messages: messagesData.filter(m => !m.read).length
            });
        } catch (error) {
            console.error("Failed to load stats:", error);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/projects" className="bg-white overflow-hidden shadow rounded-lg transform transition duration-500 hover:scale-105 block">
                <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.projects}</dd>
                </div>
            </Link>
            <Link to="/blogs" className="bg-white overflow-hidden shadow rounded-lg transform transition duration-500 hover:scale-105 block">
                <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Blog Posts</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.blogs}</dd>
                </div>
            </Link>
            <Link to="/messages" className="bg-white overflow-hidden shadow rounded-lg transform transition duration-500 hover:scale-105 block">
                <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Unread Messages</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.messages}</dd>
                </div>
            </Link>
        </div>
    );
}
