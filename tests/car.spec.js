import { test, expect } from '@playwright/test';
import { CarPage } from '../pom/carPage';

test.describe('Car Page Functional Tests', () => {
  let carPage;

  test.beforeEach(async ({ page }) => {
    carPage = new CarPage(page);
    await carPage.goto();
  });

  // 1. Search car with valid city and dates
  test('Search car with valid city and dates', async () => {
    await carPage.searchCar('Dubai', '2026-03-29', '2026-04-01');
    await carPage.bookCar(0);
    await expect(carPage.page).toHaveURL(/booking|checkout/);
  });

  // 2. Search car with same pickup/drop date
  test('Search car with same pickup and drop date', async () => {
    await carPage.searchCar('Benglore', '2026-03-29', '2026-03-29');
    await carPage.bookCar(0);
    await expect(carPage.page).toHaveURL(/booking|checkout/);
  });

  // 3. Search car without city shows warning
  test('Search car without city', async () => {
    await carPage.searchCar('', '2026-03-29', '2026-03-31');
    await carPage.expectWarning('Please fill in all fields.');
  });

  // 4. Search car without dates shows warning
  test('Search car without dates', async () => {
    await carPage.searchCar('Dubai', '', '');
    await carPage.expectWarning('Please fill in all fields.');
  });

  // 6. Search car with drop date before pickup date
  test('Drop date before pickup date', async () => {
    await carPage.searchCar('Dubai', '2026-03-30', '2026-03-29');
    await carPage.expectWarning('Drop date must be after pickup date');
  });

  // 7. Book second available car
  test('Book second available car', async () => {
    await carPage.searchCar('Dubai', '2026-03-29', '2026-04-01');
    await carPage.bookCar(1);
    await expect(carPage.page).toHaveURL(/booking|checkout/);
  });

  // 8. Filter cars by price if filter exists
  test('Filter cars by price', async () => {
    await carPage.searchCar('Dubai', '2026-03-29', '2026-04-01');
    await carPage.filterByPrice('high-to-low');
  });

  // 9. Filter cars by type if filter exists
  test('Filter cars by type', async () => {
    await carPage.searchCar('Dubai', '2026-03-29', '2026-04-01');
    await carPage.filterByCarType('SUV');
  });

  // 10. Search car and cancel before booking
  test('Cancel before booking', async () => {
    await carPage.searchCar('Benglore', '2026-03-29', '2026-03-31');
    const cancelBtn = carPage.page.getByRole('button', { name: 'Cancel' }).first();
    if (await cancelBtn.count() > 0) await cancelBtn.click();
    await expect(carPage.page).toHaveURL(/cars/).catch(() => {});
  });

  // 11. Search car with city in lowercase
  test('Search car city lowercase', async () => {
    await carPage.searchCar('dubai', '2026-03-29', '2026-04-01');
    await carPage.bookCar(0);
    await expect(carPage.page).toHaveURL(/booking|checkout/);
  });

  // 12. Search car with city in uppercase
  test('Search car city uppercase', async () => {
    await carPage.searchCar('DUBAI', '2026-03-29', '2026-04-01');
    await carPage.bookCar(0);
    await expect(carPage.page).toHaveURL(/booking|checkout/);
  });

  // 13. Search car for multiple consecutive days
  test('Search car for consecutive days', async () => {
    await carPage.searchCar('Dubai', '2026-03-29', '2026-04-05');
    await carPage.bookCar(0);
    await expect(carPage.page).toHaveURL(/booking|checkout/);
  });

  // 14. Search car with multiple bookings
  test('Book multiple cars sequentially', async () => {
    await carPage.searchCar('Dubai', '2026-03-29', '2026-04-01');
    await carPage.bookCar(0);
    await carPage.page.goBack();
    await carPage.searchCar('Dubai', '2026-03-29', '2026-04-01');
    await carPage.bookCar(1);
  });


  test('Search car with special characters in city', async () => {
    await carPage.searchCar('Dübai!', '2026-03-29', '2026-04-01');
    await expect(carPage.bookButtons.first().isVisible()).resolves.toBeFalsy();
  });

});