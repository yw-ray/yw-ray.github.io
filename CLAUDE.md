# CLAUDE.md — Project Context for AI Agents

This file captures context that AI coding assistants (Claude, etc.) need to
continue work on this repository without re-discovering the environment.

## What this repo is

Personal academic webpage for **Youngwoo (Ray) Jeong**, built with **Jekyll**
(theme: Dumbarton by Tyler Butler) and deployed to **GitHub Pages** at
`https://yw-ray.github.io`.

- `index.md` — home page intro (markdown, rendered via `_layouts/home.html`)
- `_data/education.yml`, `_data/experience.yml`, `_data/honors.yml`,
  `_data/skills.yml` — structured content for sidebar sections
- `_bibliography/papers.bib` — publications list. Entries with
  `selected={true}` appear in the "Selected Publications" card on the home
  page; all entries appear on the Publications page.
- `_bibliography/presentations.bib` — talks/presentations list
- `_includes/head.html` — page `<head>` including a **`<base href>` tag that
  uses `{{ site.url }}`** (this is load-bearing — see gotcha below)
- `_config.yml` — production config. `url: "https://yw-ray.github.io"` is
  used by `<base href>` and OpenGraph tags.
- `_config_dev.yml` — **gitignored** local-dev override that sets
  `url: "http://localhost:4000"` so the `<base href>` doesn't redirect
  asset requests to production during local preview.

## Current state (April 2026)

Owner is transitioning from MangoBoost (Software Engineer, ending Jun 2026)
to a **Ph.D. in ECE at NYU** advised by Prof. Austin Rovinski. The webpage
is being pre-staged for deployment around that transition.

### Branch layout

- `dev` (live/main) — production branch that GitHub Pages publishes at
  `https://yw-ray.github.io`. **Do not push transition content here yet.**
  Only this `CLAUDE.md` and the `_config_dev.yml` gitignore entry live
  here ahead of the switch.
- `june-deploy` — staging branch holding the NYU transition content.
  When the switch happens (around Jun 2026), merge or fast-forward `dev`
  to this branch.

### What's on `june-deploy` (not on `dev`)

- `index.md` — new intro: "Ph.D. student in ECE at NYU, advised by
  Austin Rovinski". Previous MangoBoost/Seoultech history kept as a
  "Previously" paragraph. Research interests: Computer Architecture,
  Domain-Specific Accelerators, HW/SW Co-Design, FPGA prototyping. HLS was
  removed.
- `_data/education.yml` — NYU Ph.D. in ECE (2026–) prepended; M.S./B.S.
  Seoultech kept below.
- `_data/experience.yml` — MangoBoost SW Engineer end date changed from
  "Present" to `Jun 2026`.
- `_bibliography/papers.bib` — new selected entry at top of file:
  `MangoBoost SANA: Fast, Scalable, and Flexible Storage Architecture with
  NVMe/TCP Acceleration`, ISCA 2026 Industry Track. Author currently
  listed as `MangoBoost`; swap to individual authors when the real author
  list is known.
- `_includes/education.html`, `_includes/experience.html` — logo
  `<img>` inline style changed from `max-width:50px;max-height:50px` to
  `width:50px;height:50px;object-fit:contain;` so rectangular logos (e.g.
  NYU) render without getting cropped or looking inconsistent next to
  square logos.
- `_config.yml` — `occupation: Ph.D. Student at NYU`; email changed to
  `tori961227@gmail.com` (both `email` keys).
- `assets/img/icons/nyu_logo.png` — NYU torch logo (300×168, PNG).

To continue transition work, check out `june-deploy`, not `dev`.

## Local development workflow (this machine)

### Environment quirks — READ THIS FIRST

- `$HOME` is on **NFS** (mounted from `10.1.0.1:/home`). NFS does not
  support `flock()`, which breaks `gem install` to `~/.local/share/gem/`
  with `Errno::EBADF - Bad file descriptor @ rb_file_flock`. If that
  error appears, do NOT try to reinstall to the same path — it will
  corrupt the gemspec and the error will persist even for unrelated
  gem commands.
- Workaround: install gems to local disk. Set `GEM_HOME=/tmp/gems_yw`
  before any `gem`/`bundle` command. This directory is already populated
  with Jekyll 4.4.1 + Bundler 2.5.23 + all Gemfile deps as of the last
  session.
- `ruby-dev` (Ubuntu package) must be installed — native extensions like
  `http_parser.rb` need it. It is installed on this host.
- Docker is present but this user is not in the `docker` group, so
  `docker run` fails with a socket permission error. Don't try to use
  the `jekyll/jekyll` container as a workaround for the NFS issue.

### Build and serve

```bash
export GEM_HOME=/tmp/gems_yw GEM_PATH=/tmp/gems_yw PATH=/tmp/gems_yw/bin:$PATH

# Build the site merging dev config on top of prod config.
# _config_dev.yml overrides site.url to http://localhost:4000 so that
# <base href> in _includes/head.html does not route asset URLs to the
# production GitHub Pages domain during local preview.
bundle exec jekyll build --config _config.yml,_config_dev.yml

# Serve the built _site/. Jekyll's WEBrick is single-threaded and causes
# image-load stalls over SSH port forwarding, so use Python's threaded
# HTTP server instead.
cd _site && python3 -c '
import http.server, socketserver, os
os.chdir("'"$PWD"'")
class H(http.server.SimpleHTTPRequestHandler): pass
class TS(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
TS(("0.0.0.0", 4000), H).serve_forever()
' &
```

Access from a laptop via SSH local forward:

```bash
ssh -L 4000:localhost:4000 youngwoo.jeong@<this-host>
# then open http://localhost:4000/ in the laptop browser
```

### Key gotcha: `<base href>` and localhost testing

`_includes/head.html` contains `<base href="{{ site.url }}">`. Because
`<base href>` overrides the **scheme and host** for every relative URL on
the page (including leading-slash "absolute" paths like
`/assets/img/icons/nyu_logo.png`), a page served from `localhost:4000`
will still try to fetch its assets from `site.url`. If `site.url` is the
GitHub Pages domain, any asset not yet deployed to production 404s.

Fix: build with `--config _config.yml,_config_dev.yml` (dev file
overrides `url` to `http://localhost:4000`). Do not remove the
`<base href>` tag from `head.html` — it is needed in production for
OpenGraph/Twitter cards and the `<meta property="og:url">` sibling tags.

### Rebuild after edits

Python's `http.server` serves `_site/` directly; it does NOT watch for
changes. After editing `index.md`, `_data/*.yml`, `_bibliography/*.bib`,
or any `_includes/*.html`, run `bundle exec jekyll build --config
_config.yml,_config_dev.yml` again and hard-refresh the browser.

## Deployment

GitHub Pages auto-deploys from the `dev` branch (main working branch).
The live site is `https://yw-ray.github.io`. A GitHub Actions workflow
(existing, configured before this session) handles the build. To ship:
commit → push to `dev` → GitHub Pages rebuilds from production
`_config.yml` (without the dev override).

**Target deployment window: June 2026**, aligned with the NYU Ph.D.
start date and end of the MangoBoost tenure. Until then, keep transition
content on `june-deploy` and leave `dev` untouched except for
documentation like this file.

## Commit style for this repo

Short imperative subject lines (see `git log --oneline`). Examples:

- `Replace Font Awesome kit with CDN for reliable icon loading`
- `Fix referrer policy blocking Font Awesome webfont loading`

No strict prefix convention ([Frontend/...] etc.) on this repo — it's a
personal site, not the `mats-monorepo`. Keep messages under ~70 chars.
