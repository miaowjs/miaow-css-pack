# miaow-css-pack

> Miaow的CSS打包工具,以`@import`为打包关键字

```css
/* foo.css */
@import "bar.css" ;
@import "baz.css" print;

.foo {
  color: black;
}

/* bar.css */
.bar {
  color: red;
}

.bar::before {
  content: 'hello';
}

.bar::after {
  content: 'world';
}

/* 处理后 */
/* foo.css */
.bar {
  color: red;
}

.bar::before {
  content: 'hello';
}

.bar::after {
  content: 'world';
}
@import "baz.css" print;

.foo {
  color: black;
}
```

## 使用说明

### 安装

```
npm install miaow-css-pack --save-dev
```

### 在项目的 miaow.config.js 中添加模块的 tasks 设置

```javascript
//miaow.config.js
module: {
  tasks: [
    {
      test: /\.css$/,
      plugins: ['miaow-css-pack']
    }
  ]
}
```
