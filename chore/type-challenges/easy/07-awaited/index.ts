// infer 只能在条件类型里面使用，相当于设了个变量，后续可以取该变量的值

// 1.限制了 T 只能为 Promise 类型，通过了 2 个 case
// type MyAwaited<T> = T extends Promise<infer X> ? X : never; 限制

// 2.解决嵌套 Promise，此时 case 都通过了
// 但是类型声明有问题，Type 'X' does not satisfy the constraint 'Promise<unknown>'
// - 例如 MyAwaited<Promise<string>> 此时 T extends Promise<infer X> 为 true，
// - 则递归 MyAwaited<X> ，但 MyAwaited 约束该泛型为 T extends Promise<unknown>，而此时该泛型是 string，所以有问题
// type MyAwaited<T extends Promise<unknown>> = T extends Promise<infer X>
//   ? MyAwaited<X>
//   : T;

// 加上判断条件
// type MyAwaited<T extends Promise<unknown>> = T extends Promise<infer X>
//   ? X extends Promise<unknown>
//     ? MyAwaited<X>
//     : X
//   : T;

// 因为永远不会走到最后的 case 即 T，所以可以设置为 never
type MyAwaited<T extends Promise<unknown>> = T extends Promise<infer X>
  ? X extends Promise<unknown>
    ? MyAwaited<X>
    : X
  : never;
