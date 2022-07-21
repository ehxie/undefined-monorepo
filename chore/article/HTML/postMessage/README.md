## 简介

`window.postMessage()` 方法可以安全地实现**跨源**通信。

通常两个不同页面中的脚本想要通信，必须满足同源策略（协议/主机/端口号相同）才可以相互通信

`window.postMessage() `方法提供了一种受控机制来规避此限制，只要正确的使用，这种方法就很安全。

## 语法

> 本地调试建议安装 VSCode 插件 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

```js
otherWindow.postMessage(message, targetOrigin, [transfer]);
```

- otherWindow: 就是要接收消息的 window 对象
- message: 要发送的消息
- targetOrigin: 通过窗口的 origin 属性来指定哪些窗口能接收到消息事件，其值可以是字符串"\*"（表示无限制）或者一个 URI。
  - 如果你明确的知道消息应该发送到哪个窗口，那么请始终提供一个有确切值的 targetOrigin，而不是\*。不提供确切的目标将导致数据泄露到任何对数据感兴趣的恶意站点。
  - 指定了 URI 的话，必须是相同的域和端口号，不然会报跨域错误。（设置为"\*"不会跨域）
- transfer(可选)：是一串和 message 同时传递的 Transferable 对象。这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。

## 坑

通过上述语法入门，相信很快就会写出以下代码

现在有两个页面

- http://127.0.0.1:5500/A.html
- http://127.0.0.1:5500/B.html

预期

- A 页面监听 message 事件并打印接收到的结果
- B 页面点击按钮后发送数据给 A

代码如下

`A.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Page A</title>
  </head>
  <body>
    <h1>A</h1>

    <script>
      window.addEventListener("message", (event) => {
        console.log("A receive message", event);
      });
    </script>
  </body>
</html>
```

`B.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Page B</title>
  </head>
  <body>
    <h1>B</h1>

    <button id="sendBtn">sendMessage</button>

    <script>
      document.getElementById("sendBtn").addEventListener("click", () => {
        window.postMessage("hello A", "http://127.0.0.1:5500/A.html");
      });
    </script>
  </body>
</html>
```

> 但是无论如何按，A 始终还是没有接收到消息！

此时可以给 B.html 也加一下 message 事件的监听，可以发现 B 页面会接收到消息

`B.html`

```diff
<!-- ... -->
<script>
  // ...
+  window.addEventListener("message", (event) => {
+    console.log("B receive message", event);
+  });
</script>
```

回头看来文档，才发现好像误解了 `otherWindow` 的意思

## 正确姿势

`otherWindow` 指向目标 window 对象
`targetOrigin` 指定的是目标对象的 origin

- 例如指定了 www.aaa.com，则当 otherWindow.origin === 'www.aaa.com'，才会发送该消息，否则都不会发送

## e.g.

### 嵌套页面

> parent 页面中嵌套 child iframe

`parent.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>parent</title>
  </head>
  <body>
    <h1>parent</h1>
    <button id="sendBtn">sendMessage</button>

    <script>
      document.getElementById("sendBtn").addEventListener("click", () => {
        // 获取嵌套 iframe 实例
        const childWindow = document.getElementById("iframe").contentWindow;
        childWindow.postMessage("hello im child");
      });

      window.addEventListener("message", (event) => {
        console.log("parent receive message", event);
      });
    </script>

    <iframe
      id="iframe"
      src="http://127.0.0.1:5500/postMessage/demo-1/child.html"
      frameborder="0"
    ></iframe>
  </body>
</html>
```

`child.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>child</title>
  </head>
  <body>
    <h1>child</h1>
    <button id="sendBtn">sendMessage</button>

    <script>
      document.getElementById("sendBtn").addEventListener("click", () => {
        window.top.postMessage("hello im child");
      });

      window.addEventListener("message", (event) => {
        console.log("child receive message: ", event);
      });
    </script>
  </body>
</html>
```

> 流程
>
> - 通过 Live Server 打开 parent.html，打开控制台，点击 sendMessage 即可看到消息通信

总结:

- 父页面通过 iframe 实例的 contentWindow 拿到嵌套在该页面中的 iframe 的 window 实例
- 子页面直接通过 window.top 获取父页面的 window 实例

### window.open

通过 window.open 的方式打开的页面一般称为子页面

- window.open 返回的 window 对象就是子页面的对象
- 子页面通过 window.opener 拿到通过 window.open 打开该页面的 window 实例

`A.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>A</title>
  </head>
  <body>
    <h1>A</h1>
    <button id="openBtn">open new window</button>
    <button id="sendBtn">sendMessage</button>

    <script>
      let openWindow;
      document.getElementById("openBtn").addEventListener("click", () => {
        openWindow = window.open(
          "http://127.0.0.1:5500/postMessage/demo-2/B.html"
        );
      });

      document.getElementById("sendBtn").addEventListener("click", () => {
        if (!openWindow) {
          console.error("未打开任何子页面");
          return;
        }
        openWindow.postMessage("hello im A");
      });

      window.addEventListener("message", (event) => {
        console.log("A receive message: ", event);
      });
    </script>
  </body>
</html>
```

`B.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>B</title>
  </head>
  <body>
    <h1>B</h1>
    <button id="sendBtn">sendMessage</button>

    <script>
      document.getElementById("sendBtn").addEventListener("click", () => {
        let opener = window.opener;
        if (!opener) {
          console.error("不是由父页面打开");
          return;
        }
        opener.postMessage(
          "hello A",
          "http://127.0.0.1:5500/postMessage/demo-2/A.html"
        );
      });

      window.onload = () => {
        window.addEventListener("message", (event) => {
          console.log("B receive", event);
        });
      };
    </script>
  </body>
</html>
```

> 流程
>
> - 通过 Live Server 打开 A.html，打开控制台
> - 点击 `open` 打开 B.html，打开控制台
> - 在各自页面点击 sendMessage 即可在对方页面收到消息

总结

- 父页面通过 window.open 打开的页面，window.open 返回值就是对应页面的 window 实例
- 通过 window.open 打开的页面，在被打开的页面中 window.opener 就是打开该页面的页面的 window 实例

## 注意

1. 接收到的值需要对 origin 进行验证，如果不是可信的域名发来的消息最好就不要接收

```js
window.addEventListener("message", (event) => {
  // www.abc.com 为可信的域名
  if (event.origin !== "www.abc.com") {
    return;
  }
  console.log("B receive", event);
});
```

2. 发送时如果有明确的 targetUrl 就必须指定，防止数据泄露

- 恶意网站可以在您不知情的情况下更改窗口的位置，因此它可以拦截使用 postMessage 发送的数据。

3. 如果您确实希望从`其他网站`接收 message，请始终使用 `origin` 和 `source` 属性验证发件人的身份。

- 任何窗口（包括例如 http://evil.example.com）都可以向任何其他窗口发送消息，并且您不能保证未知发件人不会发送`恶意消息`。
- 但是，验证身份后，您仍然应该始终验证接收到的`消息的语法`。 否则，您信任只发送受信任邮件的网站中的安全漏洞可能会在您的网站中打开`跨网站脚本漏洞`。

## 黑客攻击的两种办法

`假如不设置 targetOrigin 也不对接收到的数据进行处理`

黑客有两种攻击方法

- 当你的页面使用 window.top.poseMessage() 发送给父页面消息时，黑客`伪造接收方`接收消息（即在自己的页面中嵌入你的页面即可），若有敏感数据就直接被拦截了
- 当你的页面使用 window.addEventListener('message',(event)=>{})接收消息时，黑客`伪造发送方`发送消息
  - 如果你的逻辑如下，后果可想而知

```html
<div id="content"></div>
<script>
  window.addEventListener(
    "message",
    function (event) {
      // 把父窗口发送过来的数据显示在子窗口中;
      document.getElementById("content").innerHTML +=
        event.data + "origin: " + event.origin + "<br />";
    },
    false
  );
</script>
```
