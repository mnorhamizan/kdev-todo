import { test, expect } from '@playwright/test';

test.describe('Todo List App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the todo list title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Todo List');
  });

  test('should show empty state when no todos exist', async ({ page }) => {
    await expect(page.locator('text=No todos yet. Add one above!')).toBeVisible();
  });

  test('should add a new todo', async ({ page }) => {
    const todoText = 'Buy groceries';
    
    // Add a todo
    await page.fill('input[placeholder="Add a new todo..."]', todoText);
    await page.click('button:has-text("Add")');
    
    // Verify todo appears in the list
    await expect(page.locator(`text=${todoText}`)).toBeVisible();
    
    // Verify input is cleared
    await expect(page.locator('input[placeholder="Add a new todo..."]')).toHaveValue('');
    
    // Verify empty state is gone
    await expect(page.locator('text=No todos yet. Add one above!')).not.toBeVisible();
  });

  test('should add multiple todos', async ({ page }) => {
    const todos = ['Buy groceries', 'Walk the dog', 'Read a book'];
    
    // Add multiple todos
    for (const todo of todos) {
      await page.fill('input[placeholder="Add a new todo..."]', todo);
      await page.click('button:has-text("Add")');
    }
    
    // Verify all todos appear
    for (const todo of todos) {
      await expect(page.locator(`text=${todo}`)).toBeVisible();
    }
  });

  test('should not add empty todos', async ({ page }) => {
    // Try to add empty todo
    await page.click('button:has-text("Add")');
    
    // Verify empty state still shows
    await expect(page.locator('text=No todos yet. Add one above!')).toBeVisible();
    
    // Try to add whitespace-only todo
    await page.fill('input[placeholder="Add a new todo..."]', '   ');
    await page.click('button:has-text("Add")');
    
    // Verify empty state still shows
    await expect(page.locator('text=No todos yet. Add one above!')).toBeVisible();
  });

  test('should add todo by pressing Enter', async ({ page }) => {
    const todoText = 'Press Enter to add';
    
    await page.fill('input[placeholder="Add a new todo..."]', todoText);
    await page.press('input[placeholder="Add a new todo..."]', 'Enter');
    
    await expect(page.locator(`text=${todoText}`)).toBeVisible();
  });
});