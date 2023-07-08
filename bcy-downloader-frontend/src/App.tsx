import { useState } from "react";

import jpg from "./assets/logo.png";
import banner from "./assets/banner.png";
import banner2 from "./assets/banner2.png";

import { Swiper, Toast } from "antd-mobile";
import { Button, Input } from "antd";
import { request } from "./request";

const banners = [
  {
    id: 1,
    url: banner,
  },
  {
    id: 2,
    url: banner2,
  },
];
const bannersItems = banners.map((banner, index) => {
  return (
    <Swiper.Item key={index}>
      <div
        className="content"
        // 背景是图片
        style={
          {
            // background: `url(${banner.url}) no-repeat center center fixed`,
            // backgroundSize: "cover",
          }
        }
      >
        <img src={banner.url} width="100%" alt="" />
      </div>
    </Swiper.Item>
  );
});

const App = () => {
  const [value, setValue] = useState("");

  const [ossValue, setOssValue] = useState("");

  const [pending, setPending] = useState(false);

  const [statusStr, setStatusStr] = useState("图片正在下载中...");

  const [loading, setLoading] = useState(true);

  const input = (e: any) => {
    setValue(e.target.value);
  };

  return (
    <>
      {/* 使用AntDesignMobile组建 */}
      {/* Header：标题：半次元帖子打捞器 ，LOGO：{jpg} */}
      <div className="app">
        <div className="header">
          <img src={jpg} height={30} alt="logo" />
          <div>半次元帖子打捞</div>
        </div>
        <Swiper loop autoplay style={{ width: "100%" }}>
          {bannersItems}
        </Swiper>
        {/* 输入框 */}
        <div className="downloader">
          <div>帖子链接:</div>
          <Input
            onInput={input}
            style={{ height: 60, fontSize: 16, marginTop: 10 }}
          />
          <div>半次元难民QQ群号855498946</div>
          <Button
            style={{ height: 40, fontSize: 16, marginTop: 10 }}
            type="primary"
            onClick={() => {
              if (value.length === 0) {
                Toast.show(`请输入帖子链接`);
                return;
              } else {
                setPending(true);
                Toast.show(`图片正在下载中...`);

                // 让用户保存图片
                request
                  .post<{ title: string; imageUrl: string }>("/banciyuan", {
                    url: value,
                  })
                  .then((res) => {
                    Toast.show(`图片保存中...`);

                    const { title, imageUrl } = res.data;
                    setOssValue(imageUrl);
                    setLoading(false);

                    const a = document.createElement("a");
                    a.href = imageUrl;
                    a.download = title;
                    a.click();
                  })
                  .catch((res) => {
                    console.log(res);
                    setStatusStr("保存失败了，目前只支持半次元帖子 ");
                    Toast.show("保存失败...");
                  });
              }
            }}
          >
            点击下载!
          </Button>
          {/* 如果loading==false就展示 */}
          <div
            style={
              pending === false ? { display: "none" } : { display: "block" }
            }
          >
            {loading === false ? (
              <div>
                <div>图片预览:</div>
                <img
                  src={ossValue}
                  style={{
                    width: "100%",
                    height: "auto",
                    marginTop: 10,
                    borderRadius: 10,
                  }}
                  alt=""
                />
              </div>
            ) : (
              <div>{statusStr}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
