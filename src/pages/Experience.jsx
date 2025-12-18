import { useState, useEffect } from "react";
import { api } from "../api/client";
import { Plus, Trash2, Edit2, X } from "lucide-react";

export default function Experience() {
    const [experiences, setExperiences] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingExp, setEditingExp] = useState(null);
    const [formData, setFormData] = useState({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
        current: false
    });

    useEffect(() => {
        loadExperience();
    }, []);

    const loadExperience = async () => {
        try {
            const data = await api.get("/experience");
            setExperiences(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingExp) {
                await api.put(`/experience/${editingExp.id}`, formData);
            } else {
                await api.post("/experience", formData);
            }
            setShowForm(false);
            setEditingExp(null);
            setFormData({ company: "", position: "", startDate: "", endDate: "", description: "", current: false });
            loadExperience();
        } catch (error) {
            console.error(error);
        }
    };

    const startEdit = (exp) => {
        setEditingExp(exp);
        setFormData(exp);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure?")) {
            await api.delete(`/experience/${id}`);
            loadExperience();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Experience</h2>
                <button
                    onClick={() => { setShowForm(!showForm); setEditingExp(null); setFormData({ company: "", position: "", startDate: "", endDate: "", description: "", current: false }); }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    <span className="ml-2">{showForm ? "Cancel" : "Add Experience"}</span>
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded shadow mb-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Company</label>
                                <input required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Position</label>
                                <input required value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Start Date</label>
                                <input type="date" required value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">End Date</label>
                                <div className="flex items-center gap-2">
                                    <input type="date" disabled={formData.current} value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                                    <label className="flex items-center text-sm">
                                        <input type="checkbox" checked={formData.current} onChange={e => setFormData({ ...formData, current: e.target.checked, endDate: "" })} className="mr-1" />
                                        Current
                                    </label>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium">Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full mt-1 p-2 border rounded" rows="3"></textarea>
                            </div>
                        </div>
                        <button type="submit" className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            {editingExp ? "Update" : "Save"}
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {experiences.map(exp => (
                    <div key={exp.id} className="bg-white rounded-lg shadow p-6 relative">
                        <h3 className="font-bold text-xl text-gray-900">{exp.position}</h3>
                        <h4 className="text-lg text-blue-600">{exp.company}</h4>
                        <p className="text-sm text-gray-500 mb-2">
                            {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                        </p>
                        <p className="text-gray-700 whitespace-pre-line">{exp.description}</p>

                        <div className="absolute top-6 right-6 flex gap-2">
                            <button onClick={() => startEdit(exp)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(exp.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
