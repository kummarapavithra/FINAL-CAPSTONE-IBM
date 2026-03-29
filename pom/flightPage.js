import { expect } from '@playwright/test';

export class FlightPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Flight search form locators
    this.fromInput = page.getByRole('textbox', { name: 'e.g. Dubai, Paris, New York' });
    this.toInput = page.getByRole('textbox', { name: 'e.g. Mumbai, Delhi, London' });
    this.departureDateInput = page.locator('input[type="date"]');
    this.searchButton = page.getByRole('button', { name: 'Search' });

    // Booking buttons and results
    this.bookNowButtons = page.getByRole('button', { name: 'Book Now' });

    // Navigation links
    this.flightsLink = page.getByRole('navigation').getByRole('link', { name: 'Flights' });
    this.hotelsLink = page.getByRole('navigation').getByRole('link', { name: 'Hotels' });
    this.carsLink = page.getByRole('navigation').getByRole('link', { name: 'Cars' });
  }

  async goto() {
    await this.page.goto('/');
    await this.page.getByRole('link', { name: 'Sign In' }).click();
    await this.page.getByRole('textbox', { name: 'you@example.com' }).fill('pavithra@gmail.com');
    await this.page.getByRole('textbox', { name: 'Minimum 6 characters' }).fill('Cit@12345');
    await this.page.locator('form').getByRole('button', { name: 'Sign In' }).click();
    await expect(this.page).toHaveURL(/home|dashboard|\/$/);
  }

  async fillFlightSearch(fromCity, toCity, date, passengers = 1) {
    await this.fromInput.fill(fromCity);
    await this.toInput.fill(toCity);
    await this.departureDateInput.fill(date);

    if (passengers > 1) {
      const passengerInput = this.page.locator('input[type="number"]');
      await passengerInput.fill(passengers.toString());
    }
  }

  async submitSearch() {
    await this.searchButton.click();
  }

  async bookFirstFlight() {
    await this.bookNowButtons.first().click();
  }

  async expectResultsVisible() {
    // Fix: check if at least one "Book Now" button is visible
    await expect(this.bookNowButtons.first()).toBeVisible({ timeout: 5000 });
  }

  async navigateHotels() {
    await this.hotelsLink.click();
  }

  async navigateCars() {
    await this.carsLink.click();
  }
}