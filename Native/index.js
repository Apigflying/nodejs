const sleep = async (t, fn) => {
  await fn(t);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('sleep 执行了');
      resolve({
        value: 'Sleep 返回的结果',
      });
    }, t);
  });
};

const a = (delay) => () =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log('a 执行了');
      resolve({
        value: 'A 返回的结果',
      });
    }, delay);
  });

const fun = async () => {
  const time = 5000;
  const adelay = 3000;
  await sleep(time - adelay, a(adelay));
};

fun();
