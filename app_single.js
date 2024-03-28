const puppeteer = require("puppeteer");

const listImageUpload = ["./images/test1.png", "./images/test2.png"];

const listURLAfterUpload = [];

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate the page to the URL
  await page.goto("https://app.microcms.io/signin");

  // ====== Sign in ======
  await page.waitForSelector('input[name="email"]');
  await page.type('input[name="email"]', "tung_le_thanh@bita.jp");

  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="password"]', "0336365110dAA@");

  // Find and click the sign-in button
  await page.waitForSelector('button[data-cy="signin-button"]');
  await page.click('button[data-cy="signin-button"]');

  // ====== Sign in ======
  await page.waitForNavigation({ timeout: 10000 });

  const authPage = await browser.newPage();
  await authPage.goto("https://kdp0n7pb7i.microcms.io/media");

  for (const img of listImageUpload) {
    await authPage.waitForSelector("._uploadButton_1rwgp_71");

    const [fileChooser] = await Promise.all([
      authPage.waitForFileChooser(),
      authPage.click("._uploadButton_1rwgp_71 > button"),
    ]);
    await fileChooser.accept([img]);

    await authPage.waitForSelector("._link_pjgp0_25"); // wait to get url link

    const linkHref = await authPage.evaluate(() => {
      const linkElement = document.querySelector("._link_pjgp0_25");
      return linkElement ? linkElement.href : null;
    });

    listURLAfterUpload.push(linkHref);
  }

  console.log("listURLAfterUpload", listURLAfterUpload);
})();
