import { test, expect } from '@playwright/test';

// Test configuration
const TEST_USER = {
  email: 'testuser2@example.com',
  password: 'testpass123'
};

const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:8000';

test.describe('Order Placement E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for navigation
    page.setDefaultTimeout(30000);
  });

  test('should complete order placement flow successfully', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Login
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL(/.*\/dashboard/, { timeout: 15000 });
    
    // Navigate to order placement page
    await page.goto('/order/place', { waitUntil: 'networkidle' });
    
    // Verify we're on the order placement page
    await expect(page.getByText('Place New Order')).toBeVisible();
    
    // Step 1: Order Details
    await page.fill('input[name="title"]', 'E2E Test Order - Payment Process');
    
    // Select subject
    await page.click('[data-testid="subject-select"]');
    await page.click('text=Computer Science');
    
    // Select order type 
    await page.click('[data-testid="type-select"]');
    await page.click('text=Research Paper');
    
    // Select academic level
    await page.click('[data-testid="level-select"]');
    await page.click('text=Undergraduate');
    
    // Set pages
    await page.fill('input[name="pages"]', '5');
    
    // Set deadline (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.fill('input[name="deadline"]', dateString);
    
    // Click Next to step 2
    await page.click('button:has-text("Next")');
    
    // Step 2: Requirements
    await page.fill('textarea[name="description"]', 'This is a test order to verify payment messaging and order creation process.');
    await page.fill('textarea[name="instructions"]', 'Please ensure:\n1. No immediate payment processing\n2. Clear payment instructions\n3. Proper error handling');
    
    // Select citation style
    await page.click('[data-testid="citation-select"]');
    await page.click('text=APA');
    
    // Set sources
    await page.fill('input[name="sources"]', '5');
    
    // Click Next to step 3
    await page.click('button:has-text("Next")');
    
    // Step 3: Files (optional - skip)
    await page.click('button:has-text("Next")');
    
    // Step 4: Payment
    await expect(page.getByText('Budget & Payment Method Preference')).toBeVisible();
    
    // Verify payment warnings are displayed
    await expect(page.getByText('No payment will be processed now')).toBeVisible();
    await expect(page.getByText('Payment instructions will be sent via email')).toBeVisible();
    
    // Set budget
    await page.fill('input[name="budget"]', '150');
    
    // Select payment method
    await page.click('text=Credit/Debit Card');
    
    // Click Next to review
    await page.click('button:has-text("Next")');
    
    // Step 5: Review
    await expect(page.getByText('Review Your Order')).toBeVisible();
    
    // Verify payment warnings in review
    await expect(page.getByText('No payment will be processed now')).toBeVisible();
    await expect(page.getByText('Final cost may vary based on order complexity')).toBeVisible();
    
    // Verify order details
    await expect(page.getByText('E2E Test Order - Payment Process')).toBeVisible();
    await expect(page.getByText('Computer Science')).toBeVisible();
    await expect(page.getByText('Research Paper')).toBeVisible();
    
    // Intercept the order creation request to verify payload
    let orderRequest: any = null;
    await page.route('**/api/v1/orders/', async (route) => {
      if (route.request().method() === 'POST') {
        orderRequest = JSON.parse(route.request().postData() || '{}');
        // Continue with the actual request
        await route.continue();
      } else {
        await route.continue();
      }
    });
    
    // Submit the order
    await page.click('button:has-text("Place Order")');
    
    // Wait for potential redirect or success message
    await page.waitForTimeout(3000);
    
    // Verify the request payload had correct format
    expect(orderRequest).toBeTruthy();
    expect(orderRequest.title).toBe('E2E Test Order - Payment Process');
    expect(orderRequest.subject).toBe('computer science'); // Should be lowercase choice value
    expect(orderRequest.type).toBe('research paper'); // Should be with space, not underscore
    expect(orderRequest.level).toBe('bachelors'); // Should be backend choice value
    expect(orderRequest.style).toBe('apa7'); // Should be backend choice value
    
    console.log('Order request payload:', JSON.stringify(orderRequest, null, 2));
  });

  test('should display correct payment method options', async ({ page }) => {
    // Login and navigate to payment step
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/dashboard/);
    
    await page.goto('/order/place');
    
    // Fill minimal required fields and navigate to payment step
    await page.fill('input[name="title"]', 'Payment Test');
    await page.click('[data-testid="subject-select"]');
    await page.click('text=Computer Science');
    await page.click('[data-testid="type-select"]');
    await page.click('text=Essay');
    await page.click('[data-testid="level-select"]');
    await page.click('text=Undergraduate');
    await page.fill('input[name="pages"]', '3');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.fill('input[name="deadline"]', dateString);
    
    // Navigate to payment step
    await page.click('button:has-text("Next")'); // Requirements
    await page.fill('textarea[name="description"]', 'Test description');
    await page.fill('textarea[name="instructions"]', 'Test instructions');
    await page.click('[data-testid="citation-select"]');
    await page.click('text=APA');
    
    await page.click('button:has-text("Next")'); // Files
    await page.click('button:has-text("Next")'); // Payment
    
    // Verify payment method options
    await expect(page.getByText('Credit/Debit Card')).toBeVisible();
    await expect(page.getByText('PayPal')).toBeVisible();
    await expect(page.getByText('Bank Transfer')).toBeVisible();
    
    // Verify payment warnings
    await expect(page.getByText('You are only selecting your preferred payment method')).toBeVisible();
    await expect(page.getByText('Payment will be processed only after order review')).toBeVisible();
  });

  test('should handle validation errors gracefully', async ({ page }) => {
    // Login and navigate to order form
    await page.goto('/login');
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/dashboard/);
    
    await page.goto('/order/place');
    
    // Try to proceed without filling required fields
    await page.click('button:has-text("Next")');
    
    // Verify validation errors are displayed
    await expect(page.getByText('Title is required')).toBeVisible();
    await expect(page.getByText('Subject is required')).toBeVisible();
    await expect(page.getByText('Order type is required')).toBeVisible();
  });
});