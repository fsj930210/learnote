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