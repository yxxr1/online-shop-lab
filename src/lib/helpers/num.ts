// нужно чтобы убрать погрешность от операций с плавающей запятой
export const numToFixed = (num: number) => +num.toFixed(2);
