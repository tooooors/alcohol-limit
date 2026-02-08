import { test, expect } from '@playwright/test';

test.describe('飲み過ぎ防止アプリ', () => {
  test.beforeEach(async ({ page }) => {
    // localStorageをクリアしてから開始
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('初期表示が正しい', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('飲み過ぎ防止');
    await expect(page.locator('input[type="number"]')).toHaveValue('3');
    await expect(page.locator('.current')).toHaveText('0');
    await expect(page.locator('.limit')).toHaveText('3');
  });

  test('上限本数を変更できる', async ({ page }) => {
    const input = page.locator('input[type="number"]');
    await input.fill('5');
    await input.blur();
    await expect(page.locator('.limit')).toHaveText('5');
  });

  test('飲むボタンでカウントが増える', async ({ page }) => {
    const drinkButton = page.locator('button:has-text("飲む")');

    await drinkButton.click();
    await expect(page.locator('.current')).toHaveText('1');

    await drinkButton.click();
    await expect(page.locator('.current')).toHaveText('2');
  });

  test('リセットボタンでカウントが0に戻る', async ({ page }) => {
    const drinkButton = page.locator('button:has-text("飲む")');
    const resetButton = page.locator('button:has-text("リセット")');

    await drinkButton.click();
    await drinkButton.click();
    await expect(page.locator('.current')).toHaveText('2');

    await resetButton.click();
    await expect(page.locator('.current')).toHaveText('0');
  });

  test('上限に達すると警告ダイアログが表示される', async ({ page }) => {
    // 上限を2に設定
    const input = page.locator('input[type="number"]');
    await input.fill('2');
    await input.blur();

    const drinkButton = page.locator('button:has-text("飲む")');

    // 2回飲んで上限に到達
    await drinkButton.click();
    await drinkButton.click();

    // 3回目で警告ダイアログが表示される
    await drinkButton.click();
    await expect(page.locator('.dialog')).toBeVisible();
    await expect(page.locator('.dialog h2')).toContainText('上限を超えています');
  });

  test('警告ダイアログで「やめとく」を選ぶとカウントは増えない', async ({ page }) => {
    const input = page.locator('input[type="number"]');
    await input.fill('1');
    await input.blur();

    const drinkButton = page.locator('button:has-text("飲む")');

    await drinkButton.click(); // 1本目
    await drinkButton.click(); // 警告表示

    await page.locator('.btn-cancel').click();

    await expect(page.locator('.dialog')).not.toBeVisible();
    await expect(page.locator('.current')).toHaveText('1');
  });

  test('警告ダイアログで「飲む！」を選ぶとカウントが増え爆発エフェクトが表示される', async ({ page }) => {
    const input = page.locator('input[type="number"]');
    await input.fill('1');
    await input.blur();

    const drinkButton = page.locator('button:has-text("飲む")');

    await drinkButton.click(); // 1本目
    await drinkButton.click(); // 警告表示

    await page.locator('.btn-confirm').click();

    // 爆発エフェクトが表示される
    await expect(page.locator('.explosion-overlay')).toBeVisible();
    await expect(page.locator('.warning-text')).toContainText('飲み過ぎ注意');

    // エフェクトが消えるのを待つ
    await expect(page.locator('.explosion-overlay')).not.toBeVisible({ timeout: 3000 });

    // カウントが増えている
    await expect(page.locator('.current')).toHaveText('2');
  });

  test('上限超過時に背景色が変わる', async ({ page }) => {
    const input = page.locator('input[type="number"]');
    await input.fill('1');
    await input.blur();

    await page.locator('button:has-text("飲む")').click();

    // over-limitクラスが付与される
    await expect(page.locator('.drink-counter')).toHaveClass(/over-limit/);
  });

  test('localStorageにデータが保存される', async ({ page }) => {
    await page.locator('button:has-text("飲む")').click();

    const stored = await page.evaluate(() => {
      return localStorage.getItem('alcohol-limit-data');
    });

    expect(stored).not.toBeNull();
    const data = JSON.parse(stored!);
    expect(data.count).toBe(1);
    expect(data.limit).toBe(3);
  });
});
