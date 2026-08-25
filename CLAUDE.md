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

## Current state (June 2026)

Owner is incoming Fall 2026 Ph.D. student in ECE at NYU, advised by Prof.
Austin Rovinski. The NYU transition content was shipped to `dev` on
2026-06-02; the staging branch `june-deploy` has been deleted.

### Branch layout

- `dev` — the only working branch. GitHub Pages auto-deploys from here to
  `https://yw-ray.github.io`. Commit and push directly.

### Outstanding TODOs

- `_bibliography/papers.bib` — the selected ISCA 2026 entry
  (`MangoBoost SANA: ...`) currently lists the author as `MangoBoost`.
  Swap to individual authors when the real author list is known.

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

### Git identity and push account

Use this identity for commits in this repo:

- Author name: `Youngwoo Jeong`
- Author email: `tori961227@gmail.com`
- GitHub account/repo owner: `yw-ray`

Do not use the global `jini221220@gmail.com` identity for this repository.
If this host rewrites `git@github.com:yw-ray/...` to HTTPS and authenticates
as another GitHub account, push with an explicit config override, for example:

```bash
GIT_CONFIG_GLOBAL=/tmp/codex-empty-gitconfig \
  git push git@github.com:yw-ray/yw-ray.github.io.git dev
```

## Commit style for this repo

Short imperative subject lines (see `git log --oneline`). Examples:

- `Replace Font Awesome kit with CDN for reliable icon loading`
- `Fix referrer policy blocking Font Awesome webfont loading`

No strict prefix convention ([Frontend/...] etc.) on this repo — it's a
personal site, not the `mats-monorepo`. Keep messages under ~70 chars.
