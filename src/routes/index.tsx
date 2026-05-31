import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Search, ExternalLink, FileArchive, FileCode2, FileText, Package, BarChart3 } from "lucide-react";

type Resource = {
  id: string;
  title: string;
  description: string;
  category: string;
  filename: string;
  size_bytes: number;
  version: string;
  source_url: string;
  tags: string[];
  sort_order: number;
  download_count: number;
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const BUCKET = "swmm5-files";
const publicUrl = (filename: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filename}`;

const resourcesQuery = queryOptions({
  queryKey: ["resources"],
  queryFn: async (): Promise<Resource[]> => {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Resource[];
  },
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EPASWMM5 Basics — Installer & Source Library" },
      {
        name: "description",
        content:
          "Download EPA SWMM 5.2.4 Windows installers, computational engine and GUI source code, and release notes from one searchable page.",
      },
      { property: "og:title", content: "EPASWMM5 Basics" },
      {
        property: "og:description",
        content:
          "Searchable mirror of EPA Storm Water Management Model 5.2.4 installers and source code.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(resourcesQuery),
  component: Index,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-xl font-semibold mb-2">Couldn't load the library</h1>
        <p className="text-muted-foreground text-sm">{error.message}</p>
      </div>
    </div>
  ),
});

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function categoryIcon(category: string) {
  switch (category) {
    case "Installer":
      return Package;
    case "Source Code":
      return FileCode2;
    case "Reference":
      return FileText;
    default:
      return FileArchive;
  }
}

function Index() {
  const { data: resources } = useSuspenseQuery(resourcesQuery);
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    resources.forEach((r) => set.add(r.category));
    return ["All", ...Array.from(set)];
  }, [resources]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((r) => {
      if (activeCategory !== "All" && r.category !== activeCategory) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.filename.toLowerCase().includes(q)
      );
    });
  }, [resources, query, activeCategory]);

  const totalDownloads = useMemo(
    () => resources.reduce((sum, r) => sum + (r.download_count ?? 0), 0),
    [resources],
  );

  const handleDownload = (id: string) => {
    // Optimistic local update
    queryClient.setQueryData<Resource[]>(["resources"], (prev) =>
      prev?.map((r) =>
        r.id === id ? { ...r, download_count: (r.download_count ?? 0) + 1 } : r,
      ),
    );
    // Fire-and-forget RPC; reconcile on response
    void supabase
      .rpc("increment_download_count", { _resource_id: id })
      .then(({ data, error }) => {
        if (error) {
          queryClient.invalidateQueries({ queryKey: ["resources"] });
          return;
        }
        if (typeof data === "number") {
          queryClient.setQueryData<Resource[]>(["resources"], (prev) =>
            prev?.map((r) => (r.id === id ? { ...r, download_count: data } : r)),
          );
        }
      });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              EPA · Storm Water Management Model
            </span>
            <Badge variant="secondary" className="font-mono text-xs">v5.2.4</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            EPASWMM5 Basics
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            A searchable library of the official EPA SWMM 5.2.4 Windows installers and
            computational engine source code — mirrored for fast download. Use the
            search and category filters below to find what you need.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card font-mono text-xs text-muted-foreground">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>
              <span className="text-foreground font-semibold">{totalDownloads.toLocaleString()}</span> total downloads
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files, tags, descriptions…"
              className="pl-9 font-mono text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = activeCategory === c;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-foreground/40"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
          <p className="text-xs font-mono text-muted-foreground">
            {filtered.length} of {resources.length} files
          </p>
        </div>

        <ul className="grid gap-4 md:grid-cols-2">
          {filtered.map((r) => {
            const Icon = categoryIcon(r.category);
            const downloadHref = publicUrl(r.filename);
            return (
              <li
                key={r.id}
                className="group border border-border rounded-lg p-5 bg-card hover:border-foreground/30 transition-colors flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-semibold leading-snug truncate">{r.title}</h2>
                      <p className="font-mono text-xs text-muted-foreground truncate">
                        {r.filename}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] shrink-0">
                    {r.category}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {r.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {r.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-border">
                  <div className="font-mono text-xs text-muted-foreground flex flex-col gap-0.5">
                    <span>{formatBytes(r.size_bytes)} · v{r.version}</span>
                    <span className="inline-flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {(r.download_count ?? 0).toLocaleString()} downloads
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <a
                        href={r.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View on EPA.gov"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button asChild size="sm">
                      <a href={downloadHref} download onClick={() => handleDownload(r.id)}>
                        <Download className="h-4 w-4 mr-1.5" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {filtered.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <p className="font-mono text-sm text-muted-foreground">
              No files match your search.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 text-xs font-mono text-muted-foreground flex flex-col md:flex-row gap-3 justify-between">
          <p>
            Files mirrored from the U.S. Environmental Protection Agency. SWMM is public-domain software.
          </p>
          <a
            href="https://www.epa.gov/water-research/storm-water-management-model-swmm"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            epa.gov/water-research/storm-water-management-model-swmm →
          </a>
        </div>
      </footer>
    </div>
  );
}
