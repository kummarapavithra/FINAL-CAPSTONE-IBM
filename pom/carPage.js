import { expect } from '@playwright/test';

export class CarPage {
  constructor(page) {
    this.page = page;

    // Navigation
    this.carsLink = page.getByRole('navigation').getByRole('link', { name: 'Cars' });

    // Search form
    this.cityInput = page.getByRole('textbox', { name: 'City or Airport' });
    this.pickupDateInput = page.getByRole('textbox').nth(1);
    this.dropDateInput = page.getByRole('textbox').nth(2);
    this.searchButton = page.getByRole('button', { name: 'Search' });

    // Booking buttons
    this.bookButtons = page.getByRole('button', { name: 'Book' });

    // Optional warning/error messages
    this.warningText = page.locator('div.bg-red-50');

    // Filters (if available)
    this.priceFilter = page.locator('select[name="price-filter"]');
    this.carTypeFilter = page.locator('select[name="car-type"]');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.getByRole('link', { name: 'Sign In' }).click();
    await this.page.getByRole('textbox', { name: 'you@example.com' }).fill('pavithra@gmail.com');
    await this.page.getByRole('textbox', { name: 'Minimum 6 characters' }).fill('Cit@12345');
    await this.page.locator('form').getByRole('button', { name: 'Sign In' }).click();
    await this.carsLink.click();
  }

  async searchCar(city, pickupDate, dropDate) {
    if (city) await this.cityInput.fill(city);
    if (pickupDate) await this.pickupDateInput.fill(pickupDate);
    if (dropDate) await this.dropDateInput.fill(dropDate);
    await this.searchButton.click();
  }

  async bookCar(index = 0) {
    await this.bookButtons.nth(index).click();
  }

  async expectWarning(message) {
    if (await this.warningText.count() > 0) {
      await expect(this.warningText.first()).toHaveText(message);
    }
  }

  async filterByPrice(option = 'low-to-high') {
    if (await this.priceFilter.count() > 0) {
      await this.priceFilter.selectOption(option);
    }
  }

  async filterByCarType(option = 'SUV') {
    if (await this.carTypeFilter.count() > 0) {
      await this.carTypeFilter.selectOption(option);
    }
  }
}