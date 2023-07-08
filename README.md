# bcy-downloader

bcy-downloader是一个用于下载半次元（bcy.net）帖子截图的工具。它包含了前端和后端部分，并主要使用puppeteer来实现截图功能。

**然后会上传到阿里云oss可以自己配置**

## 前端

前端部分使用了React和Ant Design组件库进行开发。React是一个流行的JavaScript库，用于构建用户界面，它具有组件化和响应式的特性，能够帮助开发人员构建复杂的交互式界面。Ant Design是一个优秀的前端UI组件库，提供了丰富的预设计件，帮助开发人员快速构建美观的用户界面。

## 后端

后端部分使用了Express和TypeScript进行开发。Express是一个流行的Node.js Web应用程序框架，它提供了简洁灵活的API，帮助开发人员构建强大的Web应用程序和API。TypeScript是JavaScript的超集，在其基础上添加了静态类型和其他高级特性，帮助开发人员在大型项目中编写可维护和可扩展的代码。

通过使用Express和TypeScript，后端部分能够提供一组API接口，供前端调用。这些接口可以接收前端发送的请求，使用puppeteer来访问半次元网站并进行截图操作。然后，后端将截图结果返回给前端，完成整个下载流程。

总的来说，bcy-downloader是一个方便的工具，可帮助用户轻松地下载半次元帖子的截图。通过前后端配合，使用了React、Ant Design、Express、TypeScript和puppeteer等技术，它能够提供良好的用户体验和稳定的下功能。

### 配置阿里云oss信息

于index.ts中

```
var ossClient = new oss({
  accessKeyId: OSS_ACCESS_KEY_ID,
  accessKeySecret: OSS_ACCESS_KEY_SECRET,
  region: OSS_REGION,
  bucket: OSS_BUCKET,
});
```

### API

请求地址/banciyuan

请求方式:POST

请求体:

```json
{
  "url": "https://bcy.net/item/detail/[帖子ID]"
}
```

返回

```json
{
  "title": "帖子标题",
  "imageUrl": "https://你的图像URL" //阿里云oss的地址
}
```

