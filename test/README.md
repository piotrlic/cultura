# Testing in Cultura

This document outlines the testing approach and setup for the Cultura project.

## Testing Stack

- **Unit and Component Testing**: Vitest + Testing Library for React
- **E2E Testing**: Playwright with Chromium browser

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Watch mode
npm run test:watch

# With UI
npm run test:ui

# With coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Testing Structure

### Unit and Component Tests

- Unit tests are located next to the components they test with a `.test.tsx` extension
- Vitest setup is in `test/setup/vitest.setup.ts`
- Configuration is in `vitest.config.ts`

### E2E Tests

- E2E tests are located in the `e2e` folder
- Page objects are in `e2e/pages`
- Configuration is in `playwright.config.ts`

## Guidelines

### Unit Tests

- Use mocks for external dependencies
- Write tests that focus on component behavior, not implementation details
- Leverage Testing Library's queries and user events for interaction testing

### E2E Tests

- Use Page Object Model pattern
- Test critical user flows
- Use locators for resilient element selection
- Leverage screenshots for visual comparison when needed

## Test Coverage

We aim for 70% test coverage for critical components and business logic. Coverage reports are generated when running `npm run test:coverage`.

## Continuous Integration

Tests are automatically run in GitHub Actions as part of our CI pipeline.
