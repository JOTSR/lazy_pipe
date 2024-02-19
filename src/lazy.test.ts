import {
	assertEquals,
	assertThrows,
} from 'https://deno.land/std@0.177.0/testing/asserts.ts'
import { Lazy } from './lazy.ts'

const callTrace: number[] = []
function callOrder(id: number) {
	callTrace.push(id)
	return function <T>(value: T): T {
		return value
	}
}

Deno.test({
	name: 'lazy chain evaluation',
	fn() {
		const array = [1, 2, 3, 4, 5]

		const value = array
			.map(callOrder(1))
			.toReversed()
			.toSorted()
			.reduce((acc, curr) => acc - curr, 0)

		const lazyValue = new Lazy(array)
			.pipe((self) => self.map(callOrder(3)))
			.pipe((self) => self.toReversed())
			.pipe((self) => self.toSorted())
			.pipe((self) => self.reduce((acc, curr) => acc - curr, 0))

		callOrder(2)
		assertEquals(
			lazyValue.value,
			value,
			'lazy evaluation result differs from synchronous call',
		)
		assertEquals(callTrace, [1, 2, 3], 'lazy call before accessing value')
	},
})

Deno.test({
	name: 'lazy chain iteration',
	fn() {
		const string = new Lazy([1, 2, 3])
			.pipe((self) => self.map((x) => 2 * x))
			.pipe((self) => self.join(', '))
			.pipe((self) => self.includes('4'))

		const steps = [
			[2, 4, 6],
			'2, 4, 6',
			true,
		]

		for (const step of string.iterate()) {
			assertEquals([step], steps.splice(0, 1))
		}
	},
})

Deno.test({
	name: 'lazy consumed once',
	fn() {
		const value = new Lazy('value').pipe((self) => self.toUpperCase())

		assertEquals(value.value, 'VALUE')
		assertThrows(() => value.value)

		const value2 = new Lazy('value2').pipe((self) => self.toUpperCase())
		assertEquals(Array.from(value2.iterate()), ['VALUE2'])
		assertThrows(() => Array.from(value2.iterate()))
	},
})
