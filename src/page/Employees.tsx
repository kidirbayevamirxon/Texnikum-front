import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import {
  getTeachers,
  deleteTeacher,
  createTeacher,
  updateTeacher,
} from "../services/teachers";
import type { Teacher } from "../services/teachers";
import { hasToken } from "../utils/auth";
import { uploadFiles } from "../services/upload";
import { getImageUrl } from "../utils/imageUrl";

export default function Employees() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    photo: [] as string[],
  });

  const isAdmin = hasToken();

  const load = async () => {
    setLoading(true);
    try {
      const res = await getTeachers();
      setTeachers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Xodimlarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      alert("Ism va familiyani kiritish majburiy");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await updateTeacher(editing.id, formData);
      } else {
        await createTeacher(formData);
      }

      setShowModal(false);
      setEditing(null);
      setFormData({
        first_name: "",
        last_name: "",
        middle_name: "",
        photo: [],
      });
      await load();
    } catch (err: unknown) {
      console.error("Xodim saqlashda xatolik:", err);
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
      const res = await uploadFiles([file], "teachers");
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
    if (!confirm("Haqiqatan ham bu xodimni o'chirmoqchimisiz?")) return;
    try {
      await deleteTeacher(id);
      await load();
    } catch (err: unknown) {
      console.error("O'chirishda xatolik:", err);
      alert("O'chirishda xatolik yuz berdi");
    }
  };

  return (
    <div className="ts-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="ts-chip">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Asosiy xodimlar
          </div>
          <h2 className="mt-3 text-2xl font-semibold">Xodimlar</h2>
          <p className="mt-1 text-sm text-white/60">
            {isAdmin
              ? "Admin rejim: tahrirlash va o'chirish mumkin"
              : "Texnikum rahbariyati va o'qituvchilar tarkibi"}
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
                setFormData({
                  first_name: "",
                  last_name: "",
                  middle_name: "",
                  photo: [],
                });
                setShowModal(true);
              }}
            >
              + Qo‘shish
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="ts-card p-5">
                <div className="h-12 w-12 rounded-full bg-white/10 animate-pulse mb-3" />
                <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                <div className="mt-3 h-3 w-1/2 bg-white/10 rounded animate-pulse" />
              </div>
            ))
          : teachers.length === 0 ? (
              <div className="col-span-full ts-card p-10 text-center">
                <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-white/10 grid place-items-center">
                  <span className="text-white/60 text-2xl">👨‍🏫</span>
                </div>
                <div className="text-lg font-semibold">Hozircha xodimlar kiritilmagan</div>
                <p className="mt-2 text-sm text-white/60">
                  {isAdmin
                    ? "Yangi xodim qo'shish uchun yuqoridagi tugmadan foydalaning"
                    : "Xodimlar ro'yxati tez orada joylanadi"}
                </p>
              </div>
            ) : (
              teachers.map((t) => {
                const photoUrl = getImageUrl(t.photo || t.photo_url);
                return (
                  <div key={t.id} className="ts-card ts-card-hover p-5 flex flex-col justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="h-14 w-14 rounded-full overflow-hidden border border-white/15 bg-white/10 flex items-center justify-center shrink-0">
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt={`${t.first_name} ${t.last_name}`}
                            className="h-full w-full rounded-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-xs text-white/50">Rasm yo'q</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-base truncate text-white">
                          {t.last_name} {t.first_name}
                        </div>
                        {t.middle_name && (
                          <div className="text-xs text-white/60 truncate">
                            {t.middle_name}
                          </div>
                        )}
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="mt-5 pt-3 border-t border-white/10 flex justify-between gap-2">
                        <button
                          className="ts-btn text-xs py-1.5 px-3"
                          onClick={() => {
                            setEditing(t);
                            setFormData({
                              first_name: t.first_name || "",
                              last_name: t.last_name || "",
                              middle_name: t.middle_name || "",
                              photo: Array.isArray(t.photo) ? t.photo : t.photo ? [t.photo] : t.photo_url ? [t.photo_url] : [],
                            });
                            setShowModal(true);
                          }}
                        >
                          ✏ Tahrirlash
                        </button>
                        <button
                          className="ts-btn-danger text-xs py-1.5 px-3"
                          onClick={() => handleDelete(t.id)}
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
              {editing ? "Xodim ma'lumotlarini tahrirlash" : "Yangi xodim qo‘shish"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-white/70 mb-1">Familiya *</label>
                <input
                  type="text"
                  placeholder="Familiyani kiriting..."
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1">Ism *</label>
                <input
                  type="text"
                  placeholder="Ismni kiriting..."
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1">Otasining ismi (ixtiyoriy)</label>
                <input
                  type="text"
                  placeholder="Otasining ismini kiriting..."
                  value={formData.middle_name}
                  onChange={(e) =>
                    setFormData({ ...formData, middle_name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 mb-1">Xodim rasmi</label>
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
                      className="h-12 w-12 rounded-full object-cover border border-emerald-400/40"
                    />
                    <span className="text-xs text-emerald-300">Rasm yuklandi</span>
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
