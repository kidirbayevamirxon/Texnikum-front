import { useEffect, useState } from "react";
import {
  getProvisions,
  createProvision,
  updateProvision,
  deleteProvision,
} from "../services/provisions";
import { hasToken } from "../utils/auth";
import { UPLOADS_BASE_URL } from "../api/config";
import { uploadFiles } from "../services/upload";

export default function ProvisionsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    photo: [] as string[],
  });

  const isAdmin = hasToken();

  const load = async () => {
    setLoading(true);
    try {
      const res = await getProvisions();
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateProvision(editing.id, formData);
      } else {
        await createProvision(formData);
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ title: "", description: "", photo: [] });
      load();
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi");
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const res = await uploadFiles([file], "deficiency");
      const uploadedPath = res.files[0];
      setFormData((prev) => ({
        ...prev,
        photo: [`${UPLOADS_BASE_URL}${uploadedPath}`],
      }));
    } catch (err) {
      console.error(err);
      alert("Rasm yuklashda xatolik");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Haqiqatan o‘chirmoqchimisiz?")) return;
    try {
      await deleteProvision(id);
      load();
    } catch (err) {
      console.error(err);
      alert("O‘chirishda xatolik yuz berdi");
    }
  };

  return (
    <div className="ts-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="ts-chip">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Yutuqlari
          </div>
          <h2 className="mt-3 text-2xl font-semibold">
            Texnikum yetishganlari
          </h2>
          <p className="mt-1 text-sm text-white/60">Achievements/ Yutuqlari</p>
        </div>
        {isAdmin && (
          <button
            className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-500/30 transition border border-emerald-400/30"
            onClick={() => {
              setEditing(null);
              setFormData({ title: "", description: "", photo: [] });
              setShowModal(true);
            }}
          >
            + Qo‘shish
          </button>
        )}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="ts-card p-5 animate-pulse">
              <div className="h-10 w-10 rounded-2xl bg-white/10 mb-3" />
              <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
              <div className="h-3 w-1/2 bg-white/10 rounded" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/60">
            Ma’lumot yo‘q
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="ts-card ts-card-hover p-5">
              <div className="flex flex-col items-start gap-3">
                <div className="h-32 w-full rounded-2xl border border-white/10 bg-emerald-400/10 grid place-items-center overflow-hidden">
                  {item.photo && item.photo.length > 0 ? (
                    <img
                      src={item.photo[0]}
                      alt={item.title}
                      className="h-full w-full object-cover rounded-xl transition-transform hover:scale-105"
                    />
                  ) : (
                    <span className="text-white/50 text-xl font-bold">✅</span>
                  )}
                </div>
                <div className="min-w-0 w-full">
                  <div className="font-semibold text-white">
                    <p className="text-sm line-clamp-2">{item.title}</p>
                  </div>
                  {item.description && (
                    <p className="mt-1 text-xs text-white/65 line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
              {isAdmin && (
                <div className="mt-4 flex justify-between gap-2">
                  <button
                    className="ts-btn"
                    onClick={() => {
                      setEditing(item);
                      setFormData({
                        title: item.title || "",
                        description: item.description || "",
                        photo: item.photo || [],
                      });
                      setShowModal(true);
                    }}
                  >
                    ✏ Tahrirlash
                  </button>
                  <button
                    className="ts-btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    ❌ O‘chirish
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0b0f14] p-6">
            <h3 className="text-xl font-semibold mb-5 text-white">
              {editing
                ? "Yutuqni tahrirlash"
                : "Yangi yutuqlarni qo‘shish"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 placeholder-gray-400 focus:border-emerald-400 focus:outline-none transition"
              /> */}
              <textarea
                placeholder="Yutuqlari..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/50"
              />
              <label className="block">
                <span className="text-gray-300 text-sm mb-1 block">
                  Rasm yuklash
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0])
                      handleImageUpload(e.target.files[0]);
                  }}
                  className="w-full px-4 py-3 rounded-2xl border-emerald-400/30 bg-white/5 text-sm file:text-emerald-200 file:bg-emerald-500/20 file:px-3 file:py-1 file:rounded-lg file:border-none file:cursor-pointer hover:file:bg-emerald-500/30 transition"
                />
              </label>
              {formData.photo.length > 0 && (
                <img
                  src={formData.photo[0]}
                  alt="Preview"
                  className="mt-2 h-20 w-20 rounded-lg object-cover"
                />
              )}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  className="ts-btn"
                  onClick={() => setShowModal(false)}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
              className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-500/30 transition border border-emerald-400/30"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
