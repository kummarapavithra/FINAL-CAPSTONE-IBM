// myBookingsPage.js
import { expect } from '@playwright/test';

export class MyBookingsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Select the main navigation My Bookings link explicitly
    this.myBookingsLink = page.getByRole('navigation').getByRole('link', { name: 'My Bookings' });

    this.destinationsLink = page.getByRole('navigation').getByRole('link', { name: 'Destinations' });

    this.bookingRows = page.locator('tr'); // All booking rows

    this.signOutBtn = page.getByRole('button', { name: 'Sign Out' });

    this.viewPackagesBtn = page.getByText('View Packages');
  }

  async openMyBookings() {
    await this.myBookingsLink.click();
    await this.page.waitForSelector('tr', { state: 'visible', timeout: 10000 });
  }

  async clickFirstBooking() {
    const firstRow = this.bookingRows.first();
    await firstRow.scrollIntoViewIfNeeded();
    await firstRow.locator('span').click();
  }

  async openBookingRowByName(bookingName) {
    const row = this.page.getByRole('row', { name: bookingName });
    await row.scrollIntoViewIfNeeded();
    await row.locator('span').click();
  }

  async navigateToDestinations() {
    await this.destinationsLink.click();
  }

  async signOut() {
    await this.signOutBtn.click();
  }

  async getBookingCount() {
    return await this.bookingRows.count();
  }

  async bookingExists(bookingName) {
    return await this.page.getByRole('row', { name: bookingName }).isVisible();
  }

  async openPackageFromBooking(index = 0) {
    await this.viewPackagesBtn.nth(index).scrollIntoViewIfNeeded();
    await this.viewPackagesBtn.nth(index).click();
  }
}