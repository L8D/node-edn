var test = require('tape');
var edn = require('../');

test('lexer', function(assert) {
  assert.plan(11);

  assert.same(edn.lex('\n, \t'), [], 'lex whitespace');

  assert.same(edn.lex('nil true false'), [
    {type: 'nil'},
    {type: 'boolean', value: true},
    {type: 'boolean', value: false},
  ], 'lex basic literals');

  assert.same(edn.lex('"foo \\"bar\\" baz"'), [
    {type: 'string', value: 'foo "bar" baz'}
  ], 'lex strings');

  assert.same(edn.lex('\\c \\space'), [
    {type: 'character', value: 'c'},
    {type: 'character', value: 'space'}
  ], 'lex characters');

  assert.same(edn.lex('foo'), [
    {type: 'symbol', value: 'foo'}
  ], 'lex symbol');

  assert.same(edn.lex(':foo'), [
    {type: 'keyword', value: 'foo'}
  ], 'lex keywords');

  assert.same(edn.lex('123'), [
    {type: 'number', value: 123}
  ], 'lex numbers');

  assert.same(edn.lex('(a b 42)'), [{
    type: 'list',
    value: [
      {type: 'symbol', value: 'a'},
      {type: 'symbol', value: 'b'},
      {type: 'number', value: 42}
    ]
  }], 'lex lists');

  assert.same(edn.lex('[a b 42]'), [{
    type: 'vector',
    value: [
      {type: 'symbol', value: 'a'},
      {type: 'symbol', value: 'b'},
      {type: 'number', value: 42}
    ]
  }], 'lex vectors');

  assert.same(edn.lex('{:a 1, "foo" :bar, [3] four}'), [{
    type: 'map',
    value: [{
      key: {type: 'keyword', value: 'a'},
      value: {type: 'number', value: 1}
    }, {
      key: {type: 'string', value: 'foo'},
      value: {type: 'keyword', value: 'bar'}
    }, {
      key: {
        type: 'vector',
        value: [{type: 'number', value: 3}]
      },
      value: {type: 'symbol', value: 'four'}
    }]
  }], 'lex maps');

  assert.same(edn.lex('#{a b 42}'), [{
    type: 'set',
    value: [
      {type: 'symbol', value: 'a'},
      {type: 'symbol', value: 'b'},
      {type: 'number', value: 42}
    ]
  }], 'lex sets');
});
