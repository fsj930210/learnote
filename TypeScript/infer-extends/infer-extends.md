# infer extends
**infer 的时候加上 `extends` 来约束推导的类型，这样推导出的就不再是 `unknown` 了，而是约束的类型。**

`4.7`版本增加`infer extends` `4.8`版本如果是基础类型推导为字面量类型
```typescript
  // type Last<Arr extends string[]> =
  //   Arr extends [...infer rest, infer Ele]
  //   ? `最后一个是${Ele}`
  //   : never;
  // type LastResult = Last<['1','2','3']>;

  type Last<Arr extends string[]> =
    Arr extends [...infer rest, infer Ele extends string]
    ? `最后一个是${Ele}`
    : never;
  type LastResult = Last<['1', '2', '3']>;

  type NumInfer<Str> =
    Str extends `${infer Num extends number}`
    ? Num
    : never;
  type NumInferResult = NumInfer<'123'>
  enum Code {
    a = 111,
    b = 222,
    c = "abc"
  }
  type StrToNum<Str> =
    Str extends `${infer Num extends number}`
    ? Num
    : Str;
  type StrToNumResult = StrToNum<`${Code}`>;

  type StrToBoolean<Str> = 
  Str extends `${infer Bool extends boolean}`
  ? Bool
  : Str;

  type StrToBooleanResult = StrToBoolean<'true'>;

  type StrToNull<Str> =
    Str extends `${infer Null extends null}`
    ? Null
    : Str;

  type StrToNullResult = StrToNull<'null'>;
```