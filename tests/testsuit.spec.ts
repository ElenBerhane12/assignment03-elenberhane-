import { test, expect } from '@playwright/test';

test.describe('Client Tests', () => {

  test('test 01 - Login', async ({ page }) => {
    
    await page.goto('http://localhost:3000/login');
    await page.locator('input[type="text"]').fill(`${process.env.TEST_USERNAME}`);
    await page.locator('input[type="password"]').fill(`${process.env.TEST_PASSWORD}`);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText(/Welcome tester01!/)).toBeVisible();
    await expect(page.locator('h1')).toHaveText('Tester Hotel');
    await page.waitForTimeout(2000);
  });

  


  test('test 02 - Navigate to Clients Page', async ({ page }) => {
    // Ensure login first (if not already handled)
    await page.goto('http://localhost:3000/login');
    await page.locator('input[type="text"]').fill(`${process.env.TEST_USERNAME}`);
    await page.locator('input[type="password"]').fill(`${process.env.TEST_PASSWORD}`);
    await page.getByRole('button', { name: 'Login' }).click();
  
    
  
    // Now check if the heading is visible
    await expect(page.getByRole('heading', { name: 'Clients' })).toBeVisible();
  });
  
});

test.describe('Backend Tests', () => {
  
  test(' Login Backend', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/login', {
      data: {
        username: `${process.env.TEST_USERNAME}`,
        password: `${process.env.TEST_PASSWORD}`,
      },
    });

    expect(response.ok()).toBeTruthy();
  });

  // Test Case 2: Create Client
  test('Create client - Backend', async ({ request }) => {
    // First, login to get the authentication token (if needed)
    const loginResponse = await request.post('http://localhost:3000/api/login', {
      data: {
        username: `${process.env.TEST_USERNAME}`,
        password: `${process.env.TEST_PASSWORD}`,
      },
    });
    expect(loginResponse.ok()).toBeTruthy();
    
  
    const loginData = await loginResponse.json();
    const token = loginData.token;

    const response = await request.post('http://localhost:3000/api/clients', {
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
    
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    
  });
});