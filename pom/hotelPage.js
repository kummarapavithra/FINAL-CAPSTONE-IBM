import { expect } from '@playwright/test';

export class HotelPage {
  constructor(page) {
    this.page = page;

    // Navigation
    this.hotelsLink = page.getByRole('navigation').getByRole('link', { name: 'Hotels' });

    // Search form
    this.cityInput = page.getByRole('textbox', { name: 'City or Hotel Name' });
    this.checkInInput = page.getByRole('textbox').nth(1);
    this.checkOutInput = page.getByRole('textbox').nth(2);
    this.passengersInput = page.getByRole('spinbutton');
    this.searchButton = page.getByRole('button', { name: 'Search' });

    // Booking buttons
    this.bookRoomButtons = page.getByRole('button', { name: 'Book Room' });

    // Warning / error messages
    this.warningText = page.locator('div.bg-red-50'); // optional
  }

  async goto() {
    await this.page.goto('/');
    await this.page.getByRole('link', { name: 'Sign In' }).click();
    await this.page.getByRole('textbox', { name: 'you@example.com' }).fill('pavithra@gmail.com');
    await this.page.getByRole('textbox', { name: 'Minimum 6 characters' }).fill('Cit@12345');
    await this.page.locator('form').getByRole('button', { name: 'Sign In' }).click();
    await this.hotelsLink.click();
  }

  async searchHotel(city, checkIn, checkOut, guests = 1) {
    if (city) await this.cityInput.fill(city);
    if (checkIn) await this.checkInInput.fill(checkIn);
    if (checkOut) await this.checkOutInput.fill(checkOut);
    if (guests) await this.passengersInput.fill(guests.toString());
    await this.searchButton.click();
  }

  async bookRoom(index = 0) {
    await this.bookRoomButtons.nth(index).click();
  }

  async expectWarning(message) {
    if (await this.warningText.count() > 0) {
      await expect(this.warningText.first()).toHaveText(message);
    }
  }

  async cancelBooking(index = 0) {
    const cancelBtn = this.page.getByRole('button', { name: 'Cancel' }).nth(index);
    if (await cancelBtn.count() > 0) {
      await cancelBtn.click();
    }
  }

  async filterByPrice(option = 'low-to-high') {
    const filter = this.page.locator('select[name="price-filter"]');
    if (await filter.count() > 0) {
      await filter.selectOption(option);
    }
  }

  async sortByRating(option = 'high-to-low') {
    const sort = this.page.locator('select[name="rating-sort"]');
    if (await sort.count() > 0) {
      await sort.selectOption(option);
    }
  }
}