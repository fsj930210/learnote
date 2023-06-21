// 类型映射
// 因为索引类型（对象、class 等）可以用 string、number 和 symbol 作为 key，
// 这里 keyof T 取出的索引就是 string | number | symbol 的联合类型，和 string 取交叉部分就只剩下 string 了。
// 交叉类型会把同一类型做合并，不同类型舍弃。
type MapType<T> = {
  [
  Key in keyof T
  as `${Key & string}${Key & string}${Key & string}`
  ]: [T[Key], T[Key], T[Key]]
}

type MapTypeResult = MapType<{ a: 1, b: 2 }>;