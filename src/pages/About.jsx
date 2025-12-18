import { useState, useEffect } from "react";
import { api } from "../api/client";

export default function About() {
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        bio: "",
        image: "",
        email: "",
        phone: "",
        location: "",
        github: "",
        linkedin: "",
        twitter: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadAbout();
    }, []);

    const loadAbout = async () => {
        try {
            const data = await api.get("/about");
            if (data && data.name) {
                setFormData(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
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
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put("/about", formData);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Edit Profile / About</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 flex flex-col items-center mb-4">
                        <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden mb-2">
                            {formData.image ? <img src={formData.image} alt="Profile" className="w-full h-full object-cover" /> : null}
                        </div>
                        <div className="space-y-3 w-full max-w-xs mx-auto">
                            <div className="border border-dashed border-gray-300 rounded p-2 text-center text-xs">
                                <label className="cursor-pointer block">
                                    <span className="text-blue-600">Upload File</span>
                                    <input type="file" onChange={handleImageUpload} className="hidden" />
                                </label>
                            </div>
                            <div className="text-center text-xs text-gray-400">- OR -</div>
                            <input
                                type="text"
                                placeholder="Paste Image URL"
                                value={formData.image}
                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                                className="w-full p-2 border rounded text-xs"
                            />
                            {uploading && <span className="text-blue-500 text-xs block text-center">Uploading...</span>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Full Name</label>
                        <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Job Title</label>
                        <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Bio</label>
                        <textarea required value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full mt-1 p-2 border rounded" rows="4"></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Phone</label>
                        <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Location</label>
                        <input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">GitHub URL</label>
                        <input value={formData.github} onChange={e => setFormData({ ...formData, github: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">LinkedIn URL</label>
                        <input value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Twitter / X URL</label>
                        <input value={formData.twitter} onChange={e => setFormData({ ...formData, twitter: e.target.value })} className="w-full mt-1 p-2 border rounded" />
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button type="submit" disabled={saving || uploading} className="px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
