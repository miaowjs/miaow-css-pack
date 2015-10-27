# miaow-css-pack

> Miaow的CSS打包工具,以`@import`为打包关键字

## 使用效果

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
