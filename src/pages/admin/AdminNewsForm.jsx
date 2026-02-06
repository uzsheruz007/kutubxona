import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave, FiArrowLeft, FiUploadCloud, FiGlobe } from "react-icons/fi";
import { Loader } from "lucide-react";
import JoditEditor from 'jodit-react';

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
            axios.get(`http://127.0.0.1:8000/api/news/${id}/`)
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
                await axios.patch(`http://127.0.0.1:8000/api/news/${id}/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post("http://127.0.0.1:8000/api/news/", data, {
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

    if (loading) return <div className="flex justify-center p-20"><Loader className="animate-spin text-amber-600" /></div>;

    const renderLanguageFields = (lang) => (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700">Sarlavha ({lang.toUpperCase()})</label>
                <input required={lang === 'uz'} name={`title_${lang}`} value={formData[`title_${lang}`]} onChange={handleChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700">Matn ({lang.toUpperCase()})</label>
                <div className="prose max-w-none">
                    <JoditEditor
                        value={formData[`description_${lang}`]}
                        config={{ ...config, placeholder: `${lang.toUpperCase()} tilidagi matn...` }}
                        onBlur={newContent => setFormData(prev => ({ ...prev, [`description_${lang}`]: newContent }))}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate("/admin-panel/news")} className="p-2 bg-white rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 transition-colors">
                    <FiArrowLeft />
                </button>
                <h1 className="text-2xl font-bold text-stone-800">{isEdit ? "Yangilikni Tahrirlash" : "Yangi Yangilik Qo'shish"}</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-8">

                {/* Common Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-stone-700">Kategoriya</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white">
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-stone-700">Sana</label>
                        <input required name="date" value={formData.date} onChange={handleChange} type="date" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
                    </div>
                </div>

                {/* Language Tabs */}
                <div className="space-y-2">
                    <div className="flex bg-stone-100 p-1 rounded-xl mb-4 w-fit">
                        {['uz', 'ru', 'en'].map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                onClick={() => setActiveTab(lang)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === lang
                                    ? "bg-white text-amber-600 shadow-sm"
                                    : "text-stone-500 hover:text-stone-700"
                                    }`}
                            >
                                <FiGlobe className="inline mr-2 mb-0.5" />
                                {lang === 'uz' ? "O'zbekcha" : lang === 'ru' ? "Русский" : "English"}
                            </button>
                        ))}
                    </div>
                    <div className="border border-stone-100 rounded-xl p-4 bg-stone-50/50">
                        {activeTab === 'uz' && renderLanguageFields('uz')}
                        {activeTab === 'ru' && renderLanguageFields('ru')}
                        {activeTab === 'en' && renderLanguageFields('en')}
                    </div>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700">Rasm (Muqova)</label>
                    <div className="border border-dashed border-stone-300 rounded-xl p-4 text-center hover:bg-stone-50 transition-colors cursor-pointer relative h-32 flex flex-col items-center justify-center">
                        <input name="image" onChange={handleChange} type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <FiUploadCloud size={24} className="text-stone-400 mb-2" />
                        <span className="text-xs text-stone-500 break-all px-2">{formData.image?.name || "Rasm yuklash (Ixtiyoriy)"}</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-stone-100 flex justify-end">
                    <button disabled={submitting} type="submit" className="bg-stone-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-stone-200 transition-all flex items-center gap-2 transform active:scale-95">
                        {submitting ? <Loader className="animate-spin" /> : <FiSave />}
                        {isEdit ? "Saqlash" : "Qo'shish"}
                    </button>
                </div>

            </form>
        </div>
    );
}
