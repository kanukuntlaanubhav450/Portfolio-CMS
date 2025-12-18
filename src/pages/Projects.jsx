import { useState, useEffect } from "react";
import { api } from "../api/client";
import { Plus, Trash2, Edit2, X } from "lucide-react";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", image: "", link: "", tags: "" });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await api.get("/projects");
            setProjects(data);
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
            const payload = { ...formData, tags: formData.tags.split(',').map(t => t.trim()) };
            if (editingProject) {
                await api.put(`/projects/${editingProject.id}`, payload);
            } else {
                await api.post("/projects", payload);
            }
            setShowForm(false);
            setEditingProject(null);
            setFormData({ title: "", description: "", image: "", link: "", tags: "" });
            loadProjects();
        } catch (error) {
            console.error(error);
        }
    };

    const startEdit = (project) => {
        setEditingProject(project);
        setFormData({ ...project, tags: project.tags ? project.tags.join(', ') : '' });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure?")) {
            await api.delete(`/projects/${id}`);
            loadProjects();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Projects</h2>
                <button
                    onClick={() => { setShowForm(!showForm); setEditingProject(null); setFormData({ title: "", description: "", image: "", link: "", tags: "" }); }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    <span className="ml-2">{showForm ? "Cancel" : "Add Project"}</span>
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded shadow mb-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Title</label>
                                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Link</label>
                                <input value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium">Description</label>
                                <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full mt-1 p-2 border rounded" rows="3"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Tags (comma separated)</label>
                                <input value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Image</label>
                                <div className="space-y-3">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                                        <input type="file" onChange={handleImageUpload} className="hidden" id="image-upload" />
                                        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2 text-gray-600">
                                            <span>Click to Upload Image</span>
                                            <span className="text-xs text-gray-400">or</span>
                                        </label>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500">OR Paste URL</span>
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        placeholder="https://example.com/image.jpg"
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                {uploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
                                {formData.image && (
                                    <div className="mt-3 relative group w-fit">
                                        <img src={formData.image} alt="Preview" className="h-24 rounded border shadow-sm object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, image: '' })}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button type="submit" disabled={uploading} className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            {editingProject ? "Update Project" : "Save Project"}
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden">
                        {project.image && <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />}
                        <div className="p-4">
                            <h3 className="font-bold text-lg">{project.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {project.tags && project.tags.map((tag, i) => (
                                    <span key={i} className="text-xs bg-gray-200 px-2 py-1 rounded">{tag}</span>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <button onClick={() => startEdit(project)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                                <button onClick={() => handleDelete(project.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
