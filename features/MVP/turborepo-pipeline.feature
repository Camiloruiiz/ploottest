Feature: turborepo pipeline

  Scenario: orchestrate workspace tasks
    Given the repository uses multiple workspace packages
    When development and CI tasks run
    Then Turbo coordinates build, lint, typecheck and test commands from the root
