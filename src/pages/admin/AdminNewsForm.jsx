import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave, FiArrowLeft, FiUploadCloud } from "react-icons/fi";
import { Loader } from "lucide-react";
import JoditEditor from 'jodit-react';
import { API_BASE_URL } from "../../config";

const LANG_LABELS = { uz: "O'zbekcha", ru: "Русский", en: "English" };

export default function AdminNewsForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("uz"); // 'uz', 'ru', 'en'

    const [formData, setFormData] = useState({
        // Common
        date: new Date().toISOString().split('T')[0],
        category: "Yangilik",
        image: null,

        // Translated Fields (uz)
        title_uz: "", description_uz: "",

        // Translated Fields (ru)
        title_ru: "", description_ru: "",

        // Translated Fields (en)
        title_en: "", description_en: "",
    });

    useEffect(() => {
        if (isEdit) {
            axios.get(`${API_BASE_URL}/api/news/${id}/`)
                .then(res => {
                    const data = res.data;
                    setFormData({
                        date: data.date,
                        category: data.category,
                        image: null,

                        title_uz: data.title_uz || "", description_uz: data.description_uz || "",
                        title_ru: data.title_ru || "", description_ru: data.description_ru || "",
                        title_en: data.title_en || "", description_en: data.description_en || "",
                    });
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    alert("Yangilikni yuklashda xatolik!");
                    navigate("/admin-panel/news");
                });
        }
    }, [id, isEdit, navigate]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();

        // Append all text fields
        Object.keys(formData).forEach(key => {
            if (['image'].includes(key)) return;
            data.append(key, formData[key]);
        });

        // Handle file
        if (formData.image) data.append("image", formData.image);

        try {
            if (isEdit) {
                if (!formData.image) data.delete("image");
                await axios.patch(`${API_BASE_URL}/api/news/${id}/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post(`${API_BASE_URL}/api/news/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate("/admin-panel/news");
        } catch (error) {
            console.error("Save error:", error);
            alert("Saqlashda xatolik! " + (error.response?.data?.detail || JSON.stringify(error.response?.data)));
        } finally {
            setSubmitting(false);
        }
    };

    const categories = ["Yangilik", "E'lon", "Tadbir", "Yangi", "Texnik", "Xizmat"];

    const config = useMemo(() => ({
        readonly: false,
        placeholder: "Matnni kiriting...",
        uploader: {
            insertImageAsBase64URI: true
        },
        height: 400
    }), []);

    if (loading) return <div className="flex justify-center p-20"><Loader className="animate-spin" style={{ color: "var(--color-accent)" }} /></div>;

    const renderLanguageFields = (lang) => (
        <div className="space-y-4">
            <div className="field">
                <label>Sarlavha ({lang.toUpperCase()})</label>
                <input required={lang === 'uz'} name={`title_${lang}`} value={formData[`title_${lang}`]} onChange={handleChange} type="text" className="input" />
            </div>

            <div className="field">
                <label>Matn ({lang.toUpperCase()})</label>
                <JoditEditor
                    value={formData[`description_${lang}`]}
                    config={{ ...config, placeholder: `${lang.toUpperCase()} tilidagi matn...` }}
                    onBlur={newContent => setFormData(prev => ({ ...prev, [`description_${lang}`]: newContent }))}
                />
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate("/admin-panel/news")} className="btn btn-icon btn-secondary">
                    <FiArrowLeft size={16} />
                </button>
                <h1 className="text-2xl">{isEdit ? "Yangilikni tahrirlash" : "Yangi yangilik qo'shish"}</h1>
            </div>

            <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-8">

                {/* Common Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="field">
                        <label>Kategoriya</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="input">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="field">
                        <label>Sana</label>
                        <input required name="date" value={formData.date} onChange={handleChange} type="date" className="input" />
                    </div>
                </div>

                {/* Language Tabs */}
                <div className="space-y-2">
                    <div className="seg w-fit mb-4">
                        {['uz', 'ru', 'en'].map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                onClick={() => setActiveTab(lang)}
                                className="seg-opt"
                                style={{
                                    border: "none", background: "transparent", font: "inherit",
                                    ...(activeTab === lang ? { color: "var(--color-accent)", boxShadow: "inset 0 0 0 1px var(--color-accent)" } : {}),
                                }}
                            >
                                {LANG_LABELS[lang]}
                            </button>
                        ))}
                    </div>
                    <div style={{ border: "1px solid var(--color-divider)", borderRadius: "var(--radius-md)", padding: "var(--space-4)" }}>
                        {activeTab === 'uz' && renderLanguageFields('uz')}
                        {activeTab === 'ru' && renderLanguageFields('ru')}
                        {activeTab === 'en' && renderLanguageFields('en')}
                    </div>
                </div>

                {/* File Upload */}
                <div className="field">
                    <label>Rasm (Muqova)</label>
                    <div style={{ border: "1px dashed var(--color-divider)", borderRadius: "var(--radius-md)" }} className="p-4 text-center cursor-pointer relative h-32 flex flex-col items-center justify-center">
                        <input name="image" onChange={handleChange} type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <FiUploadCloud size={22} className="text-muted mb-2" />
                        <span className="text-xs text-muted break-all px-2">{formData.image?.name || "Rasm yuklash (Ixtiyoriy)"}</span>
                    </div>
                </div>

                <div className="pt-6 flex justify-end gap-3" style={{ borderTop: "1px solid var(--color-divider)" }}>
                    <button type="button" onClick={() => navigate("/admin-panel/news")} className="btn btn-secondary">Bekor qilish</button>
                    <button disabled={submitting} type="submit" className="btn btn-primary">
                        {submitting ? <Loader className="animate-spin" size={16} /> : <FiSave size={16} />}
                        {isEdit ? "Saqlash" : "Qo'shish"}
                    </button>
                </div>

            </form>
        </div>
    );
}
