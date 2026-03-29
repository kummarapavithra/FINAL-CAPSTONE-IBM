// myBookings.spec.js
import { test, expect } from '@playwright/test';
import { MyBookingsPage } from '../pom/myBookingsPage';

test.describe('My Bookings Page Tests', () => {
  let bookings;

  test.beforeEach(async ({ page }) => {
    bookings = new MyBookingsPage(page);

    await page.goto('https://travel-planner-pro--pavithra444.replit.app/');

    // Login
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'you@example.com' }).fill('Pavithra@gmail.com');
    await page.getByRole('textbox', { name: 'Minimum 6 characters' }).fill('Cit@12345');
    await page.locator('form').getByRole('button', { name: 'Sign In' }).click();

    // Open My Bookings via main navigation
    await bookings.openMyBookings();
  });

  test('Check My Bookings page loads', async () => {
    const count = await bookings.getBookingCount();
    expect(count).toBeGreaterThan(0);
  });



  test('Open a booking by name', async () => {
    const bookingName = 'New York City Experience';
    const row = bookings.page.getByRole('row', { name: bookingName });
    await row.waitFor({ state: 'visible', timeout: 10000 });
    await row.locator('span').click({ force: true });
  });

  test('Navigate to Destinations from My Bookings', async () => {
    await bookings.navigateToDestinations();
    await expect(bookings.destinationsLink).toBeVisible();
  });

  test('Sign out from My Bookings', async () => {
    await bookings.signOut();
    await expect(bookings.signOutBtn).not.toBeVisible();
  });


  test('Check multiple bookings exist', async () => {
    const count = await bookings.getBookingCount();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('Verify a specific booking exists', async () => {
    const exists = await bookings.bookingExists('IndiGo 6E137 - Economy');
    expect(exists).toBeTruthy();
  });

});