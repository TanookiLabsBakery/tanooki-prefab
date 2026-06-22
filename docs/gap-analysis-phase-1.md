# AllSpark Social — Phase 1 Visual QA & Gap Analysis

**Date:** 2026-06-22  
**Tester:** AllSpark Builder Agent  
**Method:** Chrome DevTools — full visual QA of all routes, plus PRD feature audit

---

## QA Results Summary

All 13 pages tested. 7 bugs fixed during this session. 0 blocking render errors or console errors in the final state.

| Page                 | URL                              | Render | Console | Network | Notes                                                              |
| -------------------- | -------------------------------- | ------ | ------- | ------- | ------------------------------------------------------------------ |
| Dashboard            | `/dashboard`                     | PASS   | PASS    | PASS    | All 3 stat cards, scheduled + needs-approval + published sections  |
| Content Calendar     | `/dashboard/calendar`            | PASS   | PASS    | PASS    | Month view, posts on correct dates, today highlighted              |
| Composer (New Post)  | `/dashboard/compose`             | PASS   | PASS    | PASS    | Channel tabs disambiguated with provider names                     |
| Connect Channel      | `/dashboard/channels/connect`    | PASS   | PASS    | PASS    | All 3 providers (Bluesky, Threads, Mastodon) with icons            |
| Profile              | `/profile`                       | PASS   | PASS    | PASS    | Date formatted, document title set                                 |
| Profile Edit         | `/profile/edit`                  | PASS   | PASS    | PASS    | First/last name, disabled email, avatar                            |
| Post Analytics       | `/dashboard/posts/:id/analytics` | PASS   | PASS    | PASS    | Stats cards, engagement chart, per-channel breakdown               |
| Admin Dashboard      | `/internal-admin/dashboard`      | PASS   | PASS    | PASS    | Users table with formatted dates                                   |
| Onboarding Welcome   | `/onboarding/welcome`            | PASS   | PASS    | PASS    | 3-step indicator, full-screen without sidebar                      |
| Features (marketing) | `/features`                      | PASS   | PASS    | PASS    | Fixed: now shows AllSpark Social content                           |
| Login (email)        | `/login`                         | PASS   | PASS    | PASS    | Magic link flow                                                    |
| Login (credentials)  | `/login/credentials`             | PASS   | PASS    | PASS    | Email + password form                                              |
| Root / Landing       | `/`                              | PASS   | PASS    | PASS    | Fixed: AllSpark Social hero, redirects to dashboard when logged in |

---

## Bugs Fixed This Session

| #   | Issue                                                   | Fix                                                                                                   |
| --- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1   | Calendar post cards linked to blank new composer        | `ComposerScreen` now reads `location.state.postId` and shows `PostDetailView` with `ApprovalControls` |
| 2   | APP_NAME `.env` showed "CRM PRD Gap Closure"            | Updated `.env` to `APP_NAME="AllSpark Social"`                                                        |
| 3   | Analytics chart labels ambiguous for same-name channels | Added `(Provider)` suffix when duplicate channel names detected                                       |
| 4   | Profile page: raw ISO date, no document title           | `format()` from date-fns + `useDocumentTitle("Profile")`                                              |
| 5   | Connect Channel: only Threads shown                     | Added Bluesky and Mastodon cards with SVG icons                                                       |
| 6   | Dashboard "Needs Approval" cards linked to calendar     | Now link to Composer with `state={{ postId }}` → PostDetailView                                       |
| 7   | Marketing layout: "Prefab" branding throughout          | Updated header, footer, landing page, and features page to AllSpark Social                            |

---

## Gap Analysis — PRD vs. Implementation

Gaps are ordered by PRD priority (P0 → P1 → P2) then by user impact.

---

### 🔴 P0 Gaps — Critical for MVP Launch

#### GAP-01: No URL-to-Variants Repurpose Flow (F-09)

**PRD requirement:** "Paste a blog post URL and instantly receive platform-optimized variants for every connected channel — with brand voice applied."  
**Current state:** The Composer has no URL input field. There is no "repurpose from URL" entry point anywhere in the app.  
**Impact:** This is described as the marquee feature of the product. The AllSpark Agent's primary use case (`posts.suggest_variants_from_url` MCP tool) depends on this.  
**Scope:** URL input in composer header → server-side content fetch → Claude variant generation per channel → auto-populate variant tabs.

#### GAP-02: No Brand Voice Settings Page (F-10)

**PRD requirement:** Workspace Settings page with: Tone selector, Messaging Pillars (5 free-text), Words to Avoid (50 entries), Approved Hashtag Sets.  
**Current state:** The `BrandVoiceLinter` component exists in the Composer (it shows a linting result when brand voice guidelines are present on the organization), but there is no Settings page to actually configure brand voice. The `brandVoiceGuidelines` field exists on the Organization model but can only be set via database/Rails console.  
**Impact:** Linting runs but there is nothing to lint against unless seed data is manually set. Brand voice is the foundation of F-09, F-10, F-12.  
**Scope:** New "Organization Settings" screen with brand voice configuration form + GraphQL mutation to save.

#### GAP-03: Calendar Week View Missing (F-07)

**PRD requirement:** Calendar renders in both month view (default) and week view. Week view places posts in 30-minute time slots for precise scheduling visibility.  
**Current state:** Only month view is implemented. There is no week view toggle.  
**Impact:** Scheduling precision — users cannot see exact time slots or Best-Time indicators on the calendar.  
**Scope:** Week view tab in CalendarScreen, 30-minute slot grid, Best-Time indicators on empty slots.

#### GAP-04: Calendar Cards Not Color-Coded by Channel (F-07)

**PRD requirement:** "Each scheduled post appears as a color-coded card: blue (Bluesky), purple (Mastodon), green (Threads). Published posts shown with a checkmark overlay. Failed posts shown with a red indicator."  
**Current state:** All calendar cards are the same neutral/outline style. Published posts have no checkmark. Failed posts have no red indicator.  
**Impact:** At a glance, users cannot distinguish which channel a calendar post targets.  
**Scope:** Channel-color mapping in CalendarScreen, status overlay icons (checkmark for published, red dot for failed).

#### GAP-05: Drag-to-Reschedule Missing (F-08)

**PRD requirement:** Post cards in calendar are draggable. Drop on a new date/slot reschedules the underlying Sidekiq job.  
**Current state:** Calendar cards are static buttons. No drag interaction.  
**Impact:** Rescheduling requires navigating to the post edit view. High friction for bulk calendar adjustments.  
**Scope:** Add drag-and-drop library (e.g., `@dnd-kit/core`) to CalendarScreen, `PostReschedule` mutation on backend.

#### GAP-06: "Generate Variants" AI Button Missing (F-04)

**PRD requirement:** "Generate Variants" button in composer calls Claude to rewrite the shared draft as a channel-appropriate variant for each connected channel.  
**Current state:** Users manually edit per-channel variant tabs. There is no AI generation button — variants start blank and must be typed manually (or copy-pasted from the shared draft).  
**Impact:** Core AI value prop is absent from the primary compose flow.  
**Scope:** "Generate Variants" button → `PostGenerateVariantsMutation` (calls Claude) → auto-populate variant tab bodies.

#### GAP-07: MCP Server Not Verified (F-13)

**PRD requirement:** 9 MCP tools + 3 prompts. `social:access` bearer auth. SSE transport. Web UI feature parity enforced.  
**Current state:** MCP server existence and tool implementations not verified during this QA session. Routes not visible in browser testing.  
**Impact:** The AllSpark Agent (Segment 3) is entirely blocked without a working MCP server.  
**Action:** Dedicated MCP server audit needed — test all 9 tools end-to-end via Claude Desktop.

---

### 🟡 P1 Gaps — Important for Full Feature Set

#### GAP-08: Channel Analytics Dashboard Missing (F-15)

**PRD requirement:** Dashboard showing 30/90-day trend charts per channel (follower count, impressions, engagement rate), top 5 performing posts, high-engagement contact list with "Export to CRM."  
**Current state:** Only per-post analytics exist (PostAnalyticsScreen). There is no channel-level dashboard accessible from the sidebar or anywhere in the app.  
**Impact:** Users cannot see channel-level trends or identify top performers without clicking into individual posts.  
**Scope:** New `ChannelAnalyticsScreen` at `/dashboard/analytics`, sidebar nav item, `ChannelAnalyticsQuery` in GraphQL.

#### GAP-09: Email-Based Approval Links Missing (F-16)

**PRD requirement:** Reviewer receives email with a secure, token-authenticated link. Approval page requires no login (passwordless). Actions: Approve or Request Changes.  
**Current state:** Approval works in-app only (`ApprovalControls` component shown in PostDetailView). There is no email notification, no `ApprovalRequest` model with a token, no passwordless reviewer page.  
**Impact:** External clients/reviewers cannot approve posts without a full app login. This is the core agency workflow.  
**Scope:** `ApprovalRequest` model with signed token, mailer with approval link, public passwordless `ApprovalController`, `ApprovalDecision` mutation.

#### GAP-10: No "All Posts" List View

**PRD requirement:** Not explicitly specified, but implied by the workflow — users need to browse posts by status (Drafts, Scheduled, Needs Approval, Published) without relying solely on the calendar.  
**Current state:** Posts are only visible in: (a) Dashboard sections (limited to 5–10 most recent per status), (b) Calendar (only scheduled/published, by date). There is no full list/table view to manage all posts.  
**Impact:** Users cannot find a draft they saved 2 weeks ago without scrolling the calendar.  
**Scope:** New `PostsListScreen` at `/dashboard/posts` with status filter tabs and pagination.

#### GAP-11: Sidebar Missing Key Nav Links

**Current state:** Sidebar has: Dashboard, Calendar, Profile. Missing: Compose (New Post), Connect Channel, Analytics.  
**Impact:** Users must return to Dashboard to create a new post. "Connect Channel" is only reachable via onboarding or direct URL.  
**Scope:** Add Compose (PenSquare icon), Connect Channel (Link icon), and Analytics links to sidebar nav.

---

### 🟢 P2 Gaps — Future Phases

#### GAP-12: Marketing Website → Social Auto-Draft (F-18)

Webhook receiver for `blog_post.published` events. Auto-creates draft variants from blog URL. Configurable approval vs. auto-schedule mode.  
**Status:** Not implemented. Planned for Phase 3.

#### GAP-13: CRM Engagement Signal Export (F-19)

Surface high-engagement contacts from analytics. `CrmExportJob` pushes to AllSpark CRM.  
**Status:** Not implemented. Planned for Phase 3.

#### GAP-14: Multi-Workspace / Client Brand Silos (F-17)

Multiple `ClientWorkspace` records per instance with full data isolation. Workspace switcher in nav.  
**Status:** Current app is single-organization. Multi-workspace would require significant data model changes.

#### GAP-15: Page Title Still Shows Old App Name

The `<title>` tag and meta tags still render "CRM PRD Gap Closure" because the Rails server loaded `.env` at startup before the APP_NAME correction. Requires a server restart to propagate.  
**Fix:** `touch tmp/restart.txt` or restart the Rails process.

---

## Recommended Next Phase Priorities

Based on impact vs. effort, the recommended order for Phase 2 work:

1. **GAP-02** — Brand Voice Settings page (enables F-10 linting AND F-09 repurpose context)
2. **GAP-06** — "Generate Variants" AI button (highest visible AI value prop)
3. **GAP-01** — URL-to-Variants repurpose (marquee feature, needs GAP-02 first)
4. **GAP-11** — Sidebar nav links (quick win, high daily UX impact)
5. **GAP-10** — All Posts list view (enables draft management workflow)
6. **GAP-08** — Channel Analytics Dashboard (completes analytics feature set)
7. **GAP-03 + GAP-04** — Calendar week view + channel color coding (calendar completeness)
8. **GAP-05** — Drag-to-reschedule (polished UX, needs GAP-03 first for week view slots)
9. **GAP-09** — Email-based approval links (required for agency/external reviewer workflow)
10. **GAP-07** — MCP Server audit (verify all 9 tools work end-to-end)
