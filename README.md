# LazyPipe - lazy evaluator pipeline

[![Tags](https://img.shields.io/github/v/tag/JOTSR/lazy_pipe?style=flat-square&label=jsr)](https://jsr.io/@jotsr/lazy-pipe)
[![deno doc](https://img.shields.io/badge/deno-doc-blue?style=flat-square)](https://jsr.io/@jotsr/lazy-pipe/doc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Simple lazy evaluation of value piping. Create the logic before and compute the
value only when needed.

# Examples

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
