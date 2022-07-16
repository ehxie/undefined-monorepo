# 了解 React 中的 ErrorBoundary 吗，它有那些使用场景

避免 js 错误导致渲染白屏

# 有没有使用过 react hooks，它带来了那些便利

便利

- 解决状态和副作用难以复用
- HOC 嵌套地狱
- 不用关系 this
- 副作用和清除副作用可以写在一起（useEffect）而不是分开写在 componentDidMount 和 componentWillUnmount 中

# 如何使用 react hooks 实现一个计数器的组件

使用 setTimeout 实现时，当页面处于不可见 (`document.hidden = false`) 状态时，将可能会停止计时，建议使用 `setInterval` 实现

```react
export function useCountDown(num: number, interval?:number = 1000) {
    const [ count, setCount ] = useState(num)
    let timer
    
    useEffect(()=>{
     	timer = setInterval(()=>{
            if(count > 0){
            setCount(count - 1)
            } else {
                clearInterval(timer)
            }
        },interval)
        
        return ()=>{
            clearInterval(timer)
        }
    },[])
    
    return {
        count, setCount
    }
}
```

# React 中，cloneElement 与 createElement 各是什么，有什么区别

JSX 元素将被转换为 `React.createElement()` 函数来创建 React 元素，这些对象将用于表示 UI 对象。而 `cloneElement` 用于克隆 React 元素并传递新的属性。

```jsx
React.createElement(
  type, // div、span，或者 React 组件
  [props],
  [...children]
)

React.cloneElement(
  element,
  [props],
  [...children]
)
```

# 使用 react 实现一个通用的 message 组件

https://blog.csdn.net/YMX2020/article/details/119737213

# 如何使用 react hooks 实现 useFetch 请求数据

[How to fetch data with React Hooks?](https://www.robinwieruch.de/react-hooks-fetch-data)

# React Portal 有哪些使用场景

在以前， `react` 中所有的组件都会位于 `#app` 下，而使用 `Portals` 提供了一种脱离 `#app` 的组件。

- 适合脱离文档流(out of flow) 的组件，特别是 `position: absolute` 与 `position: fixed` 的组件。比如模态框，通知，警告，goTop 等。

# 什么是 virtual DOM，它的引入带了什么好处

虚拟 DOM 的优点

- 虚拟 DOM 最大的优势在于抽象了原本的渲染过程，实现了跨平台的能力，而不仅仅局限于浏览器的 DOM，可以是安卓和 IOS 的原生组件，可以是近期很火热的小程序，也可以是各种 GUI。
- vdom 把渲染过程抽象化了，从而使得组件的抽象能力也得到提升，并且可以适配 DOM 以外的渲染目标。
- Virtual DOM 在牺牲(牺牲很关键)部分性能的前提下，增加了可维护性，这也是很多框架的通性。 实现了对 DOM 的集中化操作，在数据改变时先对虚拟 DOM 进行修改，再反映到真实的 DOM 中，用最小的代价来更新 DOM，提高效率(提升效率要想想是跟哪个阶段比提升了效率，别只记住了这一条)。
- 打开了函数式 UI 编程的大门。
- 可以渲染到 DOM 以外的端，使得框架跨平台，比如 ReactNative，React VR 等。
- 可以更好的实现 SSR，同构渲染等。这条其实是跟上面一条差不多的。
- 组件的高度抽象化。

虚拟 DOM 的缺点

- 首次渲染大量 DOM 时，由于多了一层虚拟 DOM 的计算，会比 innerHTML 插入慢。
- 虚拟 DOM 需要在内存中的维护一份 DOM 的副本(更上面一条其实也差不多，上面一条是从速度上，这条是空间上)。
- 如果虚拟 DOM 大量更改，这是合适的。但是单一的，频繁的更新的话，虚拟 DOM 将会花费更多的时间处理计算的工作。所以，如果你有一个 DOM 节点相对较少页面，用虚拟 DOM，它实际上有可能会更慢。但对于大多数单页面应用，这应该都会更快。

# react 与 vue 数组中 key 的作用是什么

diff 算法需要比对虚拟 dom 的修改，然后异步的渲染到页面中，当出现大量相同的标签时，vnode 会首先判断 key 和标签名是否一致，如果一致再去判断子节点一致，使用 key 可以帮助 diff 算法提升判断的速度，在页面重新渲染时更快消耗更少

# react 中 ref 是干什么用的，有哪些使用场景



# react hooks 中如何模拟 componentDidMount

```js
useEffect(callback, []);
```

# *** React 中 fiber 是用来做什么的



# React hooks 中 useCallback 的使用场景是什么

1. 作为 props 传递的函数，集合 memo 一起使用；
2. 作为更新触发的依赖项 主要目的是为了避免高昂的计算和不必要的重复渲染

# *** react hooks 的原理是什么

