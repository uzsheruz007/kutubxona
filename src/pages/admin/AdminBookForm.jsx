import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave, FiArrowLeft, FiUploadCloud } from "react-icons/fi";
import { Loader } from "lucide-react";
import { API_BASE_URL } from "../../config";
import { BOOK_CATEGORIES } from "../../constants/categories";

const LANG_LABELS = { uz: "O'zbekcha", ru: "Русский", en: "English" };

export default function AdminBookForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("uz"); // 'uz', 'ru', 'en'

    // Initial State including translated fields
    const [formData, setFormData] = useState({
        // Common
        page_count: 0,
        publication_year: new Date().getFullYear(),
        category: "Adabiyotlar",

        // Files
        cover_image: null,
        file: null,

        // Translated Fields (uz)
        title_uz: "", author_uz: "", description_uz: "", subjects_uz: "",

        // Translated Fields (ru)
        title_ru: "", author_ru: "", description_ru: "", subjects_ru: "",

        // Translated Fields (en)
        title_en: "", author_en: "", description_en: "", subjects_en: "",
    });

    useEffect(() => {
        if (isEdit) {
            axios.get(`${API_BASE_URL}/api/books/${id}/`)
                .then(res => {
                    const data = res.data;
                    setFormData({
                        page_count: data.page_count,
                        publication_year: data.published_date ? new Date(data.published_date).getFullYear() : new Date().getFullYear(),
                        category: data.category,
                        cover_image: null,
                        file: null,

                        title_uz: data.title_uz || "", author_uz: data.author_uz || "", description_uz: data.description_uz || "", subjects_uz: data.subjects_uz || "",
                        title_ru: data.title_ru || "", author_ru: data.author_ru || "", description_ru: data.description_ru || "", subjects_ru: data.subjects_ru || "",
                        title_en: data.title_en || "", author_en: data.author_en || "", description_en: data.description_en || "", subjects_en: data.subjects_en || "",
                    });
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    alert("Kitobni yuklashda xatolik!");
                    navigate("/admin-panel/books");
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
            if (['cover_image', 'file'].includes(key)) return; // Skip files loop
            if (key === 'category') return; // Skip default category, we will handle it explicitly
            data.append(key, formData[key]);
        });

        // Ensure category is set for all languages
        data.append("category", formData.category);
        data.append("category_uz", formData.category);
        data.append("category_ru", formData.category);
        data.append("category_en", formData.category);

        // Handle date
        data.append("published_date", `${formData.publication_year}-01-01`);

        // Handle files
        if (formData.cover_image) data.append("cover_image", formData.cover_image);
        if (formData.file) data.append("file", formData.file);

        try {
            if (isEdit) {
                if (!formData.cover_image) data.delete("cover_image");
                if (!formData.file) data.delete("file");

                await axios.patch(`${API_BASE_URL}/api/books/${id}/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post(`${API_BASE_URL}/api/books/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate("/admin-panel/books");
        } catch (error) {
            console.error("Save error:", error);
            alert("Saqlashda xatolik! " + (error.response?.data?.detail || JSON.stringify(error.response?.data)));
        } finally {
            setSubmitting(false);
        }
    };



    if (loading) return <div className="flex justify-center p-20"><Loader className="animate-spin" style={{ color: "var(--color-accent)" }} /></div>;

    const dropzoneStyle = {
        border: "1px dashed var(--color-divider)",
        borderRadius: "var(--radius-md)",
    };

    const renderLanguageFields = (lang) => (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="field">
                    <label>Kitob nomi ({lang.toUpperCase()})</label>
                    <input required={lang === 'uz'} name={`title_${lang}`} value={formData[`title_${lang}`]} onChange={handleChange} type="text" className="input" />
                </div>
                <div className="field">
                    <label>Muallif ({lang.toUpperCase()})</label>
                    <input required={lang === 'uz'} name={`author_${lang}`} value={formData[`author_${lang}`]} onChange={handleChange} type="text" className="input" />
                </div>
            </div>
            <div className="field">
                <label>Mavzular ({lang.toUpperCase()})</label>
                <input name={`subjects_${lang}`} value={formData[`subjects_${lang}`]} onChange={handleChange} type="text" className="input" placeholder="Teglar: Tarix, Roman..." />
            </div>
            <div className="field">
                <label>Tavsif ({lang.toUpperCase()})</label>
                <textarea name={`description_${lang}`} value={formData[`description_${lang}`]} onChange={handleChange} rows={5} className="input" />
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate("/admin-panel/books")} className="btn btn-icon btn-secondary">
                    <FiArrowLeft size={16} />
                </button>
                <h1 className="text-2xl">{isEdit ? "Kitobni tahrirlash" : "Yangi kitob qo'shish"}</h1>
            </div>

            <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-8">

                {/* Common Data */}
                <div className="space-y-4">
                    <h3 className="text-lg pb-2" style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--font-heading-weight)", borderBottom: "1px solid var(--color-divider)" }}>Umumiy ma'lumotlar</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="field">
                            <label>Nashr yili</label>
                            <input required name="publication_year" value={formData.publication_year} onChange={handleChange} type="number" min="1900" max={new Date().getFullYear() + 1} className="input" />
                        </div>
                        <div className="field">
                            <label>Betlar soni</label>
                            <input required name="page_count" value={formData.page_count} onChange={handleChange} type="number" min="0" className="input" />
                        </div>
                        <div className="field">
                            <label>Kategoriya</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="input">
                                {BOOK_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Multilingual Content Tabs */}
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


                {/* Files Section */}
                <div className="space-y-4">
                    <h3 className="text-lg pb-2" style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--font-heading-weight)", borderBottom: "1px solid var(--color-divider)" }}>Fayllar</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="field">
                            <label>Muqova (Cover)</label>
                            <div style={dropzoneStyle} className="p-4 text-center cursor-pointer relative h-32 flex flex-col items-center justify-center">
                                <input name="cover_image" onChange={handleChange} type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                <FiUploadCloud size={22} className="text-muted mb-2" />
                                <span className="text-xs text-muted break-all px-2">{formData.cover_image?.name || "Rasm yuklash"}</span>
                            </div>
                        </div>
                        <div className="field">
                            <label>Kitob fayli</label>
                            <div style={dropzoneStyle} className="p-4 text-center cursor-pointer relative h-32 flex flex-col items-center justify-center">
                                <input name="file" onChange={handleChange} type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                <FiUploadCloud size={22} className="text-muted mb-2" />
                                <span className="text-xs text-muted break-all px-2">{formData.file?.name || "Fayl yuklash"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 flex justify-end gap-3" style={{ borderTop: "1px solid var(--color-divider)" }}>
                    <button type="button" onClick={() => navigate("/admin-panel/books")} className="btn btn-secondary">Bekor qilish</button>
                    <button disabled={submitting} type="submit" className="btn btn-primary">
                        {submitting ? <Loader className="animate-spin" size={16} /> : <FiSave size={16} />}
                        {isEdit ? "Saqlash" : "Qo'shish"}
                    </button>
                </div>

            </form>
        </div>
    );
}
