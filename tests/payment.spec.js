import { test, expect } from '@playwright/test';
import { PaymentPage } from '../pom/paymentPage';

test.describe('Payment Module Tests', () => {
  let payment;

  test.beforeEach(async ({ page }) => {
    payment = new PaymentPage(page);

    await page.goto('https://travel-planner-pro--pavithra444.replit.app/');

    // Login
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'you@example.com' }).fill('pavithra@gmail.com');
    await page.getByRole('textbox', { name: 'Minimum 6 characters' }).fill('Cit@12345');
    await page.locator('form').getByRole('button', { name: 'Sign In' }).click();

    // Go to Flights → Book → reach payment
    await page.getByRole('navigation').getByRole('link', { name: 'Flights' }).click();
    await page.getByRole('textbox', { name: /Mumbai/ }).fill('mumbai');
    await page.getByRole('textbox', { name: /Dubai/ }).fill('dubai');
    await page.locator('input[type="date"]').fill('2026-12-12');

    await page.getByRole('button', { name: 'Book Now' }).first().click();

    await page.getByRole('textbox', { name: 'Full Name as on ID' }).fill('Pavithra');
    await page.getByRole('button', { name: 'Continue to Payment' }).click();
  });

  // ---------- CREDIT CARD TESTS ----------

  test('Pay with valid credit card', async () => {
    await payment.selectCreditCard();
    await payment.fillCardDetails('4111111111111111', 'Pavi', '12/30', '123');
    await payment.clickPay();
  });

  test('Credit card - empty fields', async () => {
    await payment.selectCreditCard();
    await payment.clickPay();
  });

  test('Credit card - invalid number', async () => {
    await payment.selectCreditCard();
    await payment.fillCardDetails('123', 'Pavi', '12/30', '123');
    await payment.clickPay();
  });

  test('Credit card - invalid CVV', async () => {
    await payment.selectCreditCard();
    await payment.fillCardDetails('4111111111111111', 'Pavi', '12/30', '1');
    await payment.clickPay();
  });

  test('Credit card - invalid expiry', async () => {
    await payment.selectCreditCard();
    await payment.fillCardDetails('4111111111111111', 'Pavi', '00/00', '123');
    await payment.clickPay();
  });

  test('Credit card - only card number', async () => {
    await payment.selectCreditCard();
    await payment.cardNumber.fill('4111111111111111');
    await payment.clickPay();
  });

  test('Credit card - only name', async () => {
    await payment.selectCreditCard();
    await payment.cardName.fill('Pavi');
    await payment.clickPay();
  });

  // ---------- PAYPAL TESTS ----------

  test('Pay with PayPal', async () => {
    await payment.selectPayPal();
    await payment.clickPay();
  });

  test('Switch PayPal to Credit Card', async () => {
    await payment.selectPayPal();
    await payment.selectCreditCard();
  });

  test('Switch Credit Card to PayPal', async () => {
    await payment.selectCreditCard();
    await payment.selectPayPal();
  });

  // ---------- BACK BUTTON TESTS ----------

  test('Click back button from payment', async () => {
    await payment.clickBack();
  });


  test('Payment page loads correctly', async () => {
    await expect(payment.payBtn.first()).toBeVisible();
  });
});