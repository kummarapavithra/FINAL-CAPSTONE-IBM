import { expect } from '@playwright/test';

export class HomePage {
  constructor(page) {
    this.page = page;
    this.flightsLink = page.getByRole('navigation').getByRole('link', { name: 'Flights' });
    this.hotelsLink = page.getByRole('navigation').getByRole('link', { name: 'Hotels' });
    this.carsLink = page.getByRole('navigation').getByRole('link', { name: 'Cars' });
    this.destinationsLink = page.getByRole('link', { name: 'Destinations' });
    this.bookingsLink = page.getByRole('navigation').getByRole('link', { name: 'My Bookings' });
    this.logo = page.getByRole('link', { name: 'Wanderlust' });
    this.cityFromInput = page.getByRole('textbox', { name: 'City or Airport' }).first();
    this.cityToInput = page.getByRole('textbox', { name: 'City or Airport' }).nth(1);
    this.searchButton = page.locator('button', { hasText: 'Search' });
  }

  async navigateFlights() {
    await this.flightsLink.click();
  }

  async navigateHotels() {
    await this.hotelsLink.click();
  }

  async navigateCars() {
    await this.carsLink.click();
  }

  async navigateDestinations() {
    await this.destinationsLink.click();
  }

  async navigateBookings() {
    await this.bookingsLink.click();
  }

  async clickLogo() {
    await this.logo.click();
  }

  async fillFlightSearch(from, to) {
    await this.cityFromInput.fill(from);
    await this.cityToInput.fill(to);
    await this.searchButton.click();
  }
}