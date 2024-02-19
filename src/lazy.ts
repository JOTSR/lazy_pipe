type Callable<T, U> = (self: T) => U

export class Lazy<Args> {
	#ref: Args
	#chain: Callable<Args, unknown>[] = []

	#consumed = false

	/**
	 * Convert a value to a lazy evaluable value.
	 * @param {Args} ref - Any value to lazyfy.
	 * ```ts
	 * const lazyValue = new Lazy([1, 2, 3])
	 *     .pipe(self => self.map(x => 2 * x))
	 *     .pipe(self => self.join(', '))
	 *     .pipe(self => self.includes('4'))
	 *
	 * if (Math.random() < 0.5) {
	 *     console.log(lazyValue.value)
	 * }
	 * ```
	 */
	constructor(ref: Args) {
		this.#ref = ref
	}

	/**
	 * Convert a value to a lazy evaluable value.
	 * @param {Args} ref - Any value.
	 * @returns A new instance of Lazy.
	 * ```ts
	 * const lazyValues = array.map(Lazy.from)
	 * ```
	 */
	static from<Args>(ref: Args) {
		return new Lazy<Args>(ref)
	}

	/**
	 * It takes a function as an argument, and returns a new Lazy object with the function added to the call
	 * chain.
	 * @param callable - The function to be called.
	 * @returns Extended lazy value.
	 * ```ts
	 * const lazyValue = new Lazy(array)
	 *     .pipe(self => self.map(x => x * 3))
	 *     .pipe(self => self.toReversed())
	 *     .pipe(self => self.toSorted())
	 *     .pipe(self => self.reduce((acc, curr) => acc - curr, 0))
	 *     .value
	 * ```
	 */
	pipe<Return>(callable: Callable<Args, Return>): Lazy<Return> {
		this.#chain.push(callable)
		return this as unknown as Lazy<Return>
	}

	/**
	 * It iterates over the chain of callables, yielding the result of each callable applied to the
	 * previous result.
	 * The lazy value is consumed at the end of the iteration.
	 * ```ts
	 * const lazyString = new Lazy('lazy')
	 *     .pipe(self => self.toUpperCase())
	 * 	   .pipe(self => self.split(''))
	 *
	 * for (const step of lazyString.iterate()) {
	 *     console.log(step) //"LAZY" then ["L", "A", "Z", "Y"]
	 * }
	 * ```
	 */
	*iterate() {
		if (this.#consumed) throw new Error('Value already consumed')

		for (const callable of this.#chain) {
			//@ts-ignore chain cast
			this.#ref = callable(this.#ref)
			yield this.#ref
		}

		this.#consumed = true
	}

	/**
	 * Consume and return the value of the lazy chain.
	 * @returns Lazy computed value.
	 * ```ts
	 * const mappedArray = new Lazy([1, 2, 3]).pipe(self => self.map(x => 2 * x)).value
	 * ```
	 */
	get value(): Args {
		return Array.from(this.iterate()).reduce((_, curr) => curr)
	}
}
