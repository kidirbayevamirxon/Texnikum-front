import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import {
  getProvisions,
  createProvision,
  updateProvision,
  deleteProvision,
} from "../services/provisions";
import type { Provision } from "../services/provisions";
import { hasToken } from "../utils/auth";
import { uploadFiles } from "../services/upload";
import { getImageUrl } from "../utils/imageUrl";

export default function ProvisionsPage() {
  const [items, setItems] = useState<Provision[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Provision | null>(null);
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
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Yutuqlarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      alert("Tavsifni kiriting");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await updateProvision(editing.id, formData);
      } else {
        await createProvision(formData);
      }
      setShowModal(false);
      setEditing(null);
      setFormData({ title: "", description: "", photo: [] });
      await load();
    } catch (err: unknown) {
      console.error("Saqlashda xatolik:", err);
      const detail = isAxiosError<{ detail?: unknown }>(err)
        ? err.response?.data?.detail
        : undefined;
      const msg = detail
        ? typeof detail === "string"
          ? detail
          : JSON.stringify(detail) ?? "Xatolik yuz berdi"
        : "Xatolik yuz berdi";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await uploadFiles([file], "deficiency");
      const uploadedPath = res.files?.[0] || res.url;
      if (uploadedPath) {
        setFormData((prev) => ({
          ...prev,
          photo: [uploadedPath],
        }));
      }
    } catch (err) {
      console.error("Rasm yuklashda xatolik:", err);
      alert("Rasm yuklashda xatolik yuz berdi");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Haqiqatan ham bu yutuqni o‘chirmoqchimisiz?")) return;
    try {
      await deleteProvision(id);
      await load();
    } catch (err: unknown) {
      console.error("O'chirishda xatolik:", err);
      alert("O‘chirishda xatolik yuz berdi");
    }
  };

  return (
    <div className="ts-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="ts-chip">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Yutuqlar
          </div>
          <h2 className="mt-3 text-2xl font-semibold">
            Texnikum yutuqlari
          </h2>
          <p className="mt-1 text-sm text-white/60">
            {isAdmin
              ? "Admin rejim: yutuqlarni qo'shish, tahrirlash va o'chirish"
              : "Texnikum talabalari va jamoasining erishgan yutuqlari"}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="ts-btn" onClick={load}>
            Yangilash
          </button>
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
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="ts-card p-5 animate-pulse">
              <div className="h-32 w-full rounded-2xl bg-white/10 mb-3" />
              <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
              <div className="h-3 w-1/2 bg-white/10 rounded" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full ts-card p-10 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-white/10 grid place-items-center">
              <span className="text-white/60 text-2xl">🏆</span>
            </div>
            <div className="text-lg font-semibold">Hozircha yutuqlar kiritilmagan</div>
            <p className="mt-2 text-sm text-white/60">
              {isAdmin
                ? "Yangi yutuq qo'shish uchun yuqoridagi tugmani bosing"
                : "Ma'lumotlar tez orada joylanadi"}
            </p>
          </div>
        ) : (
          items.map((item) => {
            const photoUrl = getImageUrl(item.photo);
            return (
              <div
                key={item.id}
                className="ts-card ts-card-hover p-5 flex flex-col justify-between"
              >
                <div className="flex flex-col items-start gap-3 w-full">
                  <div className="h-40 w-full rounded-2xl border border-white/10 bg-emerald-400/10 overflow-hidden">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="Yutuq rasmi"
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-3xl opacity-30">
                        🏆
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 w-full">
                    <p className="text-sm font-medium text-white line-clamp-3">
                      {item.description}
                    </p>
                    <span className="mt-2 block text-xs text-white/40">
                      {new Date(item.created_date).toLocaleDateString("uz-UZ")}
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between gap-2">
                    <button
                      className="ts-btn text-xs py-1.5 px-3"
                      onClick={() => {
                        setEditing(item);
                        setFormData({
                          title: item.title || "",
                          description: item.description || "",
                          photo: Array.isArray(item.photo)
                            ? item.photo
                            : item.photo
                            ? [item.photo]
                            : [],
                        });
                        setShowModal(true);
                      }}
                    >
                      ✏ Tahrirlash
                    </button>
                    <button
                      className="ts-btn-danger text-xs py-1.5 px-3"
                      onClick={() => handleDelete(item.id)}
                    >
                      ❌ O‘chirish
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0b0f14] p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-5 text-white">
              {editing ? "Yutuqni tahrirlash" : "Yangi yutuq qo‘shish"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-white/70 mb-1">
                  Yutuq tavsifi *
                </label>
                <textarea
                  placeholder="Texnikum talabasi yoki o'qituvchisi erishgan yutuq haqida..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1">
                  Rasm biriktirish
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0])
                      handleImageUpload(e.target.files[0]);
                  }}
                  disabled={uploading}
                  className="w-full px-4 py-3 rounded-2xl border-emerald-400/30 bg-white/5 text-sm file:text-emerald-200 file:bg-emerald-500/20 file:px-3 file:py-1 file:rounded-lg file:border-none file:cursor-pointer hover:file:bg-emerald-500/30 transition disabled:opacity-50"
                />
                {uploading && (
                  <p className="text-xs text-emerald-300 mt-1 animate-pulse">
                    Rasm yuklanmoqda...
                  </p>
                )}
              </div>

              {formData.photo.length > 0 && getImageUrl(formData.photo[0]) && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl(formData.photo[0])!}
                      alt="Tanlangan rasm"
                      className="h-14 w-14 rounded-xl object-cover border border-emerald-400/40"
                    />
                    <span className="text-xs text-emerald-300">Rasm biriktirildi</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, photo: [] }))}
                    className="text-xs text-red-400 hover:text-red-300 transition px-2 py-1"
                  >
                    O'chirish
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  className="ts-btn text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-500/30 transition border border-emerald-400/30 disabled:opacity-50"
                >
                  {saving ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
