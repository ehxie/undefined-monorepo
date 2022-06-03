// 非严格模式：undefined 和 null 是所有类型的子类型
const a: boolean = null;
// 有关严格模式
// - https://juejin.cn/post/6896680181000634376
// - https://www.typescriptlang.org/docs/handbook/type-compatibility.html

// 以下类型得在严格模式下才会生效
type If<C extends boolean, T, F> = C extends true ? T : F;
