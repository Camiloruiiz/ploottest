Feature: workspace config

  Scenario: share base tool configuration
    Given the monorepo needs common tooling defaults
    When TypeScript and ESLint are configured
    Then shared config packages provide the base setup consumed by apps/web
