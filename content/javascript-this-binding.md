---
title: "JavaScript中的this指向"
description: "How 'this' works in JavaScript"
date: "2024-07-10"
tags: ["JavaScript", "笔记"]
badge: "made-by-human"
---

this指向有以下几条规律

- function中this指向的是全局对象，严格模式下this指向的是undefined
- new方法调用构造函数，this指向的是新建的对象
- 调用bind/call/apply方法时，this指向的是绑定的对象
- 一般通过上下文对象调用时，this会被绑定到该对象上
- 箭头函数中this的指向是由外层作用域决定的

## function中的this

> function中this指向的是全局对象，严格模式下this指向的是undefined

```javascript
function f1() {
  console.log(this)
}
f1() // 全局对象

function f2() {
  'use strict'
  console.log(this)
}
f2() // undefined
```

如果是在浏览器环境下，this指向的是window对象

## 构造函数中的this

> new方法调用构造函数，this指向的是新建的对象

```javascript
function f3() {
  this.a = 4
}
const obj = new f3()
console.log(obj3.a) // 4
```
## 调用bind/call/apply时的this

> 调用bind/call/apply方法时，this指向的是绑定的对象

```javascript
const obj4 = {
  a: 5
}
function fn4() {
  return console.log(this.a)
}
fn4.call(obj4)
```

## 上下文对象调用时的this

> 一般通过上下文对象调用时，this会被绑定到该对象上

```javascript
const coder = {
  name: 'henry',
  fn() {
    return this
  }
}
console.log(coder.fn() === coder) // true
```

this会被绑定到最后调用它的对象上

```javascript
const person = {
  name: 'henry',
  girlfriend: {
    name: 'dilireba',
    fn() {
      return this.name
    }
  }
}
console.log(person.girlfriend.fn()) // dilireba
```

## 箭头函数中的this

> 箭头函数中this的指向是由外层作用域决定的

这一段是和 代码块4 类似的代码，只不过属性fn的值是箭头函数

```javascript
const coder = {
  name: 'henry',
  fn: () => {
    return this // 指向的是外部作用域，全局对象或window对象
  }
}
console.log(coder.fn() === coder) // false
```

箭头函数没有自己的this作用域，所以会继承外部作用域的this，一个极端点的例子:

```javascript
const person1 = {
  name: 'person1',
  person2: {
    name: 'person2',
    person3: {
      name: 'person3',
      person4: {
        name: 'person4',
        person5: {
          name: 'person5',
          fn: () => {
            return this.name
          }
        }
      }
    }
  }
}
console.log(person1.person2.person3.person4.person5.fn()) // undefined
```

### 箭头函数的this绑定后无法被修改

```javascript
function foo() {
  return (a) => {
    console.log(this.a)
  }
}

const obj1 = {
  a: 2
}

const obj2 = {
  a: 3
}
const bar = foo.call(obj1)
bar.call(obj2) // 2, 而不是 3
```

普通函数返回箭头函数可以保持箭头函数对上下文的引用，上文的箭头函数已经绑定到了obj1上，无法被修改
