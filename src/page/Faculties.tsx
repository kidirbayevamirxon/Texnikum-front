import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categories";
import type { Category } from "../services/categories";
import { isAuthenticated } from "../services/auth";

export default function Faculties() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    setIsAdmin(isAuthenticated());
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Fakultetlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert("Faqat adminlar fakultet qo'sha oladi");
      return;
    }
    if (!formData.name.trim()) {
      alert("Fakultet nomini kiriting");
      return;
    }

    setSaving(true);
    try {
      await createCategory({ name: formData.name.trim() });
      await loadCategories();
      setShowModal(false);
      setFormData({ name: "" });
    } catch (error: unknown) {
      console.error("Fakultet qo'shishda xatolik:", error);
      const detail = isAxiosError<{ detail?: unknown }>(error)
        ? error.response?.data?.detail
        : undefined;
      const msg = detail
        ? typeof detail === "string"
          ? detail
          : JSON.stringify(detail) ?? "Fakultet qo'shishda xatolik yuz berdi"
        : "Fakultet qo'shishda xatolik yuz berdi";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editingItem) return;
    if (!formData.name.trim()) {
      alert("Fakultet nomini kiriting");
      return;
    }

    setSaving(true);
    try {
      await updateCategory(editingItem.id, { name: formData.name.trim() });
      await loadCategories();
      setEditingItem(null);
      setFormData({ name: "" });
    } catch (error: unknown) {
      console.error("Fakultetni tahrirlashda xatolik:", error);
      const detail = isAxiosError<{ detail?: unknown }>(error)
        ? error.response?.data?.detail
        : undefined;
      const msg = detail
        ? typeof detail === "string"
          ? detail
          : JSON.stringify(detail) ??
            "Fakultetni tahrirlashda xatolik yuz berdi"
        : "Fakultetni tahrirlashda xatolik yuz berdi";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin) {
      alert("Faqat adminlar fakultetni o'chira oladi");
      return;
    }
    if (!confirm("Haqiqatan ham bu fakultetni o'chirishni xohlaysizmi?")) return;
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (error: unknown) {
      console.error("Fakultetni o'chirishda xatolik:", error);
      alert("Fakultetni o'chirishda xatolik yuz berdi");
    }
  };

  const openEditModal = (item: Category) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
    });
  };

  return (
    <div className="ts-card p-6">
      {/* Modal */}
      {(showModal || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0b0f14] p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">
              {editingItem ? "Fakultetni tahrirlash" : "Yangi fakultet qo'shish"}
            </h3>
            <form onSubmit={editingItem ? handleUpdate : handleCreate}>
              <div className="mb-4">
                <label className="block text-xs text-white/70 mb-2">
                  Fakultet (yo‘nalish) nomi *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/50 text-sm"
                  placeholder="Masalan: Axborot texnologiyalari..."
                  required
                  autoFocus
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    setFormData({ name: "" });
                  }}
                  className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition text-sm"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/30 transition text-sm disabled:opacity-50"
                >
                  {saving
                    ? "Saqlanmoqda..."
                    : editingItem
                    ? "Saqlash"
                    : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="ts-chip">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Mutaxassisliklar
          </div>
          <h2 className="mt-3 text-2xl font-semibold">Fakultetlar</h2>
          <p className="mt-1 text-sm text-white/60">
            {isAdmin
              ? "Admin rejim: fakultetlarni qo'shish va tahrirlash"
              : "Texnikumda mavjud ta'lim yo‘nalishlari ro‘yxati"}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="ts-btn" onClick={loadCategories}>
            Yangilash
          </button>
          {isAdmin && (
            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({ name: "" });
                setShowModal(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2.5 text-sm text-emerald-200 hover:bg-emerald-500/30 transition border border-emerald-400/30"
            >
              <span className="text-lg">+</span>
              Yangi fakultet
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="ts-card p-5">
              <div className="h-6 w-3/4 bg-white/10 rounded animate-pulse mb-3" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full ts-card p-10 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-white/10 grid place-items-center">
              <span className="text-white/60 text-2xl">🏛️</span>
            </div>
            <div className="text-lg font-semibold">
              Hozircha fakultetlar kiritilmagan
            </div>
            <p className="mt-2 text-sm text-white/60">
              {isAdmin
                ? "Yangi fakultet qo'shish uchun yuqoridagi tugmani bosing"
                : "Fakultetlar tez orada qo'shiladi"}
            </p>
          </div>
        ) : (
          items.map((f) => (
            <div
              key={f.id}
              className="ts-card ts-card-hover p-5 relative group flex flex-col justify-between"
            >
              {isAdmin && (
                <div className="absolute top-3 right-3 z-10 flex gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition">
                  <button
                    onClick={() => openEditModal(f)}
                    className="rounded-lg bg-blue-500/25 p-2 text-blue-200 hover:bg-blue-500/40 transition border border-blue-400/30 backdrop-blur"
                    title="Tahrirlash"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="rounded-lg bg-red-500/25 p-2 text-red-200 hover:bg-red-500/40 transition border border-red-400/30 backdrop-blur"
                    title="O'chirish"
                  >
                    ×
                  </button>
                </div>
              )}

              <div>
                <div className="text-lg font-semibold pr-16 line-clamp-2 text-white">
                  {f.name}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                <span>
                  {f.created_date
                    ? new Date(f.created_date).toLocaleDateString("uz-UZ")
                    : "—"}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-emerald-300">
                  Faol
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {isAdmin && items.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/50">Jami fakultetlar</div>
              <div className="mt-1 text-xl font-semibold text-emerald-300">
                {items.length}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/50">So‘nggi kiritilgan</div>
              <div className="mt-1 text-sm text-white/80 truncate">
                {items[0]?.name || "—"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
