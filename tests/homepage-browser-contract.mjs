import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const port = 4382;
const origin = `http://127.0.0.1:${port}`;
const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(port)], {
	stdio: 'ignore',
});

async function waitForServer() {
	for (let attempt = 0; attempt < 80; attempt += 1) {
		try {
			const response = await fetch(origin);
			if (response.ok) return;
		} catch {}
		await new Promise((resolve) => setTimeout(resolve, 100));
	}
	throw new Error('Tangents preview did not start');
}

function engagement() {
	window.dispatchEvent(new MessageEvent('message', {
		origin: 'https://hue.exogradient.dev',
		data: {
			type: 'exogradient:splash-engagement',
			version: 1,
			phase: 'complete',
			kind: 'color',
		},
	}));
}

try {
	await waitForServer();
	const browser = await chromium.launch({ channel: 'chrome', headless: true });
	try {
		for (const viewport of [
			{ width: 390, height: 844 },
			{ width: 596, height: 1137 },
			{ width: 1280, height: 900 },
		]) {
			const page = await browser.newPage({ viewport });
			await page.goto(origin, { waitUntil: 'domcontentloaded' });
			const geometry = await page.evaluate(() => ({
				documentOverflow: document.documentElement.scrollWidth - innerWidth,
				mainOverflow: document.querySelector('main').scrollWidth - innerWidth,
			}));
			assert.ok(geometry.documentOverflow <= 1, `${viewport.width}px document overflows`);
			assert.ok(geometry.mainOverflow <= 1, `${viewport.width}px homepage overflows`);

			for (const [label, mode] of [
				['Granular carbon', 'granular'],
				['Structured carbon', 'structured'],
				['Block + blends', 'block'],
				['Reverse osmosis', 'ro'],
			]) {
				const control = page.getByRole('button', { name: label, exact: true });
				await control.click();
				assert.equal(await control.getAttribute('aria-pressed'), 'true');
				assert.equal(await page.locator('.water-lens').getAttribute('data-mode'), mode);
			}

			await page.evaluate(engagement);
			await page.waitForTimeout(50);
			const focused = await page.locator('[data-homepage-showcase]').getAttribute('data-focused-artifact');
			if (viewport.width === 390) {
				assert.equal(focused, null, 'phone must stay in flow');
				assert.equal(new URL(page.url()).searchParams.has('artifact'), false);
			} else {
				assert.equal(focused, 'splash', `${viewport.width}px should earn useful focus`);
				assert.equal(new URL(page.url()).searchParams.get('artifact'), 'splash');
				await page.keyboard.press('Escape');
				await page.waitForTimeout(450);
				assert.equal(await page.locator('[data-homepage-showcase]').getAttribute('data-focused-artifact'), null);
				assert.equal(new URL(page.url()).searchParams.has('artifact'), false);
			}
			await page.close();
		}

		const article = await browser.newPage({ viewport: { width: 390, height: 844 } });
		const response = await article.goto(`${origin}/blog/countertop-water-filters/`);
		assert.equal(response?.status(), 200);
		assert.equal(await article.getByRole('heading', { level: 1 }).innerText(), 'Countertop Water Filters');
		await article.close();

		const touchContext = await browser.newContext({
			viewport: { width: 390, height: 844 },
			hasTouch: true,
			isMobile: true,
		});
		try {
			const touchPage = await touchContext.newPage();
			await touchPage.goto(origin, { waitUntil: 'domcontentloaded' });
			const splashCaption = touchPage.getByRole('link', { name: 'Open the full Splash of Hue game' });
			const touchTreatment = await splashCaption.evaluate((element) => ({
				tapHighlight: getComputedStyle(element).webkitTapHighlightColor,
				canHoverPrecisely: matchMedia('(hover: hover) and (pointer: fine)').matches,
			}));
			assert.equal(touchTreatment.canHoverPrecisely, false, 'touch Chrome must not receive hover-only styling');
			assert.ok(
				['rgba(0, 0, 0, 0)', 'transparent'].includes(touchTreatment.tapHighlight),
				`touch Chrome tap highlight is ${touchTreatment.tapHighlight}`,
			);
		} finally {
			await touchContext.close();
		}
	} finally {
		await browser.close();
	}
} finally {
	server.kill('SIGTERM');
}

console.log('Homepage browser contract passes at 390px, 596px, and desktop');
