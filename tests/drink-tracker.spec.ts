import { test, expect } from '@playwright/test';

test.describe('飲み過ぎ防止アプリ', () => {
  test.beforeEach(async ({ page }) => {
    // localStorageをクリアしてから開始
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  // ========================================
  // 基本機能テスト
  // ========================================

  test('初期表示が正しい', async ({ page }) => {
    // タイトル確認
    await expect(page.locator('h1')).toContainText('飲み過ぎ防止');

    // +/-ボタンが表示されている
    await expect(page.locator('.btn-increase')).toBeVisible();
    await expect(page.locator('.btn-decrease')).toBeVisible();

    // 初期値が3本
    await expect(page.locator('.limit-display .number')).toHaveText('3');

    // カウンターが0/3
    await expect(page.locator('.current')).toHaveText('0');
    await expect(page.locator('.limit')).toHaveText('3');
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
    const decreaseBtn = page.locator('.btn-decrease');
    const drinkButton = page.locator('button:has-text("飲む")');

    // 上限を2に設定（3→2）
    await decreaseBtn.click();

    // 2回飲んで上限に到達
    await drinkButton.click();
    await drinkButton.click();

    // 3回目でWarningDialog（上限超過ダイアログ）が表示される
    await drinkButton.click();
    // WarningDialogは既存のダイアログなので.dialogクラスを使用
    const warningDialog = page.locator('.dialog h2:has-text("上限を超えています")').first();
    await expect(warningDialog).toBeVisible();
  });

  test('警告ダイアログで「やめとく」を選ぶとカウントは増えない', async ({ page }) => {
    const decreaseBtn = page.locator('.btn-decrease');
    const drinkButton = page.locator('button:has-text("飲む")');

    // 上限を1に設定（3→2→1）
    await decreaseBtn.click();
    await decreaseBtn.click();

    await drinkButton.click(); // 1本目
    await drinkButton.click(); // 警告表示

    await page.locator('.btn-cancel').first().click();

    // カウントは1のまま
    await expect(page.locator('.current')).toHaveText('1');
  });

  test('警告ダイアログで「飲む！」を選ぶとカウントが増え爆発エフェクトが表示される', async ({ page }) => {
    const decreaseBtn = page.locator('.btn-decrease');
    const drinkButton = page.locator('button:has-text("飲む")');

    // 上限を1に設定（3→2→1）
    await decreaseBtn.click();
    await decreaseBtn.click();

    await drinkButton.click(); // 1本目
    await drinkButton.click(); // 警告表示

    await page.locator('.btn-confirm').first().click();

    // 爆発エフェクトが表示される
    await expect(page.locator('.explosion-overlay')).toBeVisible();
    await expect(page.locator('.warning-text')).toContainText('飲み過ぎ注意');

    // エフェクトが消えるのを待つ
    await expect(page.locator('.explosion-overlay')).not.toBeVisible({ timeout: 3000 });

    // カウントが増えている
    await expect(page.locator('.current')).toHaveText('2');
  });

  test('上限超過時に背景色が変わる', async ({ page }) => {
    const decreaseBtn = page.locator('.btn-decrease');

    // 上限を1に設定（3→2→1）
    await decreaseBtn.click();
    await decreaseBtn.click();

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

  // ========================================
  // v02新機能: LimitInput +/-ボタンテスト
  // ========================================

  test('+ボタンで目標本数を増やせる', async ({ page }) => {
    const increaseBtn = page.locator('.btn-increase');
    const limitDisplay = page.locator('.limit-display .number');
    const counterLimit = page.locator('.limit');

    // 初期値3
    await expect(limitDisplay).toHaveText('3');

    // +ボタンで4に（確認ダイアログあり）
    await increaseBtn.click();
    await expect(page.locator('.overlay .dialog .message')).toBeVisible();

    await page.locator('.overlay .btn-confirm').click();

    // 爆発エフェクト待ち
    await page.waitForTimeout(500);

    await expect(limitDisplay).toHaveText('4');
    await expect(counterLimit).toHaveText('4');
  });

  test('-ボタンで目標本数を減らせる', async ({ page }) => {
    const decreaseBtn = page.locator('.btn-decrease');
    const limitDisplay = page.locator('.limit-display .number');
    const counterLimit = page.locator('.limit');

    // 初期値3
    await expect(limitDisplay).toHaveText('3');

    // -ボタンで2に
    await decreaseBtn.click();

    await expect(limitDisplay).toHaveText('2');
    await expect(counterLimit).toHaveText('2');
  });

  test('limit=1で-ボタンが無効化される', async ({ page }) => {
    const decreaseBtn = page.locator('.btn-decrease');
    const limitDisplay = page.locator('.limit-display .number');

    // 3→2→1と減らす
    await decreaseBtn.click();
    await decreaseBtn.click();
    await expect(limitDisplay).toHaveText('1');

    // -ボタンが無効化される
    await expect(decreaseBtn).toBeDisabled();
  });

  test('3本への増加で確認ダイアログ表示（爆発なし）', async ({ page }) => {
    const decreaseBtn = page.locator('.btn-decrease');
    const increaseBtn = page.locator('.btn-increase');
    const limitDisplay = page.locator('.limit-display .number');

    // 3→2に減らす
    await decreaseBtn.click();
    await expect(limitDisplay).toHaveText('2');

    // 2→3に増やす（確認ダイアログ表示）
    await increaseBtn.click();
    await expect(page.locator('.overlay .dialog .message')).toBeVisible();
    await expect(page.locator('.overlay .dialog .message')).toContainText('本当に増やしますか');

    // 「はい」を選択
    await page.locator('.overlay .btn-confirm').click();

    // 爆発エフェクトが出ないこと（短時間待機して確認）
    await page.waitForTimeout(300);
    await expect(page.locator('.explosion-overlay')).not.toBeVisible();

    // limit=3に変更
    await expect(limitDisplay).toHaveText('3');
  });

  test('4本への増加で確認ダイアログ→爆発エフェクト', async ({ page }) => {
    const increaseBtn = page.locator('.btn-increase');
    const limitDisplay = page.locator('.limit-display .number');

    // 初期値3
    await expect(limitDisplay).toHaveText('3');

    // 3→4に増やす（確認ダイアログ表示）
    await increaseBtn.click();
    await expect(page.locator('.overlay .dialog .message')).toBeVisible();

    // 「はい」を選択
    await page.locator('.overlay .btn-confirm').click();

    // 爆発エフェクトが表示される
    await expect(page.locator('.explosion-overlay')).toBeVisible();
    await expect(page.locator('.warning-text')).toContainText('飲み過ぎ注意');

    // エフェクトが消えるのを待つ
    await expect(page.locator('.explosion-overlay')).not.toBeVisible({ timeout: 3000 });

    // limit=4に変更
    await expect(limitDisplay).toHaveText('4');
  });

  test('5本超に増やせない（Toast表示）', async ({ page }) => {
    const increaseBtn = page.locator('.btn-increase');
    const limitDisplay = page.locator('.limit-display .number');

    // 3→4→5と増やす
    await increaseBtn.click();
    await page.locator('.overlay .btn-confirm').click();
    await page.waitForTimeout(500); // 爆発エフェクト待ち

    await increaseBtn.click();
    await page.locator('.overlay .btn-confirm').click();
    await page.waitForTimeout(500); // 爆発エフェクト待ち

    await expect(limitDisplay).toHaveText('5');

    // 5→6に増やそうとする
    await increaseBtn.click();

    // Toast「飲み過ぎです」が表示される
    await expect(page.locator('.toast')).toBeVisible();
    await expect(page.locator('.toast-message')).toContainText('飲み過ぎです');

    // limitは5のまま
    await expect(limitDisplay).toHaveText('5');
  });

  test('2本以下への減少でポジティブフィードバック', async ({ page }) => {
    const decreaseBtn = page.locator('.btn-decrease');

    // 3→2に減らす
    await decreaseBtn.click();

    // Toast「その調子！」が表示される
    await expect(page.locator('.toast')).toBeVisible();
    await expect(page.locator('.toast-message')).toContainText('その調子');
  });

  test('確認ダイアログで「いいえ」を選ぶと変更されない', async ({ page }) => {
    const increaseBtn = page.locator('.btn-increase');
    const limitDisplay = page.locator('.limit-display .number');

    // 初期値3
    await expect(limitDisplay).toHaveText('3');

    // 3→4に増やそうとする
    await increaseBtn.click();
    await expect(page.locator('.overlay .dialog .message')).toBeVisible();

    // 「いいえ」を選択
    await page.locator('.overlay .btn-cancel').click();

    // limitは3のまま
    await expect(limitDisplay).toHaveText('3');

    // ダイアログが閉じる
    await expect(page.locator('.overlay .dialog')).not.toBeVisible();
  });

  test('減少で超過時の確認ダイアログ', async ({ page }) => {
    const drinkBtn = page.locator('button:has-text("飲む")');
    const decreaseBtn = page.locator('.btn-decrease');
    const limitDisplay = page.locator('.limit-display .number');

    // 3本飲む
    await drinkBtn.click();
    await drinkBtn.click();
    await drinkBtn.click();

    // 3→2に減らそうとする（count=3なので確認ダイアログ）
    await decreaseBtn.click();
    await expect(page.locator('.overlay .dialog .message')).toBeVisible();
    await expect(page.locator('.overlay .dialog .message')).toContainText('既に3本飲んでいますが');

    // 「はい」を選択
    await page.locator('.overlay .btn-confirm').click();

    // limit=2に変更
    await expect(limitDisplay).toHaveText('2');

    // Toast「既に目標を超えています」が表示される
    await expect(page.locator('.toast')).toBeVisible();
    await expect(page.locator('.toast-message')).toContainText('既に目標を超えています');

    // 爆発エフェクトが出ないこと
    await page.waitForTimeout(300);
    await expect(page.locator('.explosion-overlay')).not.toBeVisible();
  });
});
