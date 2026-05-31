## EPASWMM5 Basics — Plan

A searchable resource library hosting the official EPA SWMM5 Windows installer and C source code, served from Lovable Cloud Storage.

### 1. Files to fetch from EPA

From https://www.epa.gov/water-research/storm-water-management-model-swmm (current release 5.2.4):

- `swmm5_setup.exe` — Windows installer (~20 MB)
- `swmm5_source_code.zip` — C engine source code (~2 MB)

I'll download both via `curl` in the sandbox, verify size/type, then upload to a public Lovable Cloud Storage bucket named `swmm5-files`. If EPA URLs have shifted, I'll resolve the canonical links from the EPA page before downloading.

### 2. Backend (Lovable Cloud)

- Enable Lovable Cloud.
- Migration: create public storage bucket `swmm5-files` with public read RLS.
- Upload the two files to the bucket via a one-time script using the service role key.
- Create a `resources` table (id, title, description, category, filename, size_bytes, version, updated_at, tags[]) seeded with rows for each file so the library is data-driven and easy to extend later. Public read policy.

### 3. Frontend (single route `/`)

A searchable card grid:

- Hero header: "EPA SWMM5 Basics" + one-line intro + version badge (5.2.4).
- Search input (filters by title/description/tags, debounced).
- Category filter chips: Installer, Source Code.
- Cards: title, description, category badge, file size, "Download" button (links to public storage URL), "Copy link" action.
- Footer with attribution to US EPA and link to the official SWMM page.

Data fetched via TanStack Query → `useSuspenseQuery` in the loader pattern. Authoritative file list comes from the `resources` table.

### 4. Design

Clean technical/utility aesthetic — neutral background, mono-accent for category chips, IBM Plex / JetBrains Mono pairing to match the engineering tone. No design directions exploration since this is a utility library.

### Out of scope (can add later)

- Manuals/PDFs, tutorials, example INP files
- In-browser PDF viewer
- User accounts / favorites

### Technical notes

- Files are static — no edge function needed for downloads; public bucket URL is sufficient.
- Bucket file size limit: default 50 MB is enough for both files.
- The upload script runs once via `code--exec` with `SUPABASE_SERVICE_ROLE_KEY`; not part of the runtime app.
