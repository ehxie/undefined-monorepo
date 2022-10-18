function withHookBefore(originFn, hookFn) {
  return function (...args) {
    if (hookFn.apply(this, args)) {
      return;
    }
    return originFn.apply(this, args);
  };
}

const originLog = console.log;
console.log = withHookBefore(originLog, () => {
  originLog('插桩代码');
  // return true; // 取消掉注释就不会有原来的输出了
});
