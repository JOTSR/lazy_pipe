# LazyPipe - lazy evaluator pipeline

Simple lazy evaluation of value piping. Create the logic before and compute the
value only when needed.

```ts
const lazyValue = new Lazy(veryBigArray)
	.pipe((self) => self.map((x) => 2 * x))
	.pipe((self) => self.toReversed())
	.pipe((self) => self.toSorted())
	.pipe((self) => self.reduce((acc, curr) => acc - curr, 0))

if (rareCondition) {
	console.log(lazyValue.value)
}
```
