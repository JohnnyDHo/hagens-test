#!/usr/bin/env node
import { chromium } from 'playwright';
const browser = await chromium.launch({ channel: 'chromium' });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
await page.goto('http://localhost:4173/index.html', { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
await page.waitForTimeout(1200);
await page.evaluate(() => document.querySelector('#instagram').scrollIntoView({ block: 'start' }));
await page.waitForTimeout(1600);
await page.screenshot({ path: 'shots/self-fixA/mobile-instagram.png' });
// footer legal row
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(900);
await page.screenshot({ path: 'shots/self-fixA/mobile-footer-legal.png' });
await ctx.close();
await browser.close();
