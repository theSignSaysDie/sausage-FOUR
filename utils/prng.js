/* eslint-disable no-inline-comments */
// From http://baagoe.com/en/RandomMusings/javascript/

// From http://baagoe.com/en/RandomMusings/javascript/
// Johannes Baagøe <baagoe@baagoe.com>, 2010
function Mash() {
	let n = 0xefc8249d;

	const mash = function(data) {
		data = data.toString();
		for (let i = 0; i < data.length; i++) {
			n += data.charCodeAt(i);
			let h = 0.02519603282416938 * n;
			n = h >>> 0;
			h -= n;
			h *= n;
			n = h >>> 0;
			h -= n;
			n += h * 0x100000000; // 2^32
		}
		return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
	};

	mash.version = 'Mash 0.9';
	return mash;
}

function Kybos() {
	return (function(args) {
		// Johannes Baagøe <baagoe@baagoe.com>, 2010
		let c = 1;
		const s = [];
		let k = 0;

		const mash = Mash();
		let s0 = mash(' ');
		let s1 = mash(' ');
		let s2 = mash(' ');
		for (let j = 0; j < 8; j++) {
			s[j] = mash(' ');
		}

		if (args.length === 0) {
			args = [+new Date];
		}
		for (let i = 0; i < args.length; i++) {
			s0 -= mash(args[i]);
			if (s0 < 0) {
				s0 += 1;
			}
			s1 -= mash(args[i]);
			if (s1 < 0) {
				s1 += 1;
			}
			s2 -= mash(args[i]);
			if (s2 < 0) {
				s2 += 1;
			}
			for (let j = 0; j < 8; j++) {
				s[j] -= mash(args[i]);
				if (s[j] < 0) {
					s[j] += 1;
				}
			}
		}

		const random = function() {
			const a = 2091639;
			k = s[k] * 8 | 0;
			const r = s[k];
			const t = a * s0 + c * 2.3283064365386963e-10; // 2^-32
			s0 = s1;
			s1 = s2;
			s2 = t - (c = t | 0);
			s[k] -= s2;
			if (s[k] < 0) {
				s[k] += 1;
			}
			return r;
		};
		random.uint32 = function() {
			return random() * 0x100000000; // 2^32
		};
		random.fract53 = function() {
			return random() +
        (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
		};
		random.addNoise = function() {
			for (let i = arguments.length - 1; i >= 0; i--) {
				for (k = 0; k < 8; k++) {
					s[k] -= mash(arguments[i]);
					if (s[k] < 0) {
						s[k] += 1;
					}
				}
			}
		};
		random.version = 'Kybos 0.9';
		random.args = args;
		return random;

	} (Array.prototype.slice.call(arguments)));
}

module.exports = {
	RNG: Kybos,
};