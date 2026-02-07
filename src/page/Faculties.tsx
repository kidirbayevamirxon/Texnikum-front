import { useEffect, useState } from "react";
import { getCategories } from "../services/categories";

export default function Faculties() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="ts-card p-6">
      <div>
        <div className="ts-chip">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Facilities Offered
        </div>
        <h2 className="mt-3 text-2xl font-semibold">Fakultetlar</h2>
        <p className="mt-1 text-sm text-white/60">Yo‘nalishlar ro‘yxati</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="ts-card p-5">
                <div className="h-12 w-full bg-white/10 rounded-2xl animate-pulse" />
              </div>
            ))
          : items.map((f) => (
              <div key={f.id} className="ts-card ts-card-hover p-5">
                <div className="text-lg font-semibold">{f.name}</div>
                <div className="mt-2 text-sm text-white/60 line-clamp-3">
                  {f.description || "Bu fakultet bo‘yicha qisqacha ma’lumot."}
                </div>

                <div className="mt-4 flex justify-between text-xs text-white/45">
                  <span>ID: {f.id}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                    Faculty
                  </span>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
