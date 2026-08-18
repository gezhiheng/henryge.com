---
title: "JavaScript闭包函数"
description: "Javascript closure function"
date: "2024-04-11"
tags: ["JavaScript", "笔记"]
badge: "made-by-human"
---

## 问题

今天在力扣刷题，遇到一个题目要求实现一个只允许一次函数的调用，如下是方法和测试用例：

```
/**
 * @param {Function} fn
 * @return {Function}
 */
var once = function(fn) {
  return function(...args){
      // 在此输入闭包函数的代码
  }
}

// 测试用例
let fn = (a,b,c) => (a + b + c)
let onceFn = once(fn)
onceFn(1,2,3) // 6
onceFn(2,3,6) // undefined
```

这题很简单，一开始我定义了一个全局变量`callCount`用来记录方法调用的次数，然后再方法内自增调用次数，如果大于一次调用就返回undefined。

```
let callCount = 0;
var once = function(fn) {
  return function(...args){
    if (callCount > 0) {
      return undefined;
    }
    callCount++;
    return fn(...args);
  }
};
```

测试没问题提交也可以通过，于是我去看了看别人是怎么做的，我发现别人把变量的定义放在了方法内部，居然也可以实现效果而不是我预想的每次调用方法，变量 `callCount` 会清零

```
var once = function(fn) {
  // callCount在方法内部定义
  let callCount = 0;
  return function(...args){
    if (callCount > 0) {
      return undefined;
    }
    callCount++;
    return fn(...args);
  }
};
```

## 闭包函数特性

经过查阅资料和写demo发现：在JavaScript中当一个函数内部定义了一个函数，且这个内部函数引用了外部函数的变量，此时JavaScript解释器不会回收那个变量的内存就好像类的静态私有成员，实现程序的记忆化。

## 内存泄漏

使用JavaScript闭包很容易在不知不觉中造成内存泄漏,请看下面的例子:

```
let outer = function() {
   let name = 'Jake';
 return function() {
   return name;
 };
};
```

调用 outer()会导致分配给 name 的内存被泄漏。以上代码执行后创建了一个内部闭包，只要返回 的函数存在就不能清理 name，因为闭包一直在引用着它。假如 name 的内容很大（不止是一个小字符 串），那可能就是个大问题了。 ---出自JavaScript高级程序设计
