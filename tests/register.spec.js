import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pom/registerPage';

test.describe('Register Page Tests', () => {
  let registerPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await test.step('Go to register page', async () => {
      await registerPage.goto();
    });
  });

  // ---------------- Existing Tests ----------------
  test('Register page loads correctly', async () => {
    await test.step('Check all inputs and buttons are visible', async () => {
      await expect(registerPage.fullNameInput).toBeVisible();
      await expect(registerPage.emailInput).toBeVisible();
      await expect(registerPage.passwordInput).toBeVisible();
      await expect(registerPage.confirmPasswordInput).toBeVisible();
      await expect(registerPage.createAccountButton).toBeVisible();
      await expect(registerPage.signInButton).toBeVisible();
    });
  });

  test('Register with empty fields shows error', async () => {
    await registerPage.createAccountButton.click();
    await registerPage.expectError('Please fill in all fields.');
  });

  test('Register with invalid email shows error', async () => {
    await registerPage.register('Test User', 'invalid-email', 'Password123', 'Password123');
    await registerPage.expectError('Please fill in all fields.');
  });

  test('Register with password mismatch shows error', async () => {
    await registerPage.register('Test User', 'test@example.com', 'Password123', 'Password321');
    await registerPage.expectError('Passwords do not match.');
  });

  test('Register with valid data succeeds', async ({ page }) => {
    await registerPage.register('Test User', 'uniqueuser@example.com', 'Password123', 'Password123');
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('Sign in button navigates back to login', async ({ page }) => {
    await registerPage.signIn();
    await expect(page.locator('input[placeholder="you@example.com"]')).toBeVisible();
  });

  test('Full Name input accepts text', async () => {
    await registerPage.fullNameInput.fill('John Doe');
    expect(await registerPage.fullNameInput.inputValue()).toBe('John Doe');
  });

  test('Password and confirm password inputs accept text', async () => {
    await registerPage.passwordInput.fill('Password123');
    await registerPage.confirmPasswordInput.fill('Password123');
    expect(await registerPage.passwordInput.inputValue()).toBe('Password123');
    expect(await registerPage.confirmPasswordInput.inputValue()).toBe('Password123');
  });

  // ---------------- New Test: Already Existing Account ----------------
  test('Register with existing account redirects to login', async ({ page }) => {
    await registerPage.register('Existing User', 'testuser@example.com', 'Password123', 'Password123');
    await registerPage.expectError('Account already exists. Redirecting to login...');
    await expect(page.locator('input[placeholder="you@example.com"]')).toBeVisible();
  });

  // ---------------- Additional 5 Useful Tests ----------------
  test('Email input accepts valid email', async () => {
    await registerPage.emailInput.fill('newuser@example.com');
    expect(await registerPage.emailInput.inputValue()).toBe('newuser@example.com');
  });

  test('Password input type is password', async () => {
    const type = await registerPage.passwordInput.getAttribute('type');
    expect(type).toBe('password');
  });

  test('Confirm password input type is password', async () => {
    const type = await registerPage.confirmPasswordInput.getAttribute('type');
    expect(type).toBe('password');
  });

  test('Click Sign In then back to Register', async ({ page }) => {
    await registerPage.signIn();
    await expect(page.locator('input[placeholder="you@example.com"]')).toBeVisible();
    await registerPage.goto();
    await expect(registerPage.fullNameInput).toBeVisible();
  });

});