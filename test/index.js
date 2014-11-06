var assert = require('assert');
var edn = require('../');

describe('should lexer', function() {
  it('should lex whitespace', function() {
    assert.deepEqual(edn.lex('\n, \t'), []);
  });

  it('should lex basic literals', function() {
    assert.deepEqual(edn.lex('nil true false'), [
      {type: 'nil'},
      {type: 'boolean', value: true},
      {type: 'boolean', value: false},
    ]);
  });

  it('should lex strings', function() {
    assert.deepEqual(edn.lex('"foo \\"bar\\" baz"'), [
      {type: 'string', value: 'foo "bar" baz'}
    ]);
  });

  it('should lex characters', function() {
    assert.deepEqual(edn.lex('\\c \\space'), [
      {type: 'character', value: 'c'},
      {type: 'character', value: 'space'}
    ]);
  });

  it('should lex symbols', function() {
    assert.deepEqual(edn.lex('foo'), [
      {type: 'symbol', value: 'foo'}
    ]);
  });

  it('should lex keywords', function() {
    assert.deepEqual(edn.lex(':foo'), [
      {type: 'keyword', value: 'foo'}
    ]);
  });

  it('should lex numbers', function() {
    assert.deepEqual(edn.lex('123'), [
      {type: 'number', value: 123}
    ]);
  });

  it('should lex lists', function() {
    assert.deepEqual(edn.lex('(a b 42)'), [{
      type: 'list',
      value: [
        {type: 'symbol', value: 'a'},
        {type: 'symbol', value: 'b'},
        {type: 'number', value: 42}
      ]
    }]);
  });

  it('should lex vectors', function() {
    assert.deepEqual(edn.lex('[a b 42]'), [{
      type: 'vector',
      value: [
        {type: 'symbol', value: 'a'},
        {type: 'symbol', value: 'b'},
        {type: 'number', value: 42}
      ]
    }]);
  });

  it('should lex maps', function() {
    assert.deepEqual(edn.lex('{:a 1, "foo" :bar, [3] four}'), [{
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
    }]);
  });

  it('should lex sets', function() {
    assert.deepEqual(edn.lex('#{a b 42}'), [{
      type: 'set',
      value: [
        {type: 'symbol', value: 'a'},
        {type: 'symbol', value: 'b'},
        {type: 'number', value: 42}
      ]
    }]);
  });
});
