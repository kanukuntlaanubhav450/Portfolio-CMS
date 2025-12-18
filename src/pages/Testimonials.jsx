import { useState, useEffect } from "react";
import { api } from "../api/client";
import { Plus, Trash2, Edit2, X } from "lucide-react";

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: "", role: "", quote: "", image: "" });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        try {
            const data = await api.get("/testimonials");
            setTestimonials(data);
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
            setFormData({ ...formData, image: data.url });
        } catch (error) {
            // Error already handled in api client
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await api.put(`/testimonials/${editingItem.id}`, formData);
            } else {
                await api.post("/testimonials", formData);
            }
            setShowForm(false);
            setEditingItem(null);
            setFormData({ name: "", role: "", quote: "", image: "" });
            loadTestimonials();
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
            await api.delete(`/testimonials/${id}`);
            loadTestimonials();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Testimonials</h2>
                <button
                    onClick={() => { setShowForm(!showForm); setEditingItem(null); setFormData({ name: "", role: "", quote: "", image: "" }); }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    <span className="ml-2">{showForm ? "Cancel" : "Add Testimonial"}</span>
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded shadow mb-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Role / Company</label>
                                <input required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium">Quote</label>
                                <textarea required value={formData.quote} onChange={e => setFormData({ ...formData, quote: e.target.value })} className="w-full mt-1 p-2 border rounded" rows="3"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Photo</label>
                                <div className="space-y-2 mt-1">
                                    <input type="file" onChange={handleImageUpload} className="w-full text-sm" />
                                    <div className="text-center text-xs text-gray-400">OR</div>
                                    <input
                                        type="text"
                                        placeholder="Paste Photo URL"
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full p-2 border rounded text-sm"
                                    />
                                </div>
                                {formData.image && <img src={formData.image} alt="Preview" className="h-16 w-16 rounded-full mt-2 object-cover" />}
                            </div>
                        </div>
                        <button type="submit" disabled={uploading} className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            {editingItem ? "Update" : "Save"}
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow p-6 flex gap-4 relative">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                            {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : null}
                        </div>
                        <div>
                            <p className="italic text-gray-600 mb-2">"{item.quote}"</p>
                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-500">{item.role}</p>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-1">
                            <button onClick={() => startEdit(item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
