import { test, expect } from '@playwright/test';

test.describe('Todo Completion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Add a test todo
    await page.fill('input[placeholder="Add a new todo..."]', 'Test todo item');
    await page.click('button:has-text("Add")');
  });

  test('should toggle todo completion status', async ({ page }) => {
    const todoItem = page.locator('div:has-text("Test todo item")');
    const checkbox = todoItem.locator('input[type="checkbox"]');
    const todoText = todoItem.locator('span').first();

    // Initially unchecked
    await expect(checkbox).not.toBeChecked();
    await expect(todoText).not.toHaveClass(/line-through/);
    await expect(todoText).toHaveClass(/text-gray-800/);

    // Click to complete
    await checkbox.click();
    await expect(checkbox).toBeChecked();
    await expect(todoText).toHaveClass(/line-through/);
    await expect(todoText).toHaveClass(/text-gray-500/);

    // Click to uncomplete
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
    await expect(todoText).not.toHaveClass(/line-through/);
    await expect(todoText).toHaveClass(/text-gray-800/);
  });

  test('should handle multiple todos with different completion states', async ({ page }) => {
    // Add more todos
    const todos = ['Second todo', 'Third todo'];
    for (const todo of todos) {
      await page.fill('input[placeholder="Add a new todo..."]', todo);
      await page.click('button:has-text("Add")');
    }

    // Complete the first and third todos
    await page.locator('div:has-text("Test todo item")').locator('input[type="checkbox"]').click();
    await page.locator('div:has-text("Third todo")').locator('input[type="checkbox"]').click();

    // Verify states
    const firstTodo = page.locator('div:has-text("Test todo item")');
    const secondTodo = page.locator('div:has-text("Second todo")');
    const thirdTodo = page.locator('div:has-text("Third todo")');

    // First todo should be completed
    await expect(firstTodo.locator('input[type="checkbox"]')).toBeChecked();
    await expect(firstTodo.locator('span').first()).toHaveClass(/line-through/);

    // Second todo should be uncompleted
    await expect(secondTodo.locator('input[type="checkbox"]')).not.toBeChecked();
    await expect(secondTodo.locator('span').first()).not.toHaveClass(/line-through/);

    // Third todo should be completed
    await expect(thirdTodo.locator('input[type="checkbox"]')).toBeChecked();
    await expect(thirdTodo.locator('span').first()).toHaveClass(/line-through/);
  });

  test('should persist completion state when adding new todos', async ({ page }) => {
    // Complete the existing todo
    const checkbox = page.locator('div:has-text("Test todo item")').locator('input[type="checkbox"]');
    await checkbox.click();
    await expect(checkbox).toBeChecked();

    // Add a new todo
    await page.fill('input[placeholder="Add a new todo..."]', 'New todo');
    await page.click('button:has-text("Add")');

    // Verify the first todo is still completed
    await expect(page.locator('div:has-text("Test todo item")').locator('input[type="checkbox"]')).toBeChecked();
    
    // Verify the new todo is uncompleted
    await expect(page.locator('div:has-text("New todo")').locator('input[type="checkbox"]')).not.toBeChecked();
  });
});