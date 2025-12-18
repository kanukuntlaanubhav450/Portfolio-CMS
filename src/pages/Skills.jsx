import { useState, useEffect } from "react";
import { api } from "../api/client";
import { Plus, Trash2, Edit2, X } from "lucide-react";

export default function Skills() {
    const [skills, setSkills] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [formData, setFormData] = useState({ name: "", level: "Beginner", icon: "" });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            const data = await api.get("/skills");
            setSkills(data);
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
            // Error already handled in api client
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSkill) {
                await api.put(`/skills/${editingSkill.id}`, formData);
            } else {
                await api.post("/skills", formData);
            }
            setShowForm(false);
            setEditingSkill(null);
            setFormData({ name: "", level: "Beginner", icon: "" });
            loadSkills();
        } catch (error) {
            console.error(error);
        }
    };

    const startEdit = (skill) => {
        setEditingSkill(skill);
        setFormData(skill);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure?")) {
            await api.delete(`/skills/${id}`);
            loadSkills();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Skills</h2>
                <button
                    onClick={() => { setShowForm(!showForm); setEditingSkill(null); setFormData({ name: "", level: "Beginner", icon: "" }); }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    <span className="ml-2">{showForm ? "Cancel" : "Add Skill"}</span>
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded shadow mb-6 max-w-lg">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium">Skill Name</label>
                            <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium">Proficiency Level</label>
                            <select value={formData.level} onChange={e => setFormData({ ...formData, level: e.target.value })} className="w-full mt-1 p-2 border rounded">
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                                <option>Expert</option>
                            </select>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium">Icon / Logo</label>
                            <div className="space-y-2 mt-2">
                                <div className="border border-dashed border-gray-300 rounded p-2 text-center">
                                    <label className="cursor-pointer text-sm text-blue-600">
                                        Upload Icon File
                                        <input type="file" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                </div>
                                <div className="text-center text-xs text-gray-400">OR</div>
                                <input
                                    type="text"
                                    placeholder="Paste Icon URL"
                                    value={formData.icon}
                                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full p-2 border rounded text-sm"
                                />
                            </div>
                            {uploading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}
                            {formData.icon && <img src={formData.icon} alt="Preview" className="h-10 mt-2" />}
                        </div>
                        <button type="submit" disabled={uploading} className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full">
                            {editingSkill ? "Update Skill" : "Save Skill"}
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {skills.map(skill => (
                    <div key={skill.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                        {skill.icon ? <img src={skill.icon} alt={skill.name} className="h-12 w-12 object-contain" /> : <div className="h-12 w-12 bg-gray-200 rounded-full"></div>}
                        <h3 className="font-bold mt-2">{skill.name}</h3>
                        <span className="text-xs text-gray-500">{skill.level}</span>
                        <div className="mt-3 flex gap-2">
                            <button onClick={() => startEdit(skill)} className="text-blue-600"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(skill.id)} className="text-red-600"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
