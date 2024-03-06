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
  // email = document.getElementById("email").value;
  // password = document.getElementById("password").value;
  console.log("click login", puppeteer.executablePath());

  browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    userDataDir: "D:\\usrdata\\puppeteer_crawler_profile1",
    // args: ["--profile-directory=Profile 2"],
    // args: [
    //   "--disable-extensions-except=/path/to/my/extension",
    //   "--load-extension=/path/to/my/extension",
    //   "--user-data-dir=%userprofile%\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 2",
    // ],
  });
  browser2 = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    userDataDir: "D:\\usrdata\\puppeteer_crawler_profile2",
    // args: ["--profile-directory=Profile 2"],
    // args: [
    //   "--disable-extensions-except=/path/to/my/extension",
    //   "--load-extension=/path/to/my/extension",
    //   "--user-data-dir=%userprofile%\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 2",
    // ],
  });
  console.log(page);
  page = await browser.newPage();

  await page.setViewport({ width: 1280, height: 600 });
  await page.goto("https://discord.com/login");
  page2 = await browser2.newPage();

  await page2.setViewport({ width: 1280, height: 600 });
  await page2.goto("https://youtube.com");
  // await page.type('[name="email"]', email);
  // await page.type('[name="password"]', password);
  // await page.click('[type="submit"]');
};
const getListRoom = async () => {
  const listServers = await page.evaluate(() => {
    let servers = [];
    let listServer = document.querySelectorAll('[aria-label="Servers"]')[0];
    listServer.childNodes.forEach((server, index) => {
      servers.push(server.innerHTML);
    });

    return servers;
  });

  const list = document.getElementById("list-server");
  for (let indexServer = 0; indexServer < listServers.length; indexServer++) {
    let server = listServers[indexServer];
    let ele = document.createElement("div");
    let wrapperServer = document.createElement("div");
    wrapperServer.innerHTML = server;
    wrapperServer.setAttribute("class", "server border");
    wrapperServer.addEventListener("click", function () {
      changeServer(indexServer);
    });
    ele.setAttribute("class", "d-flex");
    ele.appendChild(createInput(indexServer));
    ele.appendChild(wrapperServer);
    let channel = await getListChannel(indexServer);
    ele.appendChild(channel);
    list.appendChild(ele);
  }
};
// const getListChannel = async (indexServer) => {
//   await page.waitForSelector('[aria-label="Channels"]');
//   const listChannelsFromWeb = await page.evaluate(() => {
//     let channels = [];
//     let listChannel = document.querySelectorAll('[aria-label="Channels"]')[0];
//     listChannel.childNodes.forEach((channel, index) => {
//       channels.push(channel.innerHTML);
//     });

//     return channels;
//   });
//   let listChannel = document.createElement("div");
//   listChannel.setAttribute("id", `list-channel-${indexServer}`);
//   listChannelsFromWeb.forEach((channel, indexChannel) => {
//     let wrapperChannel = document.createElement("div");
//     wrapperChannel.innerHTML = channel;
//     wrapperChannel.setAttribute("class", "channel border");
//     // wrapperChannel.addEventListener("click", function () {
//     //   change(indexChannel);
//     // });
//     listChannel.appendChild(wrapperChannel);
//   });
//   console.log(listChannel);
//   return listChannel;
// };
const getListChannel = async (indexServer) => {
  // const list = document.getElementById("list-server");
  // for (
  //   let indexServer = 0;
  //   indexServer < list.childNodes.length;
  //   indexServer++
  // ) {
  changeServer(indexServer);
  await page.waitFor(500);
  await page.waitForSelector('[aria-label="Channels"]');
  const listChannelsFromWeb = await page.evaluate(() => {
    let channels = [];
    let listChannel = document.querySelectorAll('[aria-label="Channels"]')[0];
    listChannel.childNodes.forEach((channel, index) => {
      channels.push(channel.innerText);
    });

    return channels;
  });
  let listChannel = document.createElement("div");
  listChannel.setAttribute("id", `list-channel-${indexServer}`);
  listChannelsFromWeb.forEach((channel, indexChannel) => {
    let wrapperChannel = document.createElement("div");
    wrapperChannel.innerText = channel;
    wrapperChannel.setAttribute("class", "channel border");
    wrapperChannel.addEventListener("click", function () {
      changeChannel(indexChannel);
    });
    listChannel.appendChild(wrapperChannel);
  });
  return listChannel;
  // list.childNodes[indexServer].appendChild(listChannel);
  // console.log(listChannel);
  // }
};
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
const createInput = (index) => {
  let input = document.createElement("input");
  input.type = "checkbox";
  input.id = `server-${index}`;
  input.setAttribute("class", "form-check-input");
  return input;
};
const changeServer = async (index) => {
  await page.click(`[aria-label="Servers"] >div:nth-child(${index + 1})`);
};
const changeChannel = async (index) => {
  await page.click(`[aria-label="Channels"] :nth-child(${index + 1})`);
};

const comment = async () => {
  // let comment = document.getElementById("comment").value;
  // await page.type(".form-3gdLxP", comment);
  // await page.keyboard.press("Enter");
  document.querySelector(".toast-body").innerText = "Comment thanh cong!";
  $(".toast").toast("show");
};
const waitForComment = async () => {
  await page
    .waitForSelector(
      ".channelTextArea-1FufC0:not(.channelTextAreaDisabled-1p2fQv)",
      { timeout: 10000 }
    )
    .then(() => {
      comment();
      $(".toast").toast("show");
    })
    .catch((e) => {
      console.log(e);
    });
};
