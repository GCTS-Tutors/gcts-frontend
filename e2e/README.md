# End-to-End Testing for GCTS Frontend

This directory contains E2E tests for the GCTS (Grand Canyon Tutoring Services) frontend application using Playwright.

## Setup

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Install Playwright browser binaries:
   ```bash
   npx playwright install
   ```

## Prerequisites

Before running the tests, ensure that:

1. **Backend is running** on `http://localhost:8000`
   ```bash
   cd /path/to/gcts-backend
   python manage.py runserver
   ```

2. **Frontend is running** on `http://localhost:3000` (or configured port)
   ```bash
   npm run dev
   ```

3. **Test user exists** in the backend database:
   - Email: `testuser2@example.com`
   - Password: `testpass123`
   - Role: `student`

## Running Tests

### Run all E2E tests
```bash
npm run test:e2e
```

### Run tests with UI mode (visual test runner)
```bash
npm run test:e2e:ui
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### Run specific test file
```bash
npx playwright test e2e/auth.spec.ts
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

## Test Structure

### Authentication Tests (`auth.spec.ts`)

Tests cover the complete authentication flow:

1. **Successful Login**
   - Navigates to login page
   - Fills credentials
   - Submits form
   - Verifies redirect to dashboard
   - Checks user information display

2. **Error Handling**
   - Invalid credentials
   - Empty form validation
   - Network errors
   - Server errors

3. **UI Functionality**
   - Password visibility toggle
   - Form validation
   - Loading states

4. **Authentication State**
   - Redirect for authenticated users
   - Logout functionality
   - Session persistence

5. **API Integration**
   - Correct request format verification
   - Response handling
   - Error response handling

## Test Data

The tests use a predefined test user:
- **Email:** `testuser2@example.com`
- **Password:** `testpass123`
- **Role:** `student`

Make sure this user exists in your backend database before running tests.

## Configuration

The test configuration is in `playwright.config.ts`:
- Base URL: `http://localhost:3000`
- Browsers: Chrome, Firefox, Safari
- Automatic web server startup
- Trace collection on test failure

## Debugging

### View test results
```bash
npx playwright show-report
```

### Run with trace
```bash
npx playwright test --trace on
```

### Debug specific test
```bash
npx playwright test --debug -g "should successfully log in"
```

## Common Issues

1. **Port conflicts**: Make sure ports 8000 (backend) and 3000 (frontend) are available
2. **Test user missing**: Create the test user in your backend database
3. **Network timeouts**: Increase timeout in config if your local setup is slow
4. **Browser installation**: Run `npx playwright install` if tests fail with browser errors

## Adding New Tests

1. Create test files in the `e2e/` directory
2. Follow the naming convention: `*.spec.ts`
3. Use the existing test structure as a template
4. Include proper setup and cleanup
5. Add documentation for new test scenarios

## Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

This includes:
- Test results summary
- Screenshots on failure
- Trace files for debugging
- Performance metrics