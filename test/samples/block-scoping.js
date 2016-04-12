module.exports = [
	{
		description: 'transpiles let',
		input: `let x = 'y';`,
		output: `var x = 'y';`
	},

	{
		description: 'deconflicts blocks in top-level scope',

		input: `
			if ( a ) {
				let x = 1;
				console.log( x );
			} else if ( b ) {
				let x = 2;
				console.log( x );
			} else {
				let x = 3;
				console.log( x );
			}`,

		output: `
			if ( a ) {
				var x = 1;
				console.log( x );
			} else if ( b ) {
				var x$1 = 2;
				console.log( x$1 );
			} else {
				var x$2 = 3;
				console.log( x$2 );
			}`
	},

	{
		description: 'deconflicts blocks in same function scope',

		input: `
			var x = 'y';
			function foo () {
				if ( a ) {
					let x = 1;
					console.log( x );
				} else if ( b ) {
					let x = 2;
					console.log( x );
				} else {
					let x = 3;
					console.log( x );
				}
			}`,

		output: `
			var x = 'y';
			function foo () {
				if ( a ) {
					var x = 1;
					console.log( x );
				} else if ( b ) {
					var x$1 = 2;
					console.log( x$1 );
				} else {
					var x$2 = 3;
					console.log( x$2 );
				}
			}`
	},

	{
		description: 'transpiles block scoping inside loops with function bodies',

		input: `
			function log ( square ) {
				console.log( square );
			}

			for ( let i = 0; i < 10; i += 1 ) {
				const square = i * i;
				setTimeout( function () {
					log( square );
				}, i * 100 );
			}`,

		output: `
			function log ( square ) {
				console.log( square );
			}

			var forLoop = function ( i ) {
				var square = i * i;
				setTimeout( function () {
					log( square );
				}, i * 100 );
			};

			for ( var i = 0; i < 10; i += 1 ) forLoop( i );`
	},

	{
		description: 'transpiles block-less for loops with block-scoped declarations inside function body',

		input: `
			for ( let i = 0; i < 10; i += 1 ) setTimeout( () => console.log( i ), i * 100 );`,

		output: `
			var forLoop = function ( i ) {
				setTimeout( function () { return console.log( i ); }, i * 100 );
			};

			for ( var i = 0; i < 10; i += 1 ) forLoop( i );`
	},

	{
		description: 'transpiles block scoping inside loops without function bodies',

		input: `
			for ( let i = 0; i < 10; i += 1 ) {
				const square = i * i;
				console.log( square );
			}`,

		output: `
			for ( var i = 0; i < 10; i += 1 ) {
				var square = i * i;
				console.log( square );
			}`
	},

	{
		description: 'transpiles block-less for loops without block-scoped declarations inside function body',

		input: `
			for ( let i = 0; i < 10; i += 1 ) console.log( i );`,

		output: `
			for ( var i = 0; i < 10; i += 1 ) console.log( i );`
	},

	{
		description: 'disallows duplicate declarations',
		input: `
			let x = 1;
			let x = 2;
		`,
		error: /x is already declared/
	},

	{
		description: 'disallows reassignment to constants',
		input: `
			const x = 1;
			x = 2;
		`,
		error: /x is read-only/
	},

	{
		description: 'disallows updates to constants',
		input: `
			const x = 1;
			x++;
		`,
		error: /x is read-only/
	},

	{
		description: 'does not rewrite properties',

		input: `
			var foo = 'x';
			if ( true ) {
				let foo = 'y';
				this.foo = 'z';
				this[ foo ] = 'q';
			}`,

		output: `
			var foo = 'x';
			if ( true ) {
				var foo$1 = 'y';
				this.foo = 'z';
				this[ foo$1 ] = 'q';
			}`
	},

	{
		description: 'deconflicts with default imports',

		input: `
			import foo from './foo.js';

			if ( x ) {
				let foo = 'y';
				console.log( foo );
			}`,

		output: `
			import foo from './foo.js';

			if ( x ) {
				var foo$1 = 'y';
				console.log( foo$1 );
			}`
	},

	{
		description: 'deconflicts with named imports',

		input: `
			import { foo } from './foo.js';

			if ( x ) {
				let foo = 'y';
				console.log( foo );
			}`,

		output: `
			import { foo } from './foo.js';

			if ( x ) {
				var foo$1 = 'y';
				console.log( foo$1 );
			}`
	},

	{
		description: 'deconflicts with function declarations',

		input: `
			function foo () {}

			if ( x ) {
				let foo = 'y';
				console.log( foo );
			}`,

		output: `
			function foo () {}

			if ( x ) {
				var foo$1 = 'y';
				console.log( foo$1 );
			}`
	},

	{
		description: 'does not deconflict with function expressions',

		input: `
			var bar = function foo () {};

			if ( x ) {
				let foo = 'y';
				console.log( foo );
			}`,

		output: `
			var bar = function foo () {};

			if ( x ) {
				var foo = 'y';
				console.log( foo );
			}`
	},

	{
		description: 'deconflicts with function expression inside function body',

		input: `
			var bar = function foo () {
				if ( x ) {
					let foo = 'y';
					console.log( foo );
				}
			};`,

		output: `
			var bar = function foo () {
				if ( x ) {
					var foo$1 = 'y';
					console.log( foo$1 );
				}
			};`
	},

	{
		description: 'deconflicts with parameters',

		input: `
			function bar ( foo ) {
				if ( x ) {
					let foo = 'y';
					console.log( foo );
				}
			}`,

		output: `
			function bar ( foo ) {
				if ( x ) {
					var foo$1 = 'y';
					console.log( foo$1 );
				}
			}`
	},

	{
		description: 'deconflicts with class declarations',

		input: `
			class foo {}

			if ( x ) {
				let foo = 'y';
				console.log( foo );
			}`,

		output: `
			var foo = function foo () {};

			if ( x ) {
				var foo$1 = 'y';
				console.log( foo$1 );
			}`
	},

	{
		description: 'does not deconflict with class expressions',

		input: `
			var bar = class foo {};

			if ( x ) {
				let foo = 'y';
				console.log( foo );
			}`,

		output: `
			var bar = (function () {
				function foo () {}

				return foo;
			}());

			if ( x ) {
				var foo = 'y';
				console.log( foo );
			}`
	},

	{
		description: 'deconflicts across multiple function boundaries',

		input: `
			function foo ( x ) {
				return function () {
					if ( true ) {
						const x = 'y';
						console.log( x );
					}

					console.log( x );
				};
			}`,

		output: `
			function foo ( x ) {
				return function () {
					if ( true ) {
						var x$1 = 'y';
						console.log( x$1 );
					}

					console.log( x );
				};
			}`
	},

	{
		description: 'does not deconflict unnecessarily',

		input: `
			function foo ( x ) {
				return function () {
					if ( true ) {
						const x = 'y';
						console.log( x );
					}
				};
			}`,

		output: `
			function foo ( x ) {
				return function () {
					if ( true ) {
						var x = 'y';
						console.log( x );
					}
				};
			}`
	},

	{
		description: 'deconflicts object pattern declarations',

		input: `
			let x;

			if ( true ) {
				let { x, y } = point;
				console.log( x );
			}`,

		output: `
			var x;

			if ( true ) {
				var x$1 = point.x, y = point.y;
				console.log( x$1 );
			}`
	},

	{
		description: 'deconflicts array pattern declarations',

		input: `
			let x;

			if ( true ) {
				let [ x, y ] = point;
				console.log( x );
			}`,

		output: `
			var x;

			if ( true ) {
				var x$1 = point[0], y = point[1];
				console.log( x$1 );
			}`
	},

	{
		skip: true,
		description: 'deconflicts rest element declarations',

		input: `
			let x;

			if ( true ) {
				let [ first, second, ...x ] = y;
				console.log( x );
			}`,

		output: `
			var x;

			if ( true ) {
				var first = y[0], second = y[1], x$1 = y.slice( 2 );
				console.log( x$1 );
			}`
	}
];
