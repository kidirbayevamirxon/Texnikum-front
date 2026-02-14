import { useEffect, useState } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../services/categories";
import { isAuthenticated } from "../services/auth";

interface Category {
  id: number;
  name: string;
  description?: string;
  created_date: string;
}

export default function Faculties() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: ""});

  useEffect(() => {
    setIsAdmin(isAuthenticated());
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setItems(res.data);
    } catch (error) {
      console.error("Fakultetlarni yuklashda xatolik:");
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

    try {
      await createCategory(formData);
      await loadCategories();
      setShowModal(false);
      setFormData({ name: ""});
    } catch (error) {
      console.error("Fakultet qo'shishda xatolik:");
      alert("Fakultet qo'shishda xatolik yuz berdi");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editingItem) return;

    try {
      await updateCategory(editingItem.id, formData);
      await loadCategories();
      setEditingItem(null);
      setFormData({ name: ""});
    } catch (error) {
      console.error("Fakultetni tahrirlashda xatolik:");
      alert("Fakultetni tahrirlashda xatolik yuz berdi");
    }
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin) {
      alert("Faqat adminlar fakultetni o'chira oladi");
      return;
    }
    if (!confirm("Bu fakultetni o'chirishni xohlaysizmi?")) return;
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (error) {
      console.error("Fakultetni o'chirishda xatolik:", error);
      alert("Fakultetni o'chirishda xatolik yuz berdi");
    }
  };

  const openEditModal = (item: Category) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      // description: item.description || ""
    });
  };

  return (
    <div className="ts-card p-6">
      {(showModal || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0b0f14] p-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingItem ? "Fakultetni tahrirlash" : "Yangi fakultet qo'shish"}
            </h3>
            <form onSubmit={editingItem ? handleUpdate : handleCreate}>
              <div className="mb-4">
                <label className="block text-sm text-white/70 mb-2">
                  Fakultet nomi
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/50"
                  placeholder="Fakultet nomini kiriting..."
                  required
                />
              </div>
              {/* <div className="mb-6">
                <label className="block text-sm text-white/70 mb-2">
                  Qisqacha ma'lumot (ixtiyoriy)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/50"
                  rows={4}
                  placeholder="Fakultet haqida qisqacha..."
                />
              </div> */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    setFormData({ name: ""});
                  }}
                  className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/30 transition"
                >
                  {editingItem ? "Saqlash" : "Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="ts-chip">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Taklif etilayotgan qulayliklar
          </div>
          <h2 className="mt-3 text-2xl font-semibold">Fakultetlar</h2>
          <p className="mt-1 text-sm text-white/60">Yo‘nalishlar ro‘yxati</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2.5 text-sm text-emerald-200 hover:bg-emerald-500/30 transition border border-emerald-400/30"
          >
            <span className="text-lg">+</span>
            Yangi fakultet
          </button>
        )}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="ts-card p-5">
              <div className="h-6 w-3/4 bg-white/10 rounded animate-pulse mb-3" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="mt-4 h-4 w-1/3 bg-white/10 rounded animate-pulse" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full ts-card p-10 text-center">
            <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-white/10 grid place-items-center">
              <span className="text-white/60 text-2xl">🏛️</span>
            </div>
            <div className="text-lg font-semibold">Hozircha fakultetlar yo‘q</div>
            <p className="mt-2 text-sm text-white/60">
              {isAdmin 
                ? "Yangi fakultet qo'shish uchun tugmani bosing" 
                : "Fakultetlar qo'shilganda shu yerda ko'rinadi"}
            </p>
          </div>
        ) : (
          items.map((f) => (
            <div key={f.id} className="ts-card ts-card-hover p-5 relative group">
              {isAdmin && (
                <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => openEditModal(f)}
                    className="rounded-lg bg-blue-500/20 p-2 text-blue-200 hover:bg-blue-500/30 transition border border-blue-400/30 backdrop-blur"
                    title="Tahrirlash"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="rounded-lg bg-red-500/20 p-2 text-red-200 hover:bg-red-500/30 transition border border-red-400/30 backdrop-blur"
                    title="O'chirish"
                  >
                    ×
                  </button>
                </div>
              )}
              <div className="text-lg font-semibold pr-16 line-clamp-2">
                {f.name}
              </div>
              {/* <div className="mt-2 text-sm text-white/60 line-clamp-3 min-h-15">
                {f.description || "Bu fakultet bo‘yicha qisqacha ma’lumot."}
              </div> */}
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-white/45">
                  {new Date(f.created_date).toLocaleDateString("uz-UZ")}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                  ID: {f.id}
                </span>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition group-hover:opacity-100">
                <div className="absolute inset-0 rounded-3xl ring-1 ring-emerald-400/15" />
                <div className="absolute -inset-px rounded-3xl bg-linear-to-br from-emerald-400/10 to-cyan-400/10 blur-xl" />
              </div>
            </div>
          ))
        )}
      </div>
      {isAdmin && items.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/50">Jami fakultetlar</div>
              <div className="mt-1 text-xl font-semibold">{items.length}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/50">Oxirgi qo'shilgan</div>
              <div className="mt-1 text-sm text-white/80">
                {items[0]?.name?.slice(0, 15)}...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}