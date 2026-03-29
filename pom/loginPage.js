// loginPage.js
import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;

    this.signInLink = page.getByRole('link', { name: 'Sign In' });
    this.emailInput = page.locator('input[placeholder="you@example.com"]');
    this.passwordInput = page.locator('input[placeholder="Minimum 6 characters"]');
    this.signInButton = page.locator('form button:has-text("Sign In")');
    this.createAccountButton = page.locator('form button:has-text("Create one")');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot password?")');
    this.errorMessage = page.locator('div.bg-red-50'); // Only shows when visible
  }

  async goto() {
    await this.page.goto('https://travel-planner-pro--pavithra444.replit.app/');
    await this.signInLink.click();
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async clickCreateAccount() {
    await this.createAccountButton.click();
    await expect(this.page.locator('form button:has-text("Sign In")')).toBeVisible(); 
    // Wait for register form or sign-in visibility
  }

  async forgotPassword() {
    await this.forgotPasswordLink.click();
    await expect(this.page.locator('input[placeholder="you@example.com"]')).toBeVisible();
    // Wait for modal/section visibility instead of URL
  }

  async expectError(message) {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    await expect(this.errorMessage).toHaveText(message);
  }

  async expectLoginSuccess() {
    // Instead of URL, check a page element visible after login
    await expect(this.page.locator('text=Welcome')).toBeVisible({ timeout: 5000 });
  }
}