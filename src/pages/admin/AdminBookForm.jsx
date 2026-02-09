import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FiSave, FiArrowLeft, FiUploadCloud, FiGlobe } from "react-icons/fi";
import { Loader } from "lucide-react";
import { API_BASE_URL } from "../../config";

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
        resource_type: "Kitob",

        // Files
        cover_image: null,
        file: null,
        qr_code: null,

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
                        resource_type: data.resource_type || "Kitob",
                        cover_image: null,
                        file: null,
                        qr_code: null,

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
            if (['cover_image', 'file', 'qr_code'].includes(key)) return; // Skip files loop
            data.append(key, formData[key]);
        });

        // Handle date
        data.append("published_date", `${formData.publication_year}-01-01`);

        // Handle files
        if (formData.cover_image) data.append("cover_image", formData.cover_image);
        if (formData.file) data.append("file", formData.file);
        if (formData.qr_code) data.append("qr_code", formData.qr_code);

        try {
            if (isEdit) {
                if (!formData.cover_image) data.delete("cover_image");
                if (!formData.file) data.delete("file");
                if (!formData.qr_code) data.delete("qr_code");

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

    const categories = ["Adabiyotlar", "Darslik", "Ilmiy", "Oquv"];
    const resourceTypes = ["Kitob", "Avtoreferat", "Monografiya", "O'quv qo'llanma", "Maqola", "Dissertatsiya"];

    if (loading) return <div className="flex justify-center p-20"><Loader className="animate-spin text-amber-600" /></div>;

    const renderLanguageFields = (lang) => (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700">Kitob Nomi ({lang.toUpperCase()})</label>
                    <input required={lang === 'uz'} name={`title_${lang}`} value={formData[`title_${lang}`]} onChange={handleChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700">Muallif ({lang.toUpperCase()})</label>
                    <input required={lang === 'uz'} name={`author_${lang}`} value={formData[`author_${lang}`]} onChange={handleChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700">Mavzular ({lang.toUpperCase()})</label>
                <input name={`subjects_${lang}`} value={formData[`subjects_${lang}`]} onChange={handleChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" placeholder="Teglar: Tarix, Roman..." />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-stone-700">Tavsif ({lang.toUpperCase()})</label>
                <textarea name={`description_${lang}`} value={formData[`description_${lang}`]} onChange={handleChange} rows={5} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate("/admin-panel/books")} className="p-2 bg-white rounded-xl border border-stone-200 text-stone-500 hover:text-stone-800 transition-colors">
                    <FiArrowLeft />
                </button>
                <h1 className="text-2xl font-bold text-stone-800">{isEdit ? "Kitobni Tahrirlash" : "Yangi Kitob Qo'shish"}</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-8">

                {/* Common Data */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-stone-800 border-b border-stone-100 pb-2">Umumiy Ma'lumotlar</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-stone-700">Nashr Yili</label>
                            <input required name="publication_year" value={formData.publication_year} onChange={handleChange} type="number" min="1900" max={new Date().getFullYear() + 1} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-stone-700">Betlar Soni</label>
                            <input required name="page_count" value={formData.page_count} onChange={handleChange} type="number" min="0" className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-stone-700">Kategoriya</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white">
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-stone-700">Resurs Turi</label>
                            <input list="resource-types" name="resource_type" value={formData.resource_type} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" placeholder="Masalan: Kitob, Maqola..." />
                            <datalist id="resource-types">
                                {resourceTypes.map(t => <option key={t} value={t} />)}
                            </datalist>
                        </div>
                    </div>
                </div>

                {/* Multilingual Content Tabs */}
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


                {/* Files Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-stone-800 border-b border-stone-100 pb-2">Fayllar</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-stone-700">Muqova (Cover)</label>
                            <div className="border border-dashed border-stone-300 rounded-xl p-4 text-center hover:bg-stone-50 transition-colors cursor-pointer relative h-32 flex flex-col items-center justify-center">
                                <input name="cover_image" onChange={handleChange} type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                <FiUploadCloud size={24} className="text-stone-400 mb-2" />
                                <span className="text-xs text-stone-500 break-all px-2">{formData.cover_image?.name || "Rasm yuklash"}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-stone-700">Kitob Fayli</label>
                            <div className="border border-dashed border-stone-300 rounded-xl p-4 text-center hover:bg-stone-50 transition-colors cursor-pointer relative h-32 flex flex-col items-center justify-center">
                                <input name="file" onChange={handleChange} type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                <FiUploadCloud size={24} className="text-stone-400 mb-2" />
                                <span className="text-xs text-stone-500 break-all px-2">{formData.file?.name || "Fayl yuklash"}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-stone-700">QR Kod</label>
                            <div className="border border-dashed border-stone-300 rounded-xl p-4 text-center hover:bg-stone-50 transition-colors cursor-pointer relative h-32 flex flex-col items-center justify-center">
                                <input name="qr_code" onChange={handleChange} type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                <FiUploadCloud size={24} className="text-stone-400 mb-2" />
                                <span className="text-xs text-stone-500 break-all px-2">{formData.qr_code?.name || "QR Rasm"}</span>
                            </div>
                        </div>
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
