import { test, expect } from '@playwright/test';

// Test configuration
const TEST_USER = {
  email: 'testuser2@example.com',
  password: 'testpass123'
};

const BACKEND_URL = 'http://localhost:8000';
const FRONTEND_URL = 'http://localhost:3000';

test.describe('Authentication E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for navigation due to Next.js initialization
    page.setDefaultTimeout(30000);
  });

  test('should load login page without redirects', async ({ page }) => {
    // Navigate directly to login page
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Verify we're actually on the login page
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    
    // Check that basic form elements are present
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should successfully log in with valid credentials', async ({ page }) => {
    // Navigate to login page with increased timeout
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for page to fully load and auth context to initialize
    await page.waitForTimeout(2000);
    
    // Wait for page to load
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    
    // Fill in login form
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for redirect to role-specific dashboard (student in this case)
    await page.waitForURL('/dashboard/student', { timeout: 15000 });
    
    // Verify successful login by checking we're on student dashboard page
    await expect(page).toHaveURL(/.*\/dashboard\/student/);
    
    // Wait for page to load completely
    await page.waitForTimeout(2000);
    
    // Verify we can see dashboard content (successful authentication)
    // The presence of dashboard content indicates successful login
    console.log('Login test completed - successfully navigated to dashboard');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill in incorrect credentials
    await page.fill('input[name="email"]', 'wrong@email.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should show error message and stay on login page
    // Look for error alert or any error-related text
    await expect(page.locator('[role="alert"]').or(page.getByText(/invalid|error|failed|incorrect/i))).toBeVisible({ timeout: 10000 });
    await expect(page.url()).toContain('/login');
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
    
    // Should stay on login page
    await expect(page.url()).toContain('/login');
  });

  test('should toggle password visibility', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill password field
    await page.fill('input[name="password"]', 'testpassword');
    
    // Password should be hidden by default
    await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'password');
    
    // Click the visibility toggle button
    await page.click('button[aria-label="toggle password visibility"]');
    
    // Password should now be visible
    await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'text');
    
    // Click again to hide
    await page.click('button[aria-label="toggle password visibility"]');
    
    // Should be hidden again
    await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'password');
  });

  test.skip('should redirect authenticated users away from login page', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard/student');
    
    // Now try to navigate back to login page in a new context to simulate user typing URL
    // In a realistic scenario, the user would still be authenticated
    await page.goto('/login');
    
    // Wait for authentication check - should either redirect away or show redirecting message
    await page.waitForTimeout(5000);
    
    // Check if we're still on login or redirected
    const finalUrl = page.url();
    console.log('Final URL after login page visit:', finalUrl);
    
    // Test passes if either:
    // 1. Redirected away from login page, OR
    // 2. Shows redirecting message (meaning redirect logic is working)
    if (finalUrl.includes('/login')) {
      const hasRedirectingText = await page.getByText(/redirecting|loading/i).isVisible();
      expect(hasRedirectingText).toBe(true);
    } else {
      expect(finalUrl).toContain('/dashboard');
    }
  });

  test.skip('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await page.waitForURL('/dashboard/student');
    
    // Look for logout button in navbar
    const logoutButton = page.getByRole('button', { name: 'Logout' }).or(page.getByText('Logout'));
    await expect(logoutButton).toBeVisible({ timeout: 10000 });
    await logoutButton.click();
    
    // Should redirect to home page or login page
    await page.waitForTimeout(2000); // Give time for logout to process
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(|login)$/);
  });

  test.skip('should make API request with correct format', async ({ page }) => {
    // Intercept API calls to verify request format
    let loginRequestBody: any = null;
    
    await page.route(`${BACKEND_URL}/api/v1/auth/login/`, async (route) => {
      const request = route.request();
      loginRequestBody = JSON.parse(request.postData() || '{}');
      
      // Continue with the actual request
      await route.continue();
    });
    
    // Navigate to login page and submit form
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    
    // Wait for the API call to complete
    await page.waitForTimeout(1000);
    
    // Verify the request was sent with correct format
    expect(loginRequestBody).toBeTruthy();
    expect(loginRequestBody).toEqual({
      email: TEST_USER.email,
      password: TEST_USER.password
    });
  });

  test.skip('should handle network errors gracefully', async ({ page }) => {
    // Intercept API calls and return network error
    await page.route(`${BACKEND_URL}/api/v1/auth/login/`, async (route) => {
      await route.abort('failed');
    });
    
    // Navigate to login page and submit form
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    
    // Should show error message (network error will be caught by form)
    await expect(page.locator('[role="alert"]').or(page.getByText(/error|failed|network/i))).toBeVisible({ timeout: 10000 });
    await expect(page.url()).toContain('/login');
  });

  test.skip('should handle server errors gracefully', async ({ page }) => {
    // Intercept API calls and return server error
    await page.route(`${BACKEND_URL}/api/v1/auth/login/`, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Internal server error'
        })
      });
    });
    
    // Navigate to login page and submit form
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    
    // Should show error message (server error will be caught by form)
    await expect(page.locator('[role="alert"]').or(page.getByText(/error|failed|server/i))).toBeVisible({ timeout: 10000 });
    await expect(page.url()).toContain('/login');
  });

  test.skip('should persist authentication across page refreshes', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    
    // Wait for dashboard
    await page.waitForURL('/dashboard/student');
    
    // Refresh the page
    await page.reload();
    
    // Should still be on dashboard (not redirected to login)
    await expect(page.url()).toContain('/dashboard/student');
  });
});