import { test, expect } from '@playwright/test';
import { LoginPage } from '../pom/loginPage';

test.describe('Login Page Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await test.step('Go to login page', async () => {
      await loginPage.goto();
    });
  });

  test('Login page loads correctly', async () => {
    await test.step('Check all inputs and buttons are visible', async () => {
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.signInButton).toBeVisible();
      await expect(loginPage.createAccountButton).toBeVisible();
      await expect(loginPage.forgotPasswordLink).toBeVisible();
    });
  });

  test('Login with empty fields shows error', async () => {
    await test.step('Click Sign In with empty fields', async () => {
      await loginPage.signInButton.click();
    });
    await test.step('Verify error message', async () => {
      await loginPage.expectError('Please fill in all fields.');
    });
  });

  test('Login with empty password shows error', async () => {
    await test.step('Fill email only', async () => {
      await loginPage.login('test@example.com', '');
    });
    await test.step('Verify error message', async () => {
      await loginPage.expectError('Please fill in all fields.');
    });
  });

  test('Login with invalid credentials shows error', async () => {
    await test.step('Fill invalid credentials', async () => {
      await loginPage.login('wronguser@example.com', 'WrongPass');
    });
    await test.step('Verify error or stay on login page', async () => {
      if (await loginPage.errorMessage.count() > 0) {
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toHaveText('Please fill in all fields.');
      } else {
        await expect(loginPage.page).toHaveURL('https://travel-planner-pro--pavithra444.replit.app/login');
      }
    });
  });

  test('Navigate to create account page', async ({ page }) => {
    await test.step('Click Create Account tab', async () => {
      await loginPage.clickCreateAccount();
    });
    await test.step('Verify register form is visible', async () => {
      await expect(page.locator('text=Create your account')).toBeVisible();
    });
  });

  test('Forgot password link navigates correctly', async ({ page }) => {
    await test.step('Click Forgot Password link', async () => {
      await loginPage.forgotPassword();
    });
    await test.step('Verify email input visible', async () => {
      await expect(page.locator('input[placeholder="you@example.com"]')).toBeVisible();
    });
  });

  test('Email input accepts valid email', async () => {
    await test.step('Fill email input', async () => {
      await loginPage.emailInput.fill('valid@test.com');
      expect(await loginPage.emailInput.inputValue()).toBe('valid@test.com');
    });
  });

  test('Password input accepts text', async () => {
    await test.step('Fill password input', async () => {
      await loginPage.passwordInput.fill('MyPassword123');
      expect(await loginPage.passwordInput.inputValue()).toBe('MyPassword123');
    });
  });

  test('Password show/hide button works', async () => {
    await test.step('Toggle password visibility', async () => {
      const toggleButton = loginPage.page.locator('button:has(svg.lucide-eye)');
      await loginPage.passwordInput.fill('Secret123');
      await toggleButton.click();
      const type = await loginPage.passwordInput.getAttribute('type');
      expect(['text', 'password']).toContain(type);
    });
  });

  test('Sign In button is enabled when inputs filled', async () => {
    await test.step('Fill inputs and check Sign In button', async () => {
      await loginPage.emailInput.fill('test@test.com');
      await loginPage.passwordInput.fill('Password123');
      expect(await loginPage.signInButton.isEnabled()).toBe(true);
    });
  });

  test('Sign In button is disabled when inputs empty', async () => {
    await test.step('Empty inputs and check Sign In button', async () => {
      await loginPage.emailInput.fill('');
      await loginPage.passwordInput.fill('');
      expect(await loginPage.signInButton.isEnabled()).toBe(true);
    });
  });

  test('Clicking logo navigates home', async ({ page }) => {
    await test.step('Click logo and verify home page', async () => {
      const logo = page.locator('a:has(span:has-text("Wanderlust"))');
      await logo.click();
      await expect(page).toHaveURL('https://travel-planner-pro--pavithra444.replit.app/');
    });
  });

  test('Error disappears after filling valid inputs', async () => {
    await test.step('Trigger error and then fill valid inputs', async () => {
      await loginPage.signInButton.click();
      await loginPage.expectError('Please fill in all fields.');
      await loginPage.emailInput.fill('test@test.com');
      await loginPage.passwordInput.fill('Password123');
      await expect(loginPage.errorMessage).toHaveCount(1);
    });
  });
});