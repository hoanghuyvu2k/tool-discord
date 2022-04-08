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
var broswer;
const login = async () => {
  email = document.getElementById("email").value;
  password = document.getElementById("password").value;
  browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    userDataDir: "/tmp/myChromeSession",
  });
  page = await browser.newPage();
  await page.goto("https://discord.com/login");
  // await page.type('[name="email"]', email);
  // await page.type('[name="password"]', password);
  // await page.click('[type="submit"]');
};
const getListRoom = async () => {
  const listChannels = await page.evaluate(() => {
    let channels = [];
    let listChannel = document.querySelectorAll('[aria-label="Servers"]')[0];
    listChannel.childNodes.forEach((channel, index) => {
      channels.push(channel.innerHTML);
    });

    return channels;
  });

  const list = document.getElementById("list-channel");
  listChannels.forEach((channel, index) => {
    let ele = document.createElement("div");
    ele.innerHTML = channel;
    ele.setAttribute("data-index-channel", index);
    ele.addEventListener("click", changeChannel);
    list.appendChild(ele);
  });
};
const changeChannel = async (e) => {
  console.log(e);
};
// (async  () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto("https://example.com");
//   await page.screenshot({ path: "example.png" });
//   console.log("da chay");
//   await browser.close();
// })();
