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
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

lint:
	npm run lint

typecheck:
	npm run typecheck

test:
	npm test

test-watch:
	npm run test:watch

test-e2e:
	npm run test:e2e

test-ui:
	npm run test:ui

seed:
	npm run seed:products

check:
	npm run lint
	npm run typecheck
	npm test
