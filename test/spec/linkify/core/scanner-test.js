const scanner = require(`${__base}linkify/core/scanner`);
const TEXTTOKENS = require(`${__base}linkify/core/tokens`).text;

const DOMAIN = TEXTTOKENS.DOMAIN;
const AT = TEXTTOKENS.AT;
const COLON = TEXTTOKENS.COLON;
const DOT = TEXTTOKENS.DOT;
const PUNCTUATION = TEXTTOKENS.PUNCTUATION;
const LOCALHOST = TEXTTOKENS.LOCALHOST;
const NL = TEXTTOKENS.NL;
const NUM = TEXTTOKENS.NUM;
const PLUS = TEXTTOKENS.PLUS;
const POUND = TEXTTOKENS.POUND;
const PROTOCOL = TEXTTOKENS.PROTOCOL;
const QUERY = TEXTTOKENS.QUERY;
const SLASH = TEXTTOKENS.SLASH;
const SYM = TEXTTOKENS.SYM;
const TLD = TEXTTOKENS.TLD;
const WS = TEXTTOKENS.WS;
const OPENBRACE = TEXTTOKENS.OPENBRACE;
const OPENBRACKET = TEXTTOKENS.OPENBRACKET;
const OPENPAREN = TEXTTOKENS.OPENPAREN;
const CLOSEBRACE = TEXTTOKENS.CLOSEBRACE;
const CLOSEBRACKET = TEXTTOKENS.CLOSEBRACKET;
const CLOSEPAREN = TEXTTOKENS.CLOSEPAREN;

// The elements are
// 1. input string
// 2. Types for the resulting instances
// 3. String values for the resulting instances
const tests = [
	['', [], []],
	['@', [AT], ['@']],
	[':', [COLON], [':']],
	['.', [DOT], ['.']],
	['-', [SYM], ['-']],
	['\n', [NL], ['\n']],
	['+', [PLUS], ['+']],
	['#', [POUND], ['#']],
	['/', [SLASH], ['/']],
	['&', [SYM], ['&']],
	['&?<>(', [SYM, QUERY, SYM, SYM, OPENPAREN], ['&', '?', '<', '>', '(']],
	['([{}])', [OPENPAREN, OPENBRACKET, OPENBRACE, CLOSEBRACE, CLOSEBRACKET, CLOSEPAREN], ['(', '[', '{', '}', ']', ')']],
	['!,;', [PUNCTUATION, PUNCTUATION, PUNCTUATION], ['!', ',', ';']],
	['hello', [DOMAIN], ['hello']],
	['Hello123', [DOMAIN], ['Hello123']],
	['hello123world', [DOMAIN], ['hello123world']],
	['0123', [NUM], ['0123']],
	['123abc', [DOMAIN], ['123abc']],
	['http', [DOMAIN], ['http']],
	['http:', [PROTOCOL], ['http:']],
	['https:', [PROTOCOL], ['https:']],
	['files:', [DOMAIN, COLON], ['files', ':']],
	['file//', [DOMAIN, SLASH, SLASH], ['file', '/', '/']],
	['ftp://', [PROTOCOL, SLASH, SLASH], ['ftp:', '/', '/']],
	['c', [DOMAIN], ['c']],
	['co', [TLD], ['co']],
	['com', [TLD], ['com']],
	['comm', [DOMAIN], ['comm']],
	['abc 123  DoReMi', [DOMAIN, WS, NUM, WS, DOMAIN], ['abc', ' ',  '123', '  ', 'DoReMi']],
	['abc 123 \n  DoReMi', [DOMAIN, WS, NUM, WS, NL, WS, DOMAIN], ['abc', ' ',  '123', ' ', '\n', '  ', 'DoReMi']],
	['local', [TLD], ['local']],
	['localhost', [LOCALHOST], ['localhost']],
	['localhosts', [DOMAIN], ['localhosts']],
	['500px', [DOMAIN], ['500px']],
	['500-px', [DOMAIN], ['500-px']],
	['-500px', [SYM, DOMAIN], ['-', '500px']],
	['500px-', [DOMAIN, SYM], ['500px', '-']],
	['123-456', [DOMAIN], ['123-456']],
	[
		'Direniş İzleme Grubu\'nun',
		[DOMAIN, SYM, WS, SYM, DOMAIN, WS, DOMAIN, SYM, DOMAIN],
		['Direni', 'ş', ' ', 'İ', 'zleme', ' ', 'Grubu', '\'', 'nun']
	]
];

describe('linkify/core/scanner#run()', () => {
	function makeTest(test) {
		return it('Tokenizes the string "' + test[0] + '"', () => {
			var str = test[0];
			var types = test[1];
			var values = test[2];
			var result = scanner.run(str);

			expect(result.map((token) => token.toString())).to.eql(values);
			expect(result.map((token) => token.constructor)).to.eql(types);
		});
	}

	tests.map(makeTest, this);

});
