import { test, expect } from '@playwright/test';

test.describe('Todo Deletion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Add test todos
    const todos = ['First todo', 'Second todo', 'Third todo'];
    for (const todo of todos) {
      await page.fill('input[placeholder="Add a new todo..."]', todo);
      await page.click('button:has-text("Add")');
    }
  });

  test('should delete a single todo', async ({ page }) => {
    // Verify todo exists
    await expect(page.locator('text=Second todo')).toBeVisible();
    
    // Delete the second todo
    await page.locator('div:has-text("Second todo")').locator('button:has-text("Delete")').click();
    
    // Verify todo is removed
    await expect(page.locator('text=Second todo')).not.toBeVisible();
    
    // Verify other todos remain
    await expect(page.locator('text=First todo')).toBeVisible();
    await expect(page.locator('text=Third todo')).toBeVisible();
  });

  test('should delete multiple todos', async ({ page }) => {
    // Delete first and third todos
    await page.locator('div:has-text("First todo")').locator('button:has-text("Delete")').click();
    await page.locator('div:has-text("Third todo")').locator('button:has-text("Delete")').click();
    
    // Verify deleted todos are gone
    await expect(page.locator('text=First todo')).not.toBeVisible();
    await expect(page.locator('text=Third todo')).not.toBeVisible();
    
    // Verify remaining todo exists
    await expect(page.locator('text=Second todo')).toBeVisible();
  });

  test('should delete completed todo', async ({ page }) => {
    // Complete the first todo
    await page.locator('div:has-text("First todo")').locator('input[type="checkbox"]').click();
    
    // Verify it's completed
    await expect(page.locator('div:has-text("First todo")').locator('input[type="checkbox"]')).toBeChecked();
    
    // Delete the completed todo
    await page.locator('div:has-text("First todo")').locator('button:has-text("Delete")').click();
    
    // Verify it's removed
    await expect(page.locator('text=First todo')).not.toBeVisible();
    
    // Verify other todos remain
    await expect(page.locator('text=Second todo')).toBeVisible();
    await expect(page.locator('text=Third todo')).toBeVisible();
  });

  test('should show empty state when all todos are deleted', async ({ page }) => {
    // Delete all todos
    await page.locator('div:has-text("First todo")').locator('button:has-text("Delete")').click();
    await page.locator('div:has-text("Second todo")').locator('button:has-text("Delete")').click();
    await page.locator('div:has-text("Third todo")').locator('button:has-text("Delete")').click();
    
    // Verify empty state appears
    await expect(page.locator('text=No todos yet. Add one above!')).toBeVisible();
  });

  test('should be able to add new todo after deleting all', async ({ page }) => {
    // Delete all todos
    await page.locator('div:has-text("First todo")').locator('button:has-text("Delete")').click();
    await page.locator('div:has-text("Second todo")').locator('button:has-text("Delete")').click();
    await page.locator('div:has-text("Third todo")').locator('button:has-text("Delete")').click();
    
    // Add a new todo
    await page.fill('input[placeholder="Add a new todo..."]', 'New todo after deletion');
    await page.click('button:has-text("Add")');
    
    // Verify new todo appears
    await expect(page.locator('text=New todo after deletion')).toBeVisible();
    
    // Verify empty state is gone
    await expect(page.locator('text=No todos yet. Add one above!')).not.toBeVisible();
  });

  test('should delete todos in any order', async ({ page }) => {
    // Delete middle todo first
    await page.locator('div:has-text("Second todo")').locator('button:has-text("Delete")').click();
    
    // Delete last todo
    await page.locator('div:has-text("Third todo")').locator('button:has-text("Delete")').click();
    
    // Delete first todo
    await page.locator('div:has-text("First todo")').locator('button:has-text("Delete")').click();
    
    // Verify all are gone and empty state shows
    await expect(page.locator('text=First todo')).not.toBeVisible();
    await expect(page.locator('text=Second todo')).not.toBeVisible();
    await expect(page.locator('text=Third todo')).not.toBeVisible();
    await expect(page.locator('text=No todos yet. Add one above!')).toBeVisible();
  });
});