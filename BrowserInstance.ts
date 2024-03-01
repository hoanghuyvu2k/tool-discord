import {  Page, Browser } from "puppeteer";

export class BrowserInstance {
  id: string;
  browser: Browser;
  page: Page;

  constructor(id: string, browser: Browser, page: Page) {
    this.id = id;
    this.browser = browser;
    this.page = page;
  }

  async close() {
    try {
      await this.browser.close();
    } catch (error) {
      console.error(`Error closing browser: ${error}`);
      // Handle the error here
    }
  }
}