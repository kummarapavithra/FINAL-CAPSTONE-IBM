import { expect } from '@playwright/test';

export class PaymentPage {
  constructor(page) {
    this.page = page;

    // Payment options
    this.creditCardBtn = page.getByRole('button', { name: 'Credit Card' });
    this.paypalBtn = page.getByRole('button', { name: 'PayPal' });

    // Card fields
    this.cardNumber = page.getByRole('textbox', { name: '0000 0000 0000' });
    this.cardName = page.getByRole('textbox', { name: 'Name on Card' });
    this.expiry = page.getByRole('textbox', { name: 'MM/YY' });
    this.cvv = page.getByRole('textbox', { name: '123' });

    // Buttons
    this.payBtn = page.getByRole('button', { name: /Pay/ });
    this.backBtn = page.getByRole('button', { name: 'Back' });
    this.viewBookingsBtn = page.getByRole('button', { name: 'View My Bookings' });
  }

  async selectCreditCard() {
    await this.creditCardBtn.click();
  }

  async selectPayPal() {
    await this.paypalBtn.click();
  }

  async fillCardDetails(number, name, expiry, cvv) {
    await this.cardNumber.fill(number);
    await this.cardName.fill(name);
    await this.expiry.fill(expiry);
    await this.cvv.fill(cvv);
  }

  async clickPay() {
    await this.payBtn.first().click();
  }

  async clickBack() {
    await this.backBtn.click();
  }

  async viewBookings() {
    await this.viewBookingsBtn.click();
  }
}