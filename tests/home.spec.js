import { test, expect } from '@playwright/test';
import { HomePage } from '../pom/homePage';

test.describe('Home Page Tests', () => {
  let homePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await page.goto('https://travel-planner-pro--pavithra444.replit.app/');
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'you@example.com' }).fill('pavithra@gmail.com');
    await page.getByRole('textbox', { name: 'Minimum 6 characters' }).fill('Cit@12345');
    await page.locator('form').getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL(/home|dashboard|\/$/);
  });

  test('Navigate to Flights page', async () => {
    await homePage.navigateFlights();
    await expect(homePage.page).toHaveURL(/flights/);
  });

  test('Navigate to Hotels page', async () => {
    await homePage.navigateHotels();
    await expect(homePage.page).toHaveURL(/hotels/);
  });

  test('Navigate to Cars page', async () => {
    await homePage.navigateCars();
    await expect(homePage.page).toHaveURL(/cars/);
  });

  test('Navigate to Destinations page', async () => {
    await homePage.destinationsLink.first().click();
    await expect(homePage.page).toHaveURL(/destinations/);
  });

  test('Navigate to My Bookings page', async () => {
    await homePage.navigateBookings();
    await expect(homePage.page).toHaveURL(/bookings/);
  });

  test('Click logo navigates home', async () => {
    await homePage.clickLogo();
    await expect(homePage.page).toHaveURL(/home|dashboard|\/$/);
  });


  test('Switch from Flights to Hotels tab', async () => {
    await homePage.navigateFlights();
    await homePage.navigateHotels();
    await expect(homePage.page).toHaveURL(/hotels/);
  });

  test('Switch from Hotels to Cars tab', async () => {
    await homePage.navigateHotels();
    await homePage.navigateCars();
    await expect(homePage.page).toHaveURL(/cars/);
  });

  test('Check Destinations button hover effect', async () => {
    const destButton = homePage.destinationsLink.first();
    await destButton.hover();
    expect(await destButton.isVisible()).toBe(true);
  });

  test('Navigate back to Flights after clicking logo', async () => {
    await homePage.navigateHotels();
    await homePage.clickLogo();
    await expect(homePage.page).toHaveURL(/home|dashboard|\/$/);
  });

  test('Open My Bookings then return home', async () => {
    await homePage.navigateBookings();
    await homePage.clickLogo();
    await expect(homePage.page).toHaveURL(/home|dashboard|\/$/);
  });

  test('Switch tabs Flights → Hotels → Cars → Flights', async () => {
    await homePage.navigateFlights();
    await homePage.navigateHotels();
    await homePage.navigateCars();
    await homePage.navigateFlights();
    await expect(homePage.page).toHaveURL(/flights/);
  });

  test('Click Wanderlust logo redirects home', async () => {
    await homePage.clickLogo();
    await expect(homePage.page).toHaveURL(/home|dashboard|\/$/);
  });

});