import express from "express";
import puppeteer from "puppeteer";
import { pathToFileURL } from "url";
import * as dotEnv from "dotenv-flow";

// import doten
dotEnv.config();

const app = express();

app.use(express.json({ limit: "10mb" })); // for parsing application/json
app.use(express.urlencoded({ limit: "10mb", extended: true })); // for parsing application/x-www-form-urlencoded

// 设置错误处理中间件，跑出异常后打印，而不是直接关闭服务器
//todo
import { Request, Response, NextFunction } from "express";

// 设置错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // 打印错误信息
  console.log(err.stack);

  // 发送错误响应
  res.status(500).send("Something broke!");
});

//设置跨域请求
app.all("*", function (req, res, next) {
  let originHeader = req.headers.origin;
  res.header("Access-Control-Allow-Origin", originHeader);
  // res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, x-token"
  );
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());

var oss = require("ali-oss");
const multer = require("multer");

const region = process.env.OSS_REGION;
const accessKeyId = process.env.OSS_ACCESS_KEY_ID;
const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET;
const bucket = process.env.OSS_BUCKET;

var ossClient = new oss({
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region,
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId,
  accessKeySecret,
  bucket,
});

const PORT = 3001;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/banciyuan", async (req, res) => {
  try {
    const { url } = req.body;
    const type = getTypeFromUrl(url);
    if (type === "none") {
      res.status(400).send("Invalid URL");
      return;
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    let title = "";
    let filename = "";
    if (type === "detail") {
      // await page.click(".show-more");
      await page.click(".load-more-comment");
      await sleep(600);
      await page.click(".load-more-comment");
      // await page.click(".show-more");

      const match = url.match(/https:\/\/bcy\.net\/item\/detail\/(.+)/);
      if (match) {
        filename = `detail_${match[1]}`;
      } else {
        res.status(400).send("Invalid URL");
        return;
      }
      title =
        (await page.evaluate(() => {
          return document.querySelector(".question-title")?.textContent;
        })) || "无法获取标题";
    }
    if (type === "list") {
      const match = url.match(/https:\/\/bcy\.net\/group\/list\/(.+)/);
      if (match) {
        filename = `list_${match[1]}`;
      } else {
        res.status(400).send("Invalid URL");
        return;
      }
      title =
        (await page.evaluate(() => {
          return document.querySelector(".group-title-txt")?.textContent;
        })) || "无法获取标题";
    }
    if (type === "collection") {
      const match = url.match(/https:\/\/bcy\.net\/collection\/(.+)/);
      if (match) {
        filename = `collection_${match[1]}`;
      } else {
        res.status(400).send("Invalid URL");
        return;
      }
      title =
        (await page.evaluate(() => {
          return document.querySelector(".collect-detail-name")?.textContent;
        })) || "无法获取标题";
    }
    const index = filename.indexOf("?");
    filename = index >= 0 ? filename.substring(0, index) : filename;

    const savePath = `saved/${filename}.png`;

    const screenshotBuffer = await page.screenshot({
      fullPage: true,
      encoding: "binary",
    });

    const result = await ossClient.put(
      "internal/bcy" + filename + ".png",
      Buffer.from(new Uint8Array(screenshotBuffer)), // 将截图的Buffer转换成不含编码的二进制数组,
      { headers: { "Content-Type": "image/png" } }
    );

    const imageUrl = result.url;
    res.json({ title, imageUrl });
  } catch (err) {
    console.log(err);
  }
});
function getTypeFromUrl(url: string): string {
  url = url.trim().replace(/[^\x20-\x7E]/g, "");
  if (url.startsWith("https://bcy.net/item/detail")) {
    return "detail";
  }
  if (url.startsWith("https://bcy.net/group/list")) {
    return "list";
  }
  if (url.startsWith("https://bcy.net/collection")) {
    return "collection";
  }
  return "none";
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} ${bucket}`);
});
