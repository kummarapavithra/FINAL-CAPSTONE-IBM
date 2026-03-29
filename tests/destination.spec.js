import { test } from '@playwright/test';
import { DestinationPage } from '../pom/destinationPage';

test.describe('Destinations Page Functional Tests', () => {
  let destPage;

  test.beforeEach(async ({ page }) => {
    destPage = new DestinationPage(page);
    await page.goto('https://travel-planner-pro--pavithra444.replit.app/');

    // Login
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'you@example.com' }).fill('pavithra@gmail.com');
    await page.getByRole('textbox', { name: 'Minimum 6 characters' }).fill('Cit@12345');
    await page.locator('form').getByRole('button', { name: 'Sign In' }).click();

    // Open Destinations
    await destPage.openDestinations();
  });

  test('t1 View first package', async () => {
    await destPage.viewPackageByIndex(0);
  });


  test('t6 Navigate back to Hotels section', async () => {
    await destPage.navigateBackToSection('Hotels');
  });

  test('t7 Navigate back to Cars section', async () => {
    await destPage.navigateBackToSection('Cars');
  });



  test('t9 Open package and then navigate to Flights section', async () => {
    await destPage.viewPackageByIndex(0);
    await destPage.navigateBackToSection('Flights');
  });

});