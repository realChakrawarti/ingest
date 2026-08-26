set shell := ["cmd.exe", "/c"]

NODE_PM := "bun"
FIREBASE_START := "firebase --project ingest-outbuild emulators:start"
FIREBASE_EXPORT := "firebase --project ingest-outbuild emulators:export seed"

# list the available recipes
[default]
list:
    @just --list --unsorted

# check for any linter errors in the codebase
[group("Chore")]
lint level="":
    {{ NODE_PM }} oxlint {{ if level == "error" { "--quiet" } else { "" } }}

# format and fix all linter errors in the codebase
[group("Chore")]
format mode="":
    {{ NODE_PM }} oxfmt --{{ mode }}

# fix all formatting errors in the codebase
[group("Chore")]
format-on-save path:
    {{ NODE_PM }} oxfmt --stdin-filepath={{ path }}

# install all the project dependencies
[group("Chore")]
setup:
    {{ NODE_PM }} install

# remove .next directory, if exists
[group("Chore")]
clean:
    if not exist .next (@echo .next folder doesn't exists!) else (rmdir /s /q .next)

# build optimized production build
[group("Build")]
build: clean
    @echo Creating production build...
    {{ NODE_PM }} build

# build with output like rewrites, redirects, and headers
[group("Build")]
debug: clean
    {{ NODE_PM }} build --debug

# export firestore data
[group("Development")]
export-seed:
    {{ NODE_PM }} {{ FIREBASE_EXPORT }}

[private]
firebase-dev:
    {{ NODE_PM }} {{ FIREBASE_START }}

[private]
import-seed:
    {{ NODE_PM }} {{ FIREBASE_START }} --import=seed

[private]
next-dev:
    {{ NODE_PM }} dev

# starts the development server + firebase emulator
[group("Development")]
[parallel]
start: firebase-dev next-dev

# starts the development server + firebase emulator with seed data
[group("Development")]
[parallel]
start-seed: import-seed next-dev

# update the CONTRIBUTING.md with all the project dependencies metadata
[group("Chore")]
deps:
    pnpx dependex

# update the project to use the unified radix-ui mono package instead of individual @radix-ui/react-* packages
[group("Chore")]
ui-migrate:
    pnpx shadcn@latest migrate radix

# release <as>: patch|minor|major
[arg('as', pattern='patch|minor|release')]
[group("Build")]
release as:
    {{ NODE_PM }} release --release-as {{ as }}

# run tests in either unit | browser Node.js
[group("Testing")]
[arg('mode', pattern='unit|browser')]
test-run mode="unit":
    {{ NODE_PM }} test --project {{ mode }}

# run browser preview tests in watch mode
[group("Testing")]
[arg('mode', pattern='unit|browser')]
test-watch mode="unit":
    {{ NODE_PM }} test:watch --project {{ mode }}
