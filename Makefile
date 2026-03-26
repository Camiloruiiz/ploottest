.PHONY: help install dev build start lint typecheck test test-watch test-e2e test-ui seed check

help:
	@echo "Available targets:"
	@echo "  make install     Install dependencies"
	@echo "  make dev         Run the app in development mode"
	@echo "  make build       Build the app for production"
	@echo "  make start       Start the production build"
	@echo "  make lint        Run ESLint"
	@echo "  make typecheck   Run TypeScript checks"
	@echo "  make test        Run unit tests"
	@echo "  make test-watch  Run unit tests in watch mode"
	@echo "  make test-e2e    Run Playwright end-to-end tests"
	@echo "  make test-ui     Update Playwright visual snapshots"
	@echo "  make seed        Load initial products from JSON"
	@echo "  make check       Run lint, typecheck and unit tests"

install:
	pnpm install

dev:
	pnpm dev

build:
	pnpm build

start:
	pnpm start

lint:
	pnpm lint

typecheck:
	pnpm typecheck

test:
	pnpm test

test-watch:
	pnpm test:watch

test-e2e:
	pnpm test:e2e

test-ui:
	pnpm test:ui

seed:
	pnpm seed:products

check:
	pnpm lint
	pnpm typecheck
	pnpm test
