---
title: "JavaScript不写分号时出现的问题"
description: "Issues Caused by Omitting Semicolons When Using Generators in JavaScript"
date: "2022-12-12"
tags: ["JavaScript", "笔记"]
badge: "made-by-human"
---

## 问题

下面是一段斐波那契数列的生成器代码：

```javascript
function* fibonacciSequence() {
  let x = 0; let y = 1
  for (;;) {
    yield y;
    [x, y] = [y, x + y]
  }
}
```

由于我平时写 JavaScript 的习惯是不写分号，于是把上面的代码改成了这样：

```javascript
function* fibonacciSequence() {
  const x = 0; const y = 1
  for (;;) {
    yield y
      [x, y] = [y, x + y]
  }
}
```

接着我想获取第 20 个斐波那契数，于是写了下面这段代码：

```javascript
function fibonacci(n) {
  for (const f of fibonacciSequence()) {
    if (n-- <= 0) {
      return f
    }
  }
}
```

调用后却发现结果是：

```javascript
fibonacci(20) // => [1, 1]
```

这显然不符合预期。
正常情况下，第 20 个斐波那契数应该是 `10946`。

JavaScript 解释器本身存在 ASI（Automatic Semicolon Insertion）机制，也就是自动插入分号。
从直觉来看，这两段代码唯一的区别只是是否写了分号，因此初步判断是 ASI 并没有按照期望的方式插入分号。

---

## ASI 规则

ECMAScript 标准中定义的 ASI 包括三条规则和两条例外。

### 三条规则

1. 解析器从左到右解析代码（读入 token）。
   当遇到一个无法构成合法语句的 token 时，解析器会在以下情况中尝试在该 token 之前插入分号，这个不合群的 token 被称为 offending token：
   - 如果该 token 与前一个 token 之间存在至少一个换行
   - 如果该 token 是 `}`
   - 如果前一个 token 是 `)`，并且解析器尝试将后续 token 解析为 do...while 语句

2. 当解析到文件末尾，语法仍然无法构成合法语句时，会在文件末尾插入分号。

3. 当解析遇到 restricted production（如 return、break、continue 等），并且在规定的 [no LineTerminator here] 位置出现了换行，则在换行处插入分号。

### 两条例外

1. 分号不能被解析成空语句。
2. 分号不能被解析成 for 语句中的两个分号之一。

---

## 分析

根据 ASI 的规则，当 JavaScript 解释器解析到下面这段代码时：

```javascript
yield y
[x, y] = [y, x + y]
```

解析过程中的 token 是：

- 前一个 token：`y`
- 下一个 token：`[`

这并不满足任何插入分号的条件，因此 ASI 不会在 `yield y` 后插入分号。

最终，这段代码会被解析为：

```javascript
function* fibonacciSequence() {
  const x = 0; const y = 1
  for (;;) {
    yield y[x, y] = [y, x + y]
  }
}
```

这也正是最终结果不符合预期的原因。
