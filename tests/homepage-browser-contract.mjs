import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const port = 4382;
const origin = `http://127.0.0.1:${port}`;
const visualEvidence = [];
let mobileOpeningGeometry;
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
			await page.waitForFunction(
				() => document.querySelector('[data-embed-status]')?.getAttribute('data-status') === 'ready',
				null,
				{ timeout: 8000 },
			);
			const geometry = await page.evaluate(() => ({
				documentOverflow: document.documentElement.scrollWidth - innerWidth,
				mainOverflow: document.querySelector('main').scrollWidth - innerWidth,
			}));
			assert.ok(geometry.documentOverflow <= 1, `${viewport.width}px document overflows`);
			assert.ok(geometry.mainOverflow <= 1, `${viewport.width}px homepage overflows`);
			if (viewport.width === 390) {
				mobileOpeningGeometry = await page.evaluate(() => {
					const name = document.querySelector('.showcase-intro span')?.getBoundingClientRect();
					const firstArtifact = document.querySelector('.artifact')?.getBoundingClientRect();
					return {
						name: name && { x: name.x, y: name.y, width: name.width, height: name.height },
						first: firstArtifact && { x: firstArtifact.x, y: firstArtifact.y },
					};
				});
			}

			const coffee = page.locator('.coffee-artifact');
			const coffeeObject = coffee.locator('[data-coffee-object]');
			const coffeeImages = coffee.locator('img');
			const coffeeImage = coffeeImages.first();
			await coffee.scrollIntoViewIfNeeded();
			await coffeeImages.evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
			assert.equal(await coffeeObject.count(), 1, 'Coffee lifecycle trace must use the whole visible object');
			assert.equal(await coffee.getByRole('button').count(), 0, 'Coffee ambient process must not imply a control');
			assert.equal(await coffee.getByRole('link').count(), 0, 'Coffee must not imply a destination');
			assert.equal(
				await coffeeImage.getAttribute('alt'),
				'One coffee moves from blossom and a selected ripe cherry through drying, parchment release, green coffee and light-medium first crack to a blooming pour-over, falling drop, quiet ripple and waiting handleless tasting cup.',
			);
			const coffeeGeometry = await coffeeImage.evaluate((image) => ({
				loaded: image.complete && image.naturalWidth > 0,
				imageWidth: image.getBoundingClientRect().width,
				panelContentWidth: image.parentElement?.clientWidth ?? 0,
				panelRatio: image.parentElement ? image.parentElement.clientWidth / image.parentElement.clientHeight : 0,
			}));
			assert.equal(coffeeGeometry.loaded, true, `${viewport.width}px Coffee study did not load`);
			assert.ok(
				Math.abs(coffeeGeometry.imageWidth - coffeeGeometry.panelContentWidth) <= 1,
				`${viewport.width}px Coffee study does not fill its panel`,
			);
			assert.ok(Math.abs(coffeeGeometry.panelRatio - 1.72) < 0.04, `${viewport.width}px Coffee panel ratio drifted`);
			assert.equal(await coffeeObject.locator('svg, canvas').count(), 0, 'Coffee must remain a static raster object');
			const coffeeMotion = await coffeeObject.evaluate((element) => ({
				animations: element.getAnimations({ subtree: true }).length,
				brewState: element.getAttribute('data-brew-active'),
			}));
			assert.deepEqual(coffeeMotion, { animations: 0, brewState: null }, 'Coffee contains non-static behavior');

			const evidencePath = join(tmpdir(), `tangents-homepage-${viewport.width}x${viewport.height}-coffee-static.png`);
			await page.screenshot({ path: evidencePath, fullPage: true });
			visualEvidence.push(evidencePath);
			const objectEvidencePath = join(tmpdir(), `tangents-homepage-${viewport.width}x${viewport.height}-coffee-object-static.png`);
			await coffeeObject.screenshot({ path: objectEvidencePath });
			visualEvidence.push(objectEvidencePath);

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
		await article.evaluate(() => document.fonts.ready);
		await article.waitForFunction(() => document.querySelector('[data-site-masthead]')?.getAttribute('data-motion-ready') === 'true');
		assert.equal(await article.getByRole('heading', { level: 1 }).innerText(), 'Countertop Water Filters');
		assert.equal(await article.getByRole('link', { name: 'Blog', exact: true }).count(), 0);
		assert.equal(await article.getByRole('link', { name: 'Home', exact: true }).count(), 0);
		const homeLink = article.getByRole('link', { name: 'Xiaoyu Ouyang — Exogradient home', exact: true });
		assert.equal(await homeLink.count(), 1);
		const articleOpeningGeometry = await article.evaluate(() => {
			const masthead = document.querySelector('[data-site-masthead]')?.getBoundingClientRect();
			const name = document.querySelector('header h2 a')?.getBoundingClientRect();
			const first = document.querySelector('.hero-image')?.getBoundingClientRect();
			const settingsIcon = document.querySelector('#settings-toggle svg')?.getBoundingClientRect();
			return {
				masthead: masthead && { top: masthead.top, height: masthead.height },
				name: name && { x: name.x, y: name.y, width: name.width, height: name.height },
				first: first && { x: first.x, y: first.y },
				settingsIcon: settingsIcon && {
					x: settingsIcon.x,
					y: settingsIcon.y,
					width: settingsIcon.width,
					height: settingsIcon.height,
				},
				documentOverflow: document.documentElement.scrollWidth - innerWidth,
			};
		});
		assert.ok(mobileOpeningGeometry?.name && mobileOpeningGeometry.first);
		assert.ok(articleOpeningGeometry.masthead && articleOpeningGeometry.name && articleOpeningGeometry.first && articleOpeningGeometry.settingsIcon);
		assert.ok(Math.abs(articleOpeningGeometry.name.x - mobileOpeningGeometry.name.x) <= 1);
		assert.ok(Math.abs(articleOpeningGeometry.name.y - mobileOpeningGeometry.name.y) <= 1);
		assert.ok(Math.abs(articleOpeningGeometry.first.x - mobileOpeningGeometry.first.x) <= 1);
		assert.ok(Math.abs(articleOpeningGeometry.first.y - mobileOpeningGeometry.first.y) <= 1);
		assert.ok(
			Math.abs(
				(articleOpeningGeometry.settingsIcon.y + articleOpeningGeometry.settingsIcon.height / 2)
				- (articleOpeningGeometry.name.y + articleOpeningGeometry.name.height / 2)
			) <= 3,
			'reader settings icon must share the author-name optical centerline',
		);
		assert.ok(articleOpeningGeometry.documentOverflow <= 1, 'mobile article overflows');
		await article.mouse.wheel(0, 700);
		await article.waitForFunction(() => document.querySelector('[data-site-masthead]')?.getAttribute('data-compact') === 'true');
		const mastheadDuringTransition = await article.evaluate(() => {
			const masthead = document.querySelector('[data-site-masthead]')?.getBoundingClientRect();
			const first = document.querySelector('.hero-image')?.getBoundingClientRect();
			const name = document.querySelector('header h2 a')?.getBoundingClientRect();
			return masthead && first ? {
				height: masthead.height,
				top: masthead.top,
				firstTop: first.top,
				nameTop: name?.top,
				scrollY,
			} : null;
		});
		assert.ok(mastheadDuringTransition, 'masthead transition geometry is missing');
		assert.ok(
			mastheadDuringTransition.height >= 51
			&& mastheadDuringTransition.height <= articleOpeningGeometry.masthead.height + 1,
			'masthead overshot its opening geometry during collapse',
		);
		assert.ok(Math.abs(mastheadDuringTransition.top) <= 1, 'masthead moved during collapse');
		assert.ok(
			typeof mastheadDuringTransition.nameTop === 'number'
			&& mastheadDuringTransition.nameTop <= articleOpeningGeometry.name.y + 1,
			`identity moved away from its compact position during collapse (${mastheadDuringTransition.nameTop} > ${articleOpeningGeometry.name.y})`,
		);
		assert.ok(
			Math.abs(
				(articleOpeningGeometry.first.y - mastheadDuringTransition.firstTop)
				- mastheadDuringTransition.scrollY
			) <= 2,
			'article position jumped independently of browser scroll',
		);
		await article.waitForTimeout(220);
		const compactMasthead = await article.evaluate(() => {
			const masthead = document.querySelector('[data-site-masthead]');
			const name = document.querySelector('header h2 a')?.getBoundingClientRect();
			const settings = document.querySelector('#settings-toggle')?.getBoundingClientRect();
			if (!(masthead instanceof HTMLElement)) return null;
			const styles = getComputedStyle(masthead);
			return {
				compact: masthead.dataset.compact,
				top: masthead.getBoundingClientRect().top,
				height: masthead.getBoundingClientRect().height,
				position: styles.position,
				background: styles.backgroundColor,
				borderBottomColor: styles.borderBottomColor,
				nameCenter: name && name.y + name.height / 2,
				settingsCenter: settings && settings.y + settings.height / 2,
			};
		});
		assert.ok(compactMasthead, 'compact masthead is missing');
		assert.equal(compactMasthead.compact, 'true');
		assert.equal(compactMasthead.position, 'fixed');
		assert.ok(Math.abs(compactMasthead.top) <= 1, 'compact masthead is not fixed to the viewport top');
		assert.ok(Math.abs(compactMasthead.height - 52) <= 1, 'compact masthead height drifted');
		assert.equal(compactMasthead.background, 'rgb(255, 255, 255)', 'compact masthead must be fully opaque');
		assert.notEqual(compactMasthead.borderBottomColor, 'rgba(0, 0, 0, 0)', 'compact masthead needs a quiet edge');
		assert.ok(
			compactMasthead.nameCenter && compactMasthead.settingsCenter
			&& Math.abs(compactMasthead.nameCenter - compactMasthead.settingsCenter) <= 3,
			'compact identity and settings must share an optical centerline',
		);
		const anchoredHeadingTop = await article.evaluate(() => {
			const heading = document.querySelector('#removing-contaminants');
			heading?.scrollIntoView();
			return heading?.getBoundingClientRect().top;
		});
		assert.ok(
			typeof anchoredHeadingTop === 'number' && anchoredHeadingTop >= 67,
			'article heading navigation must clear the opaque masthead',
		);
		const compactScrollY = await article.evaluate(() => scrollY);
		await article.mouse.wheel(0, -120);
		await article.waitForTimeout(80);
		assert.ok(await article.evaluate(() => scrollY > 0), 'partial upward gesture unexpectedly returned to the top');
		assert.equal(
			await article.locator('[data-site-masthead]').getAttribute('data-compact'),
			'true',
			'compact masthead must not become direction-aware',
		);
		assert.ok(await article.evaluate(() => scrollY) < compactScrollY, 'upward browser gesture did not move the article');
		await article.mouse.wheel(0, -5000);
		await article.waitForFunction(() => scrollY === 0 && document.querySelector('[data-site-masthead]')?.getAttribute('data-compact') === 'false');
		await article.waitForTimeout(220);
		const restoredMasthead = await article.evaluate(() => {
			const masthead = document.querySelector('[data-site-masthead]');
			const name = document.querySelector('header h2 a')?.getBoundingClientRect();
			return masthead && name ? {
				height: masthead.getBoundingClientRect().height,
				name: { x: name.x, y: name.y, width: name.width, height: name.height },
			} : null;
		});
		assert.ok(restoredMasthead);
		assert.ok(restoredMasthead.height > 70, 'full masthead did not return at the document top');
		assert.deepEqual(restoredMasthead.name, articleOpeningGeometry.name, 'opening identity geometry was not restored');
		await homeLink.click();
		await article.waitForURL(`${origin}/`);
		assert.equal(await article.locator('[data-homepage-showcase]').count(), 1);
		await article.goBack();
		await article.waitForURL(`${origin}/blog/countertop-water-filters/`);
		assert.equal(await article.getByRole('heading', { level: 1 }).innerText(), 'Countertop Water Filters');
		const blogRedirectResponse = await article.goto(`${origin}/blog/`);
		assert.equal(blogRedirectResponse?.status(), 200);
		await article.waitForURL(`${origin}/`);
		const rssResponse = await fetch(`${origin}/rss.xml`);
		assert.equal(rssResponse.status, 200);
		assert.match(await rssResponse.text(), /\/blog\/countertop-water-filters\//);
		const sitemapIndexResponse = await fetch(`${origin}/sitemap-index.xml`);
		assert.equal(sitemapIndexResponse.status, 200);
		const sitemapIndex = await sitemapIndexResponse.text();
		const sitemapPath = sitemapIndex.match(/<loc>[^<]*\/(sitemap-[^<]+)<\/loc>/)?.[1];
		assert.ok(sitemapPath, 'Sitemap index must name its generated sitemap');
		const sitemapResponse = await fetch(`${origin}/${sitemapPath}`);
		assert.equal(sitemapResponse.status, 200);
		const sitemap = await sitemapResponse.text();
		assert.match(sitemap, /\/blog\/countertop-water-filters\//);
		assert.doesNotMatch(sitemap, /<loc>https:\/\/www\.exogradient\.dev\/blog\/<\/loc>/);
		await article.close();

		const desktopArticle = await browser.newPage({ viewport: { width: 1280, height: 900 } });
		await desktopArticle.goto(`${origin}/blog/countertop-water-filters/`, { waitUntil: 'domcontentloaded' });
		await desktopArticle.mouse.wheel(0, 700);
		await desktopArticle.waitForFunction(() => document.querySelector('[data-site-masthead]')?.getAttribute('data-compact') === 'true');
		await desktopArticle.waitForTimeout(220);
		const desktopMasthead = await desktopArticle.locator('[data-site-masthead]').evaluate((masthead) => ({
			height: masthead.getBoundingClientRect().height,
			top: masthead.getBoundingClientRect().top,
			background: getComputedStyle(masthead).backgroundColor,
		}));
		assert.ok(Math.abs(desktopMasthead.height - 52) <= 1, 'desktop compact masthead height drifted');
		assert.ok(Math.abs(desktopMasthead.top) <= 1, 'desktop compact masthead is not fixed to the viewport top');
		assert.equal(desktopMasthead.background, 'rgb(255, 255, 255)', 'desktop compact masthead must be opaque');
		await desktopArticle.reload({ waitUntil: 'domcontentloaded' });
		const restoredAtDepth = await desktopArticle.locator('[data-site-masthead]').evaluate((masthead) => ({
			compact: masthead.getAttribute('data-compact'),
			height: masthead.getBoundingClientRect().height,
			scrollY,
		}));
		assert.ok(restoredAtDepth.scrollY > 0, 'desktop reload did not preserve reading position');
		assert.equal(restoredAtDepth.compact, 'true', 'reloaded masthead did not restore compact state');
		assert.ok(Math.abs(restoredAtDepth.height - 52) <= 1, 'reloaded masthead animated from uninitialized geometry');
		await desktopArticle.close();

		const reducedMotionContext = await browser.newContext({
			viewport: { width: 390, height: 844 },
			reducedMotion: 'reduce',
		});
		try {
			const reducedMotionArticle = await reducedMotionContext.newPage();
			await reducedMotionArticle.goto(`${origin}/blog/countertop-water-filters/`, { waitUntil: 'domcontentloaded' });
			assert.equal(
				await reducedMotionArticle.locator('[data-site-masthead]').evaluate((masthead) => getComputedStyle(masthead).transitionDuration),
				'0s',
				'reduced motion must remove the masthead transition',
			);
			await reducedMotionArticle.close();
		} finally {
			await reducedMotionContext.close();
		}

		const touchContext = await browser.newContext({
			viewport: { width: 390, height: 844 },
			hasTouch: true,
			isMobile: true,
		});
		try {
			const touchPage = await touchContext.newPage();
			await touchPage.goto(origin, { waitUntil: 'domcontentloaded' });
			const coffeeObject = touchPage.locator('[data-coffee-object]');
			await coffeeObject.scrollIntoViewIfNeeded();
			assert.equal(await touchPage.locator('.coffee-artifact').getByRole('button').count(), 0);
			assert.equal((await coffeeObject.evaluate((element) => element.getAnimations({ subtree: true }).length)), 0);
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
console.log(`Rendered visual-review evidence:\n${visualEvidence.join('\n')}`);
