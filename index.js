var parser = require('./parser');

exports.lex = function(str) {
  return parser.parse(str);
}
