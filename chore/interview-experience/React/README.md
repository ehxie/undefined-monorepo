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