import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const bytes = (path) => readFile(new URL(`../${path}`, import.meta.url));

const visualApprovalSources = [
	'src/components/home/ArtifactCaption.astro',
	'src/components/home/CoffeeArtifact.astro',
	'src/components/home/HomepageShowcase.astro',
	'src/components/home/SplashArtifact.astro',
	'src/components/home/WaterFilterArtifact.astro',
	'src/styles/home.css',
	'src/assets/coffee-lifecycle-craft-story.png',
];

async function homepageVisualHash() {
	const hash = createHash('sha256');
	for (const path of visualApprovalSources) {
		hash.update(path);
		hash.update('\0');
		hash.update(await bytes(path));
		hash.update('\0');
	}
	return hash.digest('hex');
}

test('the current homepage composition has explicit owner visual approval', async () => {
	let approval;
	try {
		approval = JSON.parse(await source('tests/homepage-visual-approval.json'));
	} catch (error) {
		if (error?.code === 'ENOENT') {
			assert.fail('Homepage visual approval is missing. Run the rendered desktop/phone review and obtain explicit owner approval before shipping.');
		}
		throw error;
	}

	assert.equal(approval.status, 'approved', 'Homepage visual review is not approved');
	assert.equal(approval.approvedBy, 'Xiaoyu Ouyang', 'Only the owner can approve homepage visual quality');
	assert.deepEqual(
		approval.viewports,
		['390x844', '596x1137', '1280x900'],
		'Visual approval must cover phone, narrow, and desktop collection layouts',
	);
	assert.deepEqual(
		approval.states,
		['coffee-static'],
		'Visual approval must cover the authored static Coffee object',
	);
	assert.equal(
		approval.contentHash,
		await homepageVisualHash(),
		'Homepage visual sources changed after approval; rendered comparative review is required again',
	);
});

test('Tangents owns the homepage, editorial route, and original water mechanisms', async () => {
	const [homepage, water, articleRoute, article] = await Promise.all([
		source('src/components/home/HomepageShowcase.astro'),
		source('src/components/home/WaterFilterArtifact.astro'),
		source('src/pages/blog/[...slug].astro'),
		source('src/content/blog/countertop-water-filters.mdx'),
	]);

	assert.match(homepage, /<WaterFilterArtifact\s*\/>/);
	assert.match(homepage, /<span>Xiaoyu Ouyang<\/span>/);
	assert.match(articleRoute, /getCollection\('blog'\)/);
	assert.match(article, /title:\s*['"]Countertop Water Filters['"]/);
	for (const mode of ['granular', 'structured', 'block', 'ro']) {
		assert.match(water, new RegExp(`data-panel="${mode}"`));
	}
	assert.match(water, /class="matrix-ties"/);
	assert.match(water, /class="block-texture"/);
	assert.match(water, /class="membrane-folds"/);
	assert.match(water, /class="permeate-ribbon"/);
});

test('the live Splash product and full-row destination are canonical', async () => {
	const [splash, caption, styles] = await Promise.all([
		source('src/components/home/SplashArtifact.astro'),
		source('src/components/home/ArtifactCaption.astro'),
		source('src/styles/home.css'),
	]);

	assert.match(splash, /https:\/\/hue\.exogradient\.dev\/\?embed=play/);
	assert.match(splash, /href="https:\/\/hue\.exogradient\.dev\/"/);
	assert.doesNotMatch(splash, /splash-of-hue\.vercel\.app/);
	assert.match(splash, /actionLabel="Open game"/);
	assert.match(caption, /class="artifact-caption artifact-caption-link"/);
	assert.match(caption, /class="artifact-action"/);
	assert.match(styles, /\.artifact-caption-link\s*\{[^}]*-webkit-tap-highlight-color:\s*transparent;/s);
	assert.match(styles, /\.artifact-caption-link:active h2,\s*\.artifact-caption-link:focus-visible h2/);
	assert.match(styles, /\.artifact-caption-link:active \.artifact-outbound,\s*\.artifact-caption-link:focus-visible \.artifact-outbound/);
	assert.match(styles, /@media \(hover: hover\) and \(pointer: fine\)\s*\{[^}]*\.artifact-caption-link:hover h2/s);
	assert.doesNotMatch(styles, /\.artifact-caption-link:hover h2,\s*\.artifact-caption-link:focus-visible h2/);
});

test('Coffee is an honest static lifecycle without a false destination', async () => {
	const [homepage, coffee, styles] = await Promise.all([
		source('src/components/home/HomepageShowcase.astro'),
		source('src/components/home/CoffeeArtifact.astro'),
		source('src/styles/home.css'),
	]);

	assert.match(homepage, /<CoffeeArtifact\s*\/>/);
	assert.match(coffee, /coffee-lifecycle-craft-story\.png/);
	assert.match(coffee, /selected ripe cherry through drying, parchment release, green coffee and light-medium first crack/);
	assert.match(coffee, /title="From Blossom to Cup" statusLabel="In the studio"/);
	assert.match(coffee, /<figure[^>]*data-coffee-object/);
	assert.doesNotMatch(coffee, /<button\b|<a\b|href=|<script|<svg|<canvas|IntersectionObserver|pointerenter|addEventListener|data-auction|auction-dial|auction-ticket/);
	assert.doesNotMatch(coffee, /Río Blanco|auction|observed|\$200\.10/);
	assert.doesNotMatch(styles, /\.coffee-study-image-(?:quiet|base)\s*\{[^}]*grayscale\(/s);
	assert.doesNotMatch(styles, /coffee-study-image-trace|coffee-process-trace|radial-gradient\(ellipse at center/);
	assert.doesNotMatch(styles, /coffee-brew-motion|coffee-falling-drop|coffee-impact-dimple|coffee-ripple|coffee-drop-fall|data-brew-active/);
	assert.doesNotMatch(styles, /\.coffee-object\s*\{[^}]*cursor:\s*pointer/s);
});

test('earned focus uses the versioned product signal and measured useful geometry', async () => {
	const homepage = await source('src/components/home/HomepageShowcase.astro');

	assert.match(homepage, /exogradient:splash-engagement/);
	assert.match(homepage, /message\.version !== 1/);
	assert.match(homepage, /message\.phase === 'ready'/);
	assert.match(homepage, /message\.kind === 'brightness'/);
	assert.match(homepage, /message\.kind === 'color'/);
	assert.match(homepage, /minAreaGain:\s*1\.18/);
	assert.match(homepage, /focusGeometryIsUseful\(\)/);
	assert.doesNotMatch(homepage, /matchMedia\('\(min-width:/);
	assert.match(homepage, /event\.key !== 'Escape'/);
	assert.match(homepage, /window\.addEventListener\('wheel'/);
	assert.match(homepage, /window\.addEventListener\('popstate'/);
});

test('the host boundary is seam-free and retains loading and failure states', async () => {
	const [splash, styles] = await Promise.all([
		source('src/components/home/SplashArtifact.astro'),
		source('src/styles/home.css'),
	]);

	assert.match(splash, /data-status="loading"/);
	assert.match(splash, /The embedded round is unavailable/);
	assert.match(styles, /--embed-canvas:\s*transparent/);
	assert.match(styles, /--embed-boundary:\s*0/);
	assert.match(styles, /--embed-elevation:\s*none/);
	assert.match(styles, /\.splash-frame\s*\{[^}]*width:\s*100%;[^}]*height:\s*100%;[^}]*margin:\s*0;[^}]*border:\s*var\(--embed-boundary\)/s);
});
