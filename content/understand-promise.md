---
title: "理解期约(Promise)"
description: "Learn about Promise"
date: "2024-07-18"
tags: ["JavaScript", "笔记"]
badge: "made-by-human"
---

Promise会被**兑现**和**拒绝**，调用Promise的`then()`方法时，传入两个回调函数，第一个回调函数被调用则Promise**兑现**了，第二个回调函数被调用时则Promise被**拒绝**了。
```javascript
fetch('/api').then((response) => {
  console.log('期约兑现了', response)
}, (error) => {
  console.log('期约被拒绝了', error)
})
```
<a name="EWUsG"></a>
## 解决期约
**期约有可能解决了但没被兑现**
```javascript
fetch('/api') // 任务一，返回p1
  .then(callback1) // 任务二，返回p2
  .then(callback2) // 任务三，返回p3
```

- 任务一二三会同时发生，但在任务一创建HTTP请求时发生异步暂停
- 任务二callback1返回的是Promise，此时p2解决了，但不会兑现触发任务三的callback2
- 直到callback1返回的Promise兑现了，p2才会兑现从而触发callback2
<a name="PEF1G"></a>
## 期约更接近现实的写法
```javascript
// 更接近现实的期约写法
fetch('/api/user/profile') // 发送Http请求
  .then((response) => { // 在状态和头部就绪时调用
    if (!response.ok) { // 如果遇到404 Not Found 或类似的错误
      return null // 可能用户未登录，返回空简介
    }
    const type = response.headers.get('Content-Type')
    if (type !== 'application/json') { // 如果服务器返回的不是JSON格式
      throw new TypeError(`服务器返回的不是JSON格式，而是${type}`)
    }
    return response.json()
  })
  .then((profile) => {
    if (profile) {
      displayUserProfile(profile)
    }
    else {
      displayLoggedOutProfilePage()
    }
  })
  .catch((error) => {
    if (error instanceof NetworkError) {
      displayErrorMessage('网络错误')
    }
    else if (error instanceof TypeError) {
      displayErrorMessage('服务器返回类型错误')
    }
    else {
      console.error(error) // 发生了意料之外的错误
    }
  })
```
