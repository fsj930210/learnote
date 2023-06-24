type BuildArr<Length extends number, El = unknown, Result extends unknown[] = []> = Result['length'] extends Length
	? Result
	: BuildArr<Length, El, [...Result, El]>;

// add
type Add<Num1 extends number, Num2 extends number> = [
	...BuildArr<Num1, unknown, []>,
	...BuildArr<Num2, unknown, []>
]['length'];
type AddResult = Add<3, 5>;

// subtract
type Subtract<Num1 extends number, Num2 extends number> = BuildArr<Num1> extends [...BuildArr<Num2>, ...infer Rest]
	? Rest['length']
	: never;
type SubtractResult = Subtract<5, 3>;

// Multiply
type Multiply<Num1 extends number, Num2 extends number, Result extends unknown[] = []> = Num2 extends 0
	? Result['length']
	: Multiply<Num1, Subtract<Num2, 1>, [...BuildArr<Num1>, ...Result]>;
type MultiplyResult = Multiply<5, 3>;

// Divide
type Divide<Num1 extends number, Num2 extends number, CountArr extends unknown[] = []> = Num1 extends 0
	? CountArr['length']
	: Divide<Subtract<Num1, Num2>, Num2, [unknown, ...CountArr]>;
type DivideResult = Divide<8, 2>;

// StringLength
type StringLength<Str extends string, CountArr extends unknown[] = []> = Str extends `${string}${infer Rest}`
	? StringLength<Rest, [unknown, ...CountArr]>
	: CountArr['length'];
type StringLengthResult = StringLength<'hello world'>;

// GreaterThan
type GreaterThan<Num1 extends number, Num2 extends number, CountArr extends unknown[] = []> = Num1 extends Num2
	? false
	: CountArr['length'] extends Num2
	? true
	: CountArr['length'] extends Num1
	? false
	: GreaterThan<Num1, Num2, [unknown, ...CountArr]>;
type GreaterThanResult = GreaterThan<2, 1>;

// Fibonacci
type FibonacciLoop<
	PrevArr extends unknown[],
	CurrArr extends unknown[],
	IndexArr extends unknown[] = [],
	Num extends number = 1
> = IndexArr['length'] extends Num
	? CurrArr['length']
	: FibonacciLoop<CurrArr, [...PrevArr, ...CurrArr], [...IndexArr, unknown], Num>;

type Fibonacci<Num extends number> = FibonacciLoop<[1], [], [], Num>;
type FibonacciResult = Fibonacci<3>;
