import { useState, useEffect } from "react";
import { api } from "../api/client";
import { Plus, Trash2, Edit2, X } from "lucide-react";

export default function Services() {
    const [services, setServices] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", icon: "" });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const data = await api.get("/services");
            setServices(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const data = await api.upload(file);
            setFormData({ ...formData, icon: data.url });
        } catch (error) {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await api.put(`/services/${editingItem.id}`, formData);
            } else {
                await api.post("/services", formData);
            }
            setShowForm(false);
            setEditingItem(null);
            setFormData({ title: "", description: "", icon: "" });
            loadServices();
        } catch (error) {
            console.error(error);
        }
    };

    const startEdit = (item) => {
        setEditingItem(item);
        setFormData(item);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure?")) {
            await api.delete(`/services/${id}`);
            loadServices();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Services</h2>
                <button
                    onClick={() => { setShowForm(!showForm); setEditingItem(null); setFormData({ title: "", description: "", icon: "" }); }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    <span className="ml-2">{showForm ? "Cancel" : "Add Service"}</span>
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded shadow mb-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Service Title</label>
                                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full mt-1 p-2 border rounded" rows="3"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Icon / Image</label>
                                <div className="space-y-2 mt-1">
                                    <input type="file" onChange={handleImageUpload} className="w-full text-sm" />
                                    <div className="text-center text-xs text-gray-400">OR</div>
                                    <input
                                        type="text"
                                        placeholder="Paste Icon URL"
                                        value={formData.icon}
                                        onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-full p-2 border rounded text-sm"
                                    />
                                </div>
                                {formData.icon && <img src={formData.icon} alt="Preview" className="h-16 w-16 mt-2 object-contain bg-gray-100 p-2 rounded" />}
                            </div>
                        </div>
                        <button type="submit" disabled={uploading} className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            {editingItem ? "Update" : "Save"}
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow p-6 text-center relative group">
                        <div className="mx-auto h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4">
                            {item.icon ? <img src={item.icon} alt={item.title} className="h-10 w-10 object-contain" /> : "?"}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                        <p className="mt-2 text-gray-500">{item.description}</p>

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <button onClick={() => startEdit(item)} className="p-1 text-blue-600 bg-white shadow rounded"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-1 text-red-600 bg-white shadow rounded"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
