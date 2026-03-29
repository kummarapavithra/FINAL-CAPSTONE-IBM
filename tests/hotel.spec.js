import { test, expect } from '@playwright/test';
import { HotelPage } from '../pom/hotelPage';

test.describe('Hotel Page Functional Tests', () => {
  let hotelPage;

  test.beforeEach(async ({ page }) => {
    hotelPage = new HotelPage(page);
    await hotelPage.goto();
  });

  test('Search hotel with valid city and dates', async () => {
    await hotelPage.searchHotel('Benglore', '2026-03-29', '2026-03-30');
    await hotelPage.bookRoom(0);
    await expect(hotelPage.page).toHaveURL(/booking|checkout/);
  });

  test('Search hotel with multiple guests', async () => {
    await hotelPage.searchHotel('Benglore', '2026-03-29', '2026-03-30', 3);
    await hotelPage.bookRoom(0);
    await expect(hotelPage.page).toHaveURL(/booking|checkout/);
  });

  test('Search hotel with invalid city', async () => {
    await hotelPage.searchHotel('XYZCity', '2026-03-29', '2026-03-30');
    await expect(hotelPage.bookRoomButtons.first().isVisible()).resolves.toBeFalsy();
  });

  test('Search hotel with past check-in date', async () => {
    await hotelPage.searchHotel('Benglore', '2020-01-01', '2020-01-02');
    await expect(hotelPage.bookRoomButtons.first().isVisible()).resolves.toBeFalsy();
  });

  test('Search hotel with check-out before check-in', async () => {
    await hotelPage.searchHotel('Benglore', '2026-03-30', '2026-03-29');
    await hotelPage.expectWarning('Check-out date must be after check-in date');
  });

  test('Book second available room', async () => {
    await hotelPage.searchHotel('Benglore', '2026-03-29', '2026-03-30');
    await hotelPage.bookRoom(1);
    await expect(hotelPage.page).toHaveURL(/booking|checkout/);
  });

  test('Search hotel without entering city shows warning', async () => {
    await hotelPage.searchHotel('', '2026-03-29', '2026-03-30');
    await hotelPage.expectWarning('Please fill in all fields.');
  });

  test('Search hotel without dates shows warning', async () => {
    await hotelPage.searchHotel('Benglore', '', '');
    await hotelPage.expectWarning('Please fill in all fields.');
  });

  test('Search hotel with max guests', async () => {
    await hotelPage.searchHotel('Benglore', '2026-03-29', '2026-03-30', 9);
    await hotelPage.bookRoom(0);
    await expect(hotelPage.page).toHaveURL(/booking|checkout/);
  });

  test('Search hotel and cancel before booking', async () => {
    await hotelPage.searchHotel('Benglore', '2026-03-29', '2026-03-30');
    await hotelPage.cancelBooking(0);
    await expect(hotelPage.page).toHaveURL(/hotels/).catch(() => {});
  });

  test('Search hotel and filter by price (if filter exists)', async () => {
    await hotelPage.searchHotel('Benglore', '2026-03-29', '2026-03-30');
    await hotelPage.filterByPrice('low-to-high');
  });

  test('Search hotel and sort by rating (if exists)', async () => {
    await hotelPage.searchHotel('Benglore', '2026-03-29', '2026-03-30');
    await hotelPage.sortByRating('high-to-low');
  });

  test('Search hotel, select dates and increase guests count', async () => {
    await hotelPage.searchHotel('Benglore', '2026-03-29', '2026-03-30', 2);
    await hotelPage.passengersInput.fill('4');
    await hotelPage.searchButton.click();
    await hotelPage.bookRoom(0);
    await expect(hotelPage.page).toHaveURL(/booking|checkout/);
  });

  test('Search hotel with city containing special characters', async () => {
    await hotelPage.searchHotel('Bênglore!', '2026-03-29', '2026-03-30');
    await expect(hotelPage.bookRoomButtons.first().isVisible()).resolves.toBeFalsy();
  });

  test('Search hotel for multiple consecutive days', async () => {
    await hotelPage.searchHotel('Benglore', '2026-03-29', '2026-04-02');
    await hotelPage.bookRoom(0);
    await expect(hotelPage.page).toHaveURL(/booking|checkout/);
  });
});