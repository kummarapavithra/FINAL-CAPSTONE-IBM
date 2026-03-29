import { test, expect } from '@playwright/test';
import { FlightPage } from '../pom/flightPage';

test.describe('Flight Page Tests', () => {
  let flightPage;

  test.beforeEach(async ({ page }) => {
    flightPage = new FlightPage(page);
    await flightPage.goto();
    await flightPage.flightsLink.click();
  });

  test('Flight page loads correctly', async () => {
    await expect(flightPage.fromInput).toBeVisible();
    await expect(flightPage.toInput).toBeVisible();
    await expect(flightPage.departureDateInput).toBeVisible();
    await expect(flightPage.searchButton).toBeVisible();
  });

  test('Perform flight search', async () => {
    await flightPage.fillFlightSearch('Dubai', 'Mumbai', '2026-12-12');
    await flightPage.submitSearch();
    await flightPage.expectResultsVisible();
  });

  test('Book first flight', async () => {
    await flightPage.fillFlightSearch('Dubai', 'Mumbai', '2026-12-12');
    await flightPage.submitSearch();
    await flightPage.bookFirstFlight();
    await expect(flightPage.page).toHaveURL(/booking|checkout/);
  });

  test('Flight search with multiple passengers', async () => {
    await flightPage.fillFlightSearch('Paris', 'Bali', '2026-06-15', 3);
    await flightPage.submitSearch();
    await flightPage.expectResultsVisible();
  });

  test('Flight search with same from/to city', async () => {
    await flightPage.fillFlightSearch('Paris', 'Paris', '2026-06-15');
    await flightPage.submitSearch();
    await flightPage.expectResultsVisible();
  });

  test('Flight search with future date', async () => {
    await flightPage.fillFlightSearch('New York', 'Tokyo', '2027-01-01');
    await flightPage.submitSearch();
    await flightPage.expectResultsVisible();
  });

  test('Navigate to Hotels page', async () => {
    await flightPage.navigateHotels();
    await expect(flightPage.page).toHaveURL(/hotels/);
  });

  test('Navigate to Cars page', async () => {
    await flightPage.navigateCars();
    await expect(flightPage.page).toHaveURL(/cars/);
  });

  test('Flight search from City to City', async () => {
    await flightPage.fillFlightSearch('Paris', 'Bali', '2026-06-15');
    await flightPage.submitSearch();
    await flightPage.expectResultsVisible();
  });

  test('Flight search with empty fields shows no results', async () => {
    await flightPage.submitSearch();
    const visible = await flightPage.bookNowButtons.first().isVisible().catch(() => false);
    expect(visible).toBeFalsy();
  });

  // ----------- Additional Functional Tests -----------

  test('Switch search between Flights, Hotels, Cars', async () => {
    await flightPage.navigateHotels();
    await flightPage.navigateCars();
    await flightPage.flightsLink.click();
    await expect(flightPage.searchButton).toBeVisible();
  });

  test('Search flight and click on first result details', async () => {
    await flightPage.fillFlightSearch('Dubai', 'Mumbai', '2026-12-12');
    await flightPage.submitSearch();
    const firstBook = flightPage.bookNowButtons.first();
    await expect(firstBook).toBeVisible();
    await firstBook.click();
    await expect(flightPage.page).toHaveURL(/booking|checkout/);
  });

  test('Flight search with invalid city names', async () => {
    await flightPage.fillFlightSearch('XYZCity', 'ABCPlace', '2026-12-12');
    await flightPage.submitSearch();
    const visible = await flightPage.bookNowButtons.first().isVisible().catch(() => false);
    expect(visible).toBeFalsy();
  });

  test('Flight search with past date', async () => {
    await flightPage.fillFlightSearch('Dubai', 'Mumbai', '2020-01-01');
    await flightPage.submitSearch();
    const visible = await flightPage.bookNowButtons.first().isVisible().catch(() => false);
    expect(visible).toBeFalsy();
  });

  test('Flight search with maximum passengers', async () => {
    await flightPage.fillFlightSearch('Paris', 'Bali', '2026-06-15', 9);
    await flightPage.submitSearch();
    await flightPage.expectResultsVisible();
  });
});