import { expect } from '@playwright/test';

export class DestinationPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Header navigation
    this.headerNav = page.locator('header');
    this.destinationsNavLink = this.headerNav.getByRole('link', { name: 'Destinations', exact: true });

    // Packages
    this.packageCards = page.locator('.grid .group');
    this.bookPackageButtons = page.getByRole('button', { name: 'Book This Package' });

    // Booking form
    this.nameInputs = page.getByRole('textbox', { name: 'Full Name as on ID' });
    this.continueButton = page.getByRole('button', { name: 'Continue to Payment' });
    this.creditCardButton = page.getByRole('button', { name: 'Credit Card' });
    this.paypalButton = page.getByRole('button', { name: 'PayPal' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async openDestinations() {
    await this.destinationsNavLink.click();
    await this.packageCards.first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async viewPackageByIndex(index = 0) {
    const card = this.packageCards.nth(index);
    await card.scrollIntoViewIfNeeded();
    await card.click();
  }

  async bookPackageByIndex(index = 0, name1 = '', name2 = '') {
    const button = this.bookPackageButtons.nth(index);
    await button.scrollIntoViewIfNeeded();
    await button.hover();
    await button.waitFor({ state: 'visible', timeout: 15000 });
    await button.click();
    await this.fillTravelerNames(name1, name2);
    await this.continueToPayment();
  }

  async fillTravelerNames(name1, name2) {
    await this.nameInputs.first().fill(name1);
    await this.nameInputs.nth(1).fill(name2);
  }

  async continueToPayment() {
    await this.continueButton.click();
  }

  async selectPaymentCreditCard() {
    await this.creditCardButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.creditCardButton.click();
  }

  async selectPaymentPaypal() {
    await this.paypalButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.paypalButton.click();
  }

  async cancelBooking() {
    await this.cancelButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.cancelButton.click();
  }

  async navigateBackToSection(sectionName) {
    // Use only header navigation to avoid duplicates
    await this.headerNav.getByRole('link', { name: sectionName, exact: true }).click();
  }

  get fullNameInputs() {
    return this.nameInputs;
  }
}