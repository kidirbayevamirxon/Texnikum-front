import { useEffect, useState } from "react";
import {
  getTeachers,
  deleteTeacher,
  createTeacher,
  updateTeacher,
} from "../services/teachers";
import { hasToken } from "../utils/auth";
import { UPLOADS_BASE_URL } from "../api/config";
import { uploadFiles } from "../services/upload";

export default function Employees() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    photo: [] as string[],
  });

  const isAdmin = hasToken();

  const load = async () => {
    setLoading(true);
    const res = await getTeachers();
    setTeachers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      load();
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi");
    }
  };
  const handleImageUpload = async (file: File) => {
    try {
      const res = await uploadFiles([file], "teachers");
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
              ? "Admin rejim: tahrirlash mumkin"
              : "Guest rejim: faqat ko‘rish"}
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
          : teachers.map((t) => (
              <div key={t.id} className="ts-card ts-card-hover p-5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden border border-white/10 bg-white/10 flex items-center justify-center">
                    {t.photo && t.photo.length > 0 ? (
                      <img
                        src={t.photo[0]}
                        alt={`${t.first_name} ${t.last_name}`}
                        className="h-12 w-12 rounded-full object-cover border"
                      />
                    ) : (
                      <span className="text-xs text-white/50">No Photo</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">
                      {t.first_name} {t.last_name} {t.middle_name}
                    </div>
                  </div>
                </div>
                {isAdmin && (
                  <div className="mt-4 flex justify-between gap-2">
                    <button
                      className="ts-btn"
                      onClick={() => {
                        setEditing(t);
                        setFormData({
                          first_name: t.first_name || "",
                          last_name: t.last_name || "",
                          middle_name: t.middle_name || "",
                          photo: t.photo || [],
                        });
                        setShowModal(true);
                      }}
                    >
                      ✏ Tahrirlash
                    </button>
                    <button
                      className="ts-btn-danger"
                      onClick={() => deleteTeacher(t.id).then(load)}
                    >
                      ❌ O‘chirish
                    </button>
                  </div>
                )}
              </div>
            ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0b0f14] p-6">
            <h3 className="text-xl font-semibold mb-5 text-white">
              {editing ? "Xodimni tahrirlash" : "Yangi xodim qo‘shish"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="First name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/50"
              />
              <input
                type="text"
                placeholder="Last name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/50"
              />
              <input
                type="text"
                placeholder="Middle name"
                value={formData.middle_name}
                onChange={(e) =>
                  setFormData({ ...formData, middle_name: e.target.value })
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
