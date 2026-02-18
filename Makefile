.DEFAULT_GOAL = help

# Refer: https://make.mad-scientist.net/managing-recipe-echoing/
# When make V=1 or anything is passed, it shows all the commands withou "@"
$(V).SILENT:

# Node Package manager, default is pnpm. To use a different one, use make NODE_PM=npm/yarn
NODE_PM ?= pnpm

FIREBASE_START = firebase --project ingest-dev emulators:start
FIREBASE_EXPORT = firebase --project ingest-dev emulators:export seed

.PHONY: help lint-check lint-fix minor patch major next-dev deps setup

help:  ## display this help message
	@echo ---------------------
	@echo Usage: make ^<target^>
	@echo ---------------------
	@echo   help        display this help message
	@echo   build       build optimized production build
	@echo   clean       remove .next directory, if exists
	@echo   debug       build with output like rewrites, redirects, and headers
	@echo   deps        update the CONTRIBUTING.md with all the dependencies metadata
	@echo   dev         start the development server + firebase emulator
	@echo   dev-seed    start the development server + firebase emulator with seed data
	@echo   lint        check for any linter errors in the codebase
	@echo   format      format and fix all linter errors in the codebase
	@echo   setup       install all the dependencies
	@echo   ui-migrate  update to use the unified radix-ui mono package instead of individual @radix-ui/react-* packages
	@echo --------
	@echo Examples:
	@echo --------
	@echo   make debug
	@echo   make build NODE_PM=npm

lint: ## check for any linter errors in the codebase
	${NODE_PM} biome lint --log-level=error --max-diagnostics=none --colors=off

format: lint ## format and fix all linter errors in the codebase
	${NODE_PM} biome format --write .

setup: ## install all the project dependencies
	${NODE_PM} install

clean:  ## remove .next directory, if exists
	if not exist .next (@echo .next folder doesn't exists!) else (rmdir /s /q .next)

build: clean  ## build optimized production build
	@echo Creating production build...
	${NODE_PM} build

debug: clean ## build with output like rewrites, redirects, and headers
	${NODE_PM} build --debug

firebase-export: ## export firestore data
	${NODE_PM} ${FIREBASE_EXPORT}

firebase-dev:
	${NODE_PM} ${FIREBASE_START}

firebase-dev-seed:
	${NODE_PM} ${FIREBASE_START} --import=seed

next-dev:
	${NODE_PM} dev

dev: firebase-dev next-dev ## starts the development server + firebase emulator

dev-seed: firebase-dev-seed next-dev ## starts the development server + firebase emulator with seed data

minor patch major:
	${NODE_PM} release --release-as $@

deps: ## update the CONTRIBUTING.md with all the project dependencies metadata
	pnpx dependex

ui-migrate: ## update the project to use the unified radix-ui mono package instead of individual @radix-ui/react-* packages
	pnpx shadcn@latest migrate radix
