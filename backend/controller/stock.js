const { default: axios } = require("axios");
const puppeteer = require("puppeteer");

exports.getStockListByTyping = async (req, res) => {
  try {
    const { companyName } = req.body;
    const url = `https://www.screener.in/api/company/search/?q=${companyName}`;
    const { data } = await axios.get(url);
    res.json(data);
  } catch (error) {
    console.log(error);
  }
};
exports.getStockListByTypingPrice = async (req, res) => {
  try {
    const { url } = req.body;

    const browser = await puppeteer.launch({
      headless: "new",
    });
    const page = await browser.newPage();
    try {
      const screenerURL = `https://www.screener.in${url}`;

      await page.goto(screenerURL);

      const price = await page.evaluate(() =>
        Array.from(document.querySelectorAll("#top"), (e) => ({
          title: e.querySelector("span").innerText,
        }))
      );

      res.send(price[0].title.toString().split(" ")[1]);
    } catch (error) {
      console.error("Error scraping suggestions:", error);
      return [];
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.log(error);
  }
};
