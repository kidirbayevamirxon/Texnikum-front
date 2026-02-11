import { useEffect, useState } from "react";
import { getProvisions } from "../services/provisions";

export default function Provisions() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProvisions()
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="ts-card p-6">
      <div>
        <div className="ts-chip">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Provisions
        </div>
        <h2 className="mt-3 text-2xl font-semibold">Texnikum yetishganlari</h2>
        <p className="mt-1 text-sm text-white/60">Deficiency / kerakli resurslar</p>
      </div>
      {loading ? (
        <div className="mt-6 text-white/60">Yuklanmoqda...</div>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/60">
          Ma’lumot yo‘q
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="ts-card ts-card-hover p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl border border-white/10 bg-emerald-400/10 grid place-items-center">
                  ✅
                </div>
                <div className="min-w-0">
                  <div className="font-semibold">{item.title}</div>
                  {item.description && (
                    <p className="mt-2 text-sm text-white/65 line-clamp-4">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
