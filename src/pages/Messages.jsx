import { useState, useEffect } from "react";
import { api } from "../api/client";

export default function Messages() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const data = await api.get("/contact");
            setMessages(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Messages</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {messages.length === 0 && <li className="p-6 text-center text-gray-500">No messages found.</li>}
                    {messages.map((msg) => (
                        <li key={msg.id}
                            className={`block hover:bg-gray-50 ${!msg.read ? 'bg-blue-50' : ''}`}
                            onClick={() => {
                                if (!msg.read) {
                                    api.put(`/contact/${msg.id}/read`, {}).then(() => {
                                        setMessages(msgs => msgs.map(m => m.id === msg.id ? { ...m, read: true } : m));
                                    });
                                }
                            }}
                        >
                            <div className="px-4 py-4 sm:px-6 cursor-pointer">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-blue-600 truncate">
                                        {msg.name} ({msg.email})
                                        {!msg.read && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">New</span>}
                                    </p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="text-sm text-gray-900">{msg.message}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
