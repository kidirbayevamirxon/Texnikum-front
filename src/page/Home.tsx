import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { getNews, createNews, updateNews, deleteNews } from "../services/news";
import type { NewsItem } from "../services/news";
import { uploadFiles } from "../services/upload";
import { getImageUrl } from "../utils/imageUrl";

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    photo: [] as string[],
  });

  const texnikumHistory = `Qoʻngʻirot sanoat texnikumi 2020-yili avvalgi 2008-yili tashkil qilingan Qoʻngʻirot neft va gaz sanoati kasb-hunar kolledji negizida Qo’ng’irot sanoat texnikumi bo’lib tashkillashtirildi. 2025-yil yanvar oyidan boshlab O'zbekiston Respublikasi Prezidentining 2024-yil 16-oktabrdagi PF-158-sonli "Kasbiy ta’limda malakali kadrlar tayyorlash tizimini yanada takomillashtirish va xalqaro ta’lim dasturlarini joriy qilish choar-tadbirlari to'g'risida" gi Farmoniga muvofiq Qo’ng’irot sanoat texnikumi bo’lib qayta nomlandi.
2026-yil yanvar oyidan boshlab O'zbekiston Respublikasi Prezidentining 2025-yil 23-oktyabrdagi PF-190-sonli "Kasbiy ta’lim tizimida boshqaruv samaradorligini oshirish chora-tadbirlari to'g'risida" gi Farmoniga muvofiq Qoʻng’irot tumani 2-son texnikumi deb qayta nomlandi.
Qoʻng’irot sanoat texnikumi quvvati 540 o’rinli 100 oʻquvchilar uchun mo’ljallangan o’quvchilar turar joyi, amaliyot ustaxonasi, fizika va kimyo laboratoriyalari xonasi, 2 ta kompyuter xonasi, majlislar zali, kutubxona va sport zaliga ega.`;

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const res = await getNews();
      setNews(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Yangiliklarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedNews = useMemo(() => {
    return [...news].sort(
      (a, b) => +new Date(b.created_date) - +new Date(a.created_date)
    );
  }, [news]);

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Faqat adminlar yangilik qo'sha oladi");
      return;
    }

    setSubmitting(true);
    try {
      await createNews(formData);
      await loadNews();
      setShowCreateModal(false);
      setFormData({ description: "", photo: [] });
    } catch (error: unknown) {
      console.error("Yangilik qo'shishda xatolik:", error);
      const detail = isAxiosError<{ detail?: unknown }>(error)
        ? error.response?.data?.detail
        : undefined;
      const msg = detail
        ? typeof detail === "string"
          ? detail
          : JSON.stringify(detail) ?? "Yangilik qo'shishda xatolik yuz berdi"
        : "Yangilik qo'shishda xatolik yuz berdi";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !editingNews) return;

    setSubmitting(true);
    try {
      await updateNews(editingNews.id, formData);
      await loadNews();
      setEditingNews(null);
      setFormData({ description: "", photo: [] });
    } catch (error: unknown) {
      console.error("Yangilikni tahrirlashda xatolik:", error);
      const detail = isAxiosError<{ detail?: unknown }>(error)
        ? error.response?.data?.detail
        : undefined;
      const msg = detail
        ? typeof detail === "string"
          ? detail
          : JSON.stringify(detail) ??
            "Yangilikni tahrirlashda xatolik yuz berdi"
        : "Yangilikni tahrirlashda xatolik yuz berdi";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (!isAuthenticated) {
      alert("Faqat adminlar yangilikni o'chira oladi");
      return;
    }
    if (!confirm("Bu yangilikni o'chirishni xohlaysizmi?")) return;
    try {
      await deleteNews(id);
      await loadNews();
    } catch (error: unknown) {
      console.error("Yangilikni o'chirishda xatolik:", error);
      alert("Yangilikni o'chirishda xatolik yuz berdi");
    }
  };

  const openEditModal = (item: NewsItem) => {
    setEditingNews(item);
    setFormData({
      description: item.description,
      photo: Array.isArray(item.photo) ? item.photo : item.photo ? [item.photo] : [],
    });
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingNews(null);
    setFormData({ description: "", photo: [] });
  };

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      const uploaded = await uploadFiles(files, "news");
      const urls = uploaded.files;

      setFormData((prev) => ({
        ...prev,
        photo: [...prev.photo, ...urls],
      }));
    } catch (err: unknown) {
      console.error("Rasm yuklashda xatolik:", err);
      alert("Rasm yuklashda xatolik yuz berdi");
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photo: prev.photo.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen text-white">
      {/* Create / Edit Modal */}
      {(showCreateModal || editingNews) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0b0f14] p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingNews ? "Yangilikni tahrirlash" : "Yangi yangilik qo'shish"}
            </h3>
            <form onSubmit={editingNews ? handleUpdateNews : handleCreateNews}>
              <div className="mb-4">
                <label className="block text-sm text-white/70 mb-2">
                  Matn (tavsif)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/50"
                  rows={5}
                  placeholder="Yangilik matnini kiriting..."
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-white/70 mb-2">
                  Rasm biriktirish
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (!e.target.files) return;
                    handleUpload(Array.from(e.target.files));
                  }}
                  disabled={uploading}
                  className="w-full px-4 py-3 rounded-2xl border-emerald-400/30 bg-white/5 text-sm file:text-emerald-200 file:bg-emerald-500/20 file:px-3 file:py-1 file:rounded-lg file:border-none file:cursor-pointer hover:file:bg-emerald-500/30 transition disabled:opacity-50"
                />
                {uploading && (
                  <p className="text-xs text-emerald-300 mt-2 animate-pulse">
                    Rasm yuklanmoqda...
                  </p>
                )}

                {/* Previews */}
                {formData.photo.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {formData.photo.map((p, idx) => {
                      const imgUrl = getImageUrl(p);
                      return (
                        <div
                          key={idx}
                          className="relative h-20 w-20 rounded-xl overflow-hidden border border-white/15 bg-white/5 group"
                        >
                          {imgUrl && (
                            <img
                              src={imgUrl}
                              alt="Yuklangan rasm"
                              className="h-full w-full object-cover"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600/80 text-white text-xs flex items-center justify-center opacity-80 hover:opacity-100 transition"
                            title="O'chirish"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition text-sm"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/30 transition text-sm disabled:opacity-50"
                >
                  {submitting
                    ? "Saqlanmoqda..."
                    : editingNews
                    ? "Saqlash"
                    : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Action Bar */}
      {isAuthenticated && (
        <section className="relative z-10 mx-auto max-w-6xl px-4 pt-4">
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 backdrop-blur p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-medium text-emerald-300">
                  Admin boshqaruv paneli
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingNews(null);
                  setFormData({ description: "", photo: [] });
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-500/30 transition border border-emerald-400/30"
              >
                <span>+</span>
                Yangilik qo'shish
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Hero Banner */}
      <section className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
            <div className="relative">
              <div className="h-44 md:h-56 bg-[linear-gradient(120deg,rgba(16,185,129,0.20),rgba(34,211,238,0.12),rgba(255,255,255,0.03))]" />
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_40%,rgba(16,185,129,0.35),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(34,211,238,0.25),transparent_50%)]" />
              <div className="absolute left-6 right-6 bottom-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  So‘nggi yangiliklar
                </div>
                <h1 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight">
                  Texnikum yangiliklari
                </h1>
                <p className="mt-2 max-w-2xl text-sm md:text-base text-white/65">
                  E’lonlar, xabarlar va yangilanishlar — barchasi bir joyda.
                </p>
              </div>
            </div>
            <div className="grid gap-3 px-6 pb-6 pt-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-white/50">Jami postlar</div>
                <div className="mt-1 text-xl font-semibold">{news.length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-white/50">Oxirgi yangilanish</div>
                <div className="mt-1 text-sm font-semibold text-white/80">
                  {news.length > 0
                    ? new Date(sortedNews[0]?.created_date).toLocaleDateString(
                        "uz-UZ"
                      )
                    : "—"}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-white/50">Holat</div>
                <div className="mt-1 text-sm font-semibold text-emerald-300">
                  Faol
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Texnikum History Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="text-2xl font-semibold mb-3 text-emerald-300">
            Texnikum tarixi
          </h2>
          <p className="text-white/70 leading-relaxed text-sm md:text-base whitespace-pre-line">
            {texnikumHistory}
          </p>
        </div>
      </section>

      {/* News Grid */}
      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-14">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <div className="h-40 w-full rounded-2xl bg-white/10 animate-pulse mb-4" />
                <div className="h-5 w-3/4 bg-white/10 rounded animate-pulse" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
                  <div className="h-3 w-11/12 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
            <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-white/10 grid place-items-center">
              <span className="text-white/60">📰</span>
            </div>
            <div className="text-lg font-semibold">
              Hozircha yangiliklar yo‘q
            </div>
            <p className="mt-2 text-sm text-white/60">
              {isAuthenticated
                ? "Yangi post qo'shish uchun yuqoridagi tugmadan foydalaning"
                : "Yangi post qo‘shilganda shu yerda ko‘rinadi"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedNews.map((n) => {
              const title =
                n.description?.split(".")[0]?.trim() || "Yangilik";
              const dateLabel = new Date(n.created_date).toLocaleString(
                "uz-UZ"
              );
              const imgUrl = getImageUrl(n.photo);

              return (
                <article
                  key={n.id}
                  className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-5 transition hover:border-emerald-400/25 hover:bg-white/[0.07] flex flex-col justify-between"
                >
                  {isAuthenticated && (
                    <div className="absolute top-3 right-3 z-20 flex gap-1.5">
                      <button
                        onClick={() => openEditModal(n)}
                        className="rounded-lg bg-blue-500/25 p-2 text-blue-200 hover:bg-blue-500/40 transition border border-blue-400/30 backdrop-blur"
                        title="Tahrirlash"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDeleteNews(n.id)}
                        className="rounded-lg bg-red-500/25 p-2 text-red-200 hover:bg-red-500/40 transition border border-red-400/30 backdrop-blur"
                        title="O'chirish"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  <div>
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={title}
                        className="relative z-10 w-full h-44 object-cover rounded-2xl mb-4 border border-white/10"
                        loading="lazy"
                      />
                    ) : (
                      <div className="relative z-10 w-full h-44 rounded-2xl mb-4 border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.15),rgba(34,211,238,0.10),rgba(255,255,255,0.03))] grid place-items-center">
                        <span className="text-3xl opacity-30">📰</span>
                      </div>
                    )}

                    <h3 className="relative z-10 text-lg font-semibold leading-snug line-clamp-2">
                      {title}
                    </h3>
                    <p className="relative z-10 mt-2 text-sm text-white/65 line-clamp-4">
                      {n.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/45">{dateLabel}</span>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-emerald-200">
                      YANGILIK
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
