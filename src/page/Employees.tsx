import { useEffect, useState } from "react";
import { getTeachers, deleteTeacher } from "../services/teachers";
import { hasToken } from "../utils/auth";
export default function Employees() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="ts-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="ts-chip">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Key Employees
          </div>
          <h2 className="mt-3 text-2xl font-semibold">Xodimlar</h2>
         <p className="mt-1 text-sm text-white/60">
            {isAdmin ? "Admin rejim: tahrirlash mumkin" : "Guest rejim: faqat ko‘rish"}
          </p>
        </div>
        <button className="ts-btn" onClick={load}>Yangilash</button>
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
              <div key={t.id} className="ts-card ts-card-hover p-5 relative">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full border border-white/10 bg-white/10 grid place-items-center">
                    <span className="text-white/60">👤</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{t.full_name}</div>
                    <div className="text-xs text-white/50 truncate">
                      {t.position || "Teacher"}
                    </div>
                  </div>
                </div>

                
              {isAdmin && (
                <div className="mt-4 flex justify-end">
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
    </div>
  );
}
