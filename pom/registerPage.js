import { expect } from '@playwright/test';

export class RegisterPage {
  constructor(page) {
    this.page = page;

    this.signInLink = page.getByRole('link', { name: 'Sign In' });
    this.createAccountTab = page.getByRole('button', { name: 'Create Account' });
    this.fullNameInput = page.locator('input[placeholder="Your full name"]');
    this.emailInput = page.locator('input[placeholder="you@example.com"]');
    this.passwordInput = page.locator('input[placeholder="Minimum 6 characters"]');
    this.confirmPasswordInput = page.locator('input[placeholder="Re-enter your password"]');
    this.createAccountButton = page.locator('form button:has-text("Create Account")');
    this.signInButton = page.locator('form button:has-text("Sign in")');
    this.errorMessage = page.locator('div.bg-red-50'); // error messages
  }

  async goto() {
    await this.page.goto('https://travel-planner-pro--pavithra444.replit.app/');
    await this.signInLink.click();
    await this.createAccountTab.click();
  }

  async register(fullName, email, password, confirmPassword) {
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.createAccountButton.click();
  }

  async signIn() {
    await this.signInButton.click();
  }

  async expectError(message) {
    if (await this.errorMessage.count() > 0) {
      await expect(this.errorMessage).toBeVisible();
      await expect(this.errorMessage).toHaveText(message);
    }
  }
}