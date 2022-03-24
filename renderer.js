// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const puppeteer = require("puppeteer");
var page;
var email;
var password;
const login = async () => {
  email = document.getElementById("email").value;
  password = document.getElementById("password").value;
  const browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();
  await page.goto("https://discord.com/login");
  await page.type('[name="email"]', email);
  await page.type('[name="password"]', password);
  await page.click('[type="submit"]');
};
const getListRoom = async () => {
  const text = await page.evaluate(() => {
    return document.querySelectorAll('[aria-label="Servers"]');
  });

  console.log(text);
};
// (async  () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto("https://example.com");
//   await page.screenshot({ path: "example.png" });
//   console.log("da chay");
//   await browser.close();
// })();
