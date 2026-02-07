import { useEffect, useMemo, useState } from "react";
import { getNews } from "../services/news";

interface NewsItem {
  id: number;
  description: string;
  photo?: string;
  created_date: string;
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNews()
      .then((res) => setNews(res.data))
      .finally(() => setLoading(false));
  }, []);

  const sortedNews = useMemo(() => {
    return [...news].sort(
      (a, b) => +new Date(b.created_date) - +new Date(a.created_date)
    );
  }, [news]);

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-48 -right-48 h-[560px] w-[560px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.08),transparent_60%)]" />
      </div>
      <section className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 pt-8 pb-6">
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
                <div className="text-xs text-white/50">Holat</div>
                <div className="mt-1 text-xl font-semibold">
                  {loading ? "Yuklanmoqda" : "Tayyor"}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs text-white/50">Oxirgi yangilik</div>
                <div className="mt-1 text-sm text-white/80">
                  {sortedNews[0]?.created_date
                    ? new Date(sortedNews[0].created_date).toLocaleString()
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
                  <div className="h-3 w-2/3 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="mt-4 h-3 w-28 bg-white/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
            <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-white/10 grid place-items-center">
              <span className="text-white/60">📰</span>
            </div>
            <div className="text-lg font-semibold">Hozircha yangiliklar yo‘q</div>
            <p className="mt-2 text-sm text-white/60">
              Yangi post qo‘shilganda shu yerda ko‘rinadi.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedNews.map((n) => {
              const title =
                n.description?.split(".")[0]?.trim() || "Yangilik";
              const dateLabel = new Date(n.created_date).toLocaleString();

              return (
                <article
                  key={n.id}
                  className="group relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-5 transition
                             hover:border-emerald-400/25 hover:bg-white/[0.07]"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-3xl ring-1 ring-emerald-400/15" />
                    <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 blur-xl" />
                  </div>
                  {n.photo ? (
                    <img
                      src={n.photo}
                      alt="news"
                      className="relative z-10 w-full h-40 object-cover rounded-2xl mb-4 border border-white/10"
                      loading="lazy"
                    />
                  ) : (
                    <div className="relative z-10 w-full h-40 rounded-2xl mb-4 border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.15),rgba(34,211,238,0.10),rgba(255,255,255,0.03))]" />
                  )}

                  <h3 className="relative z-10 text-lg font-semibold leading-snug">
                    {title}
                  </h3>

                  <p className="relative z-10 mt-2 text-sm text-white/65 line-clamp-4">
                    {n.description}
                  </p>

                  <div className="relative z-10 mt-4 flex items-center justify-between text-xs">
                    <span className="text-white/45">{dateLabel}</span>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-emerald-200">
                      NEW
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <footer className="mt-12 border-t border-white/10 pt-6 text-sm text-white/50">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} TechSchoolInfo</div>
            <div className="flex gap-4">
              <a className="hover:text-white transition" href="#">Contact</a>
              <a className="hover:text-white transition" href="#">Privacy</a>
              <a className="hover:text-white transition" href="#">Support</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
