import { test, expect } from '@playwright/test';

test.describe('Todo Workflows & Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should handle complete todo workflow', async ({ page }) => {
    // Start with empty state
    await expect(page.locator('text=No todos yet. Add one above!')).toBeVisible();

    // Add todos
    const todos = ['Buy groceries', 'Walk the dog', 'Read a book'];
    for (const todo of todos) {
      await page.fill('input[placeholder="Add a new todo..."]', todo);
      await page.click('button:has-text("Add")');
    }

    // Complete some todos
    await page.locator('div:has-text("Buy groceries")').locator('input[type="checkbox"]').click();
    await page.locator('div:has-text("Read a book")').locator('input[type="checkbox"]').click();

    // Verify completion states
    await expect(page.locator('div:has-text("Buy groceries")').locator('input[type="checkbox"]')).toBeChecked();
    await expect(page.locator('div:has-text("Walk the dog")').locator('input[type="checkbox"]')).not.toBeChecked();
    await expect(page.locator('div:has-text("Read a book")').locator('input[type="checkbox"]')).toBeChecked();

    // Delete completed todos
    await page.locator('div:has-text("Buy groceries")').locator('button:has-text("Delete")').click();
    await page.locator('div:has-text("Read a book")').locator('button:has-text("Delete")').click();

    // Verify only uncompleted todo remains
    await expect(page.locator('text=Buy groceries')).not.toBeVisible();
    await expect(page.locator('text=Read a book')).not.toBeVisible();
    await expect(page.locator('text=Walk the dog')).toBeVisible();
    await expect(page.locator('text=No todos yet. Add one above!')).not.toBeVisible();

    // Complete and delete the last todo
    await page.locator('div:has-text("Walk the dog")').locator('input[type="checkbox"]').click();
    await page.locator('div:has-text("Walk the dog")').locator('button:has-text("Delete")').click();

    // Return to empty state
    await expect(page.locator('text=No todos yet. Add one above!')).toBeVisible();
  });

  test('should handle special characters in todo text', async ({ page }) => {
    const specialTodos = [
      'Todo with "quotes"',
      "Todo with 'apostrophes'",
      'Todo with <tags>',
      'Todo with & symbols',
      'Todo with émojis 🎉',
      'Todo with numbers 123'
    ];

    for (const todo of specialTodos) {
      await page.fill('input[placeholder="Add a new todo..."]', todo);
      await page.click('button:has-text("Add")');
      await expect(page.locator(`text=${todo}`)).toBeVisible();
    }
  });

  test('should handle very long todo text', async ({ page }) => {
    const longTodo = 'This is a very long todo item that should still work properly even though it contains a lot of text and might wrap to multiple lines in the UI';
    
    await page.fill('input[placeholder="Add a new todo..."]', longTodo);
    await page.click('button:has-text("Add")');
    
    await expect(page.locator(`text=${longTodo}`)).toBeVisible();
    
    // Should still be able to complete and delete
    await page.locator(`div:has-text("${longTodo}")`).locator('input[type="checkbox"]').click();
    await expect(page.locator(`div:has-text("${longTodo}")`).locator('input[type="checkbox"]')).toBeChecked();
    
    await page.locator(`div:has-text("${longTodo}")`).locator('button:has-text("Delete")').click();
    await expect(page.locator(`text=${longTodo}`)).not.toBeVisible();
  });

  test('should maintain focus after adding todo', async ({ page }) => {
    await page.fill('input[placeholder="Add a new todo..."]', 'First todo');
    await page.click('button:has-text("Add")');
    
    // Input should be focused for quick addition of next todo
    await expect(page.locator('input[placeholder="Add a new todo..."]')).toBeFocused();
  });

  test('should handle rapid interactions', async ({ page }) => {
    // Rapidly add todos
    for (let i = 1; i <= 5; i++) {
      await page.fill('input[placeholder="Add a new todo..."]', `Todo ${i}`);
      await page.press('input[placeholder="Add a new todo..."]', 'Enter');
    }

    // Verify all todos were added
    for (let i = 1; i <= 5; i++) {
      await expect(page.locator(`text=Todo ${i}`)).toBeVisible();
    }

    // Rapidly toggle completion
    for (let i = 1; i <= 5; i++) {
      await page.locator(`div:has-text("Todo ${i}")`).locator('input[type="checkbox"]').click();
    }

    // Verify all are completed
    for (let i = 1; i <= 5; i++) {
      await expect(page.locator(`div:has-text("Todo ${i}")`).locator('input[type="checkbox"]')).toBeChecked();
    }

    // Rapidly delete todos
    for (let i = 1; i <= 5; i++) {
      // Note: After each deletion, the DOM changes, so we need to find the first available delete button
      await page.locator('button:has-text("Delete")').first().click();
    }

    // Verify empty state
    await expect(page.locator('text=No todos yet. Add one above!')).toBeVisible();
  });
});