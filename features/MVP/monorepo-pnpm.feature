Feature: monorepo pnpm

  Scenario: organize the repository as a workspace
    Given the product has grown beyond a single package
    When the repository is migrated to a monorepo
    Then the app runs from apps/web and pnpm becomes the main package manager
