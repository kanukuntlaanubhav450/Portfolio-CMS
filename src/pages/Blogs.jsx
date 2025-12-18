import { useState, useEffect } from "react";
import { api } from "../api/client";
import { Plus, Trash2, Edit2, X } from "lucide-react";

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formData, setFormData] = useState({ title: "", content: "", image: "", tags: "", summary: "" });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            const data = await api.get("/blogs");
            setBlogs(data);
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
            // Basic tag processing
            const processedTags = formData.tags.includes(',')
                ? formData.tags.split(',').map(t => t.trim())
                : formData.tags ? [formData.tags] : [];

            const payload = { ...formData, tags: processedTags };

            if (editingBlog) {
                await api.put(`/blogs/${editingBlog.id}`, payload);
            } else {
                await api.post("/blogs", payload);
            }
            setShowForm(false);
            setEditingBlog(null);
            setFormData({ title: "", content: "", image: "", tags: "", summary: "" });
            loadBlogs();
        } catch (error) {
            console.error(error);
        }
    };

    const startEdit = (blog) => {
        setEditingBlog(blog);
        setFormData({
            ...blog,
            tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure?")) {
            await api.delete(`/blogs/${id}`);
            loadBlogs();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Blogs</h2>
                <button
                    onClick={() => { setShowForm(!showForm); setEditingBlog(null); setFormData({ title: "", content: "", image: "", tags: "", summary: "" }); }}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    <span className="ml-2">{showForm ? "Cancel" : "Add Post"}</span>
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded shadow mb-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Title</label>
                                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Summary</label>
                                <textarea required value={formData.summary} onChange={e => setFormData({ ...formData, summary: e.target.value })} className="w-full mt-1 p-2 border rounded" rows="2"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Content (Markdown supported)</label>
                                <textarea required value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full mt-1 p-2 border rounded font-mono" rows="10"></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium">Tags</label>
                                    <input value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Cover Image</label>
                                    <div className="space-y-2 mt-1">
                                        <input type="file" onChange={handleImageUpload} className="w-full text-sm" />
                                        <div className="text-center text-xs text-gray-400">OR</div>
                                        <input
                                            type="text"
                                            placeholder="Paste Image URL"
                                            value={formData.image}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full p-2 border rounded text-sm"
                                        />
                                    </div>
                                    {uploading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}
                                    {formData.image && <img src={formData.image} alt="Preview" className="h-20 mt-2 rounded" />}
                                </div>
                            </div>
                        </div>
                        <button type="submit" disabled={uploading} className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                            {editingBlog ? "Update Post" : "Publish Post"}
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {blogs.map(blog => (
                    <div key={blog.id} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row gap-4">
                        {blog.image && <img src={blog.image} alt={blog.title} className="w-full md:w-48 h-32 object-cover rounded" />}
                        <div className="flex-1">
                            <h3 className="font-bold text-xl">{blog.title}</h3>
                            <p className="text-gray-500 text-sm">{new Date(blog.createdAt).toLocaleDateString()}</p>
                            <p className="text-gray-700 mt-2 line-clamp-2">{blog.summary}</p>
                            <div className="mt-2 flex gap-2">
                                {Array.isArray(blog.tags) && blog.tags.map(t => <span key={t} className="text-xs bg-gray-200 px-2 py-1 rounded">{t}</span>)}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 justify-center">
                            <button onClick={() => startEdit(blog)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={20} /></button>
                            <button onClick={() => handleDelete(blog.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={20} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
