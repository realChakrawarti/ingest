.DEFAULT_GOAL = help

# Refer: https://make.mad-scientist.net/managing-recipe-echoing/
# When make V=1 or anything is passed, it shows all the commands withou "@"
$(V).SILENT:

# Node Package manager, default is pnpm. To use a different one, use make NODE_PM=npm/yarn
NODE_PM ?= pnpm

.PHONY: help
help:  ## display this help message
	@echo ---------------------
	@echo Usage: make ^<target^>
	@echo ---------------------
	@echo   build       builds optimized production build
	@echo   clean       remove .next directory, if exists
	@echo   debug       builds with output like rewrites, redirects, and headers
	@echo   dev         starts the development server + firebase emulator
	@echo   dev-seed    starts the development server + firebase emulator with seed data
	@echo   help        display this help message
	@echo --------
	@echo Examples:
	@echo --------
	@echo   make debug
	@echo   make build NODE_PM=npm


clean:  ## remove .next directory, if exists
	if not exist .next (@echo .next folder doesn't exists!) else (rmdir /s /q .next)

build: clean  ## builds optimized production build
	@echo Creating production build...
	${NODE_PM} build

debug: clean ## builds with output like rewrites, redirects, and headers
	${NODE_PM} build --debug

FIREBASE_START = firebase --project ingest-dev emulators:start
FIREBASE_EXPORT = firebase --project ingest-dev emulators:export seed

firebase-export: ## export firestore data
	${NODE_PM} ${FIREBASE_EXPORT}

firebase-dev:
	${NODE_PM} ${FIREBASE_START}

firebase-dev-seed:
	${NODE_PM} ${FIREBASE_START} --import=seed

next-dev:
	${NODE_PM} dev

dev: firebase-dev next-dev ## starts the development server + firebase emulator

dev-seed: firebase-dev-seed next dev ## starts the development server + firebase emulator with seed data

minor patch major:
	${NODE_PM} release --release-as $@

deps:
	pnpx dependex

.PHONY: minor patch major
