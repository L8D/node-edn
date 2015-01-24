/* I'm not that great with Bison... */

%lex

fsym [a-zA-Z\.*+\!\-?$%&=<>]
bsym [0-9a-zA-Z\.*+\!\-?$%&=<>:#]
symbol {fsym}{bsym}*(/{bysm}+)?
number [+-]?(([1-9][0-9]*\.?[0-9]*)|(\.[0-9]+))([Ee][+-]?[0-9]+)?

%%

\"(\\?.)*\"       return 'STRING';
[,\s]+            /* skip */
\\\w+             return 'CHARACTER';
"("               return '(';
")"               return ')';
"["               return '[';
"]"               return ']';
"#{"              return '#{';
"{"               return '{';
"}"               return '}';
"true"            return 'TRUE';
"false"           return 'FALSE';
"nil"             return 'NIL';
{number}          return 'NUMBER';
[+-]?(0|[1-9])\d* return 'INTEGER';
\:{symbol}        return 'KEYWORD';
{symbol}          return 'SYMBOL';
"/"               return 'SYMBOL';
<<EOF>>           return 'EOF';

/lex

%start body

%%

body
    : EOF {return [];}
    | elements EOF
    {return $1;}
    ;

elements
    : element {$$ = [$1];}
    | elements element {$$ = $1.concat([$2]);}
    ;

list
    : '(' ')' {$$ = {type: 'list', value: []};}
    | '(' elements ')' {$$ = {type: 'list', value: $2};}
    ;

vector
    : '[' ']' {$$ = {type: 'vector', value: []};}
    | '[' elements ']' {$$ = {type: 'vector', value: $2};}
    ;

set
    : '#{' '}' {$$ = {type: 'set', value: []};}
    | '#{' elements '}' {$$ = {type: 'set', value: $2};}
    ;

pairs
    : element element {$$ = [{key: $1, value: $2}];}
    | pairs element element {$$ = $1.concat([{key: $2, value: $3}]);}
    ;

map
    : '{' '}' {$$ = {type: 'map', value: []};}
    | '{' pairs '}' {$$ = {type: 'map', value: $2};}
    ;

literal
    : STRING {$$ = {type: 'string', value: JSON.parse($1)};}
    | CHARACTER {$$ = {type: 'character', value: $1.slice(1)};}
    | TRUE {$$ = {type: 'boolean', value: true};}
    | FALSE {$$ = {type: 'boolean', value: false};}
    | NIL {$$ = {type: 'nil'};}
    | NUMBER {$$ = {type: 'number', value: Number($1)};}
    | KEYWORD {$$ = {type: 'keyword', value: $1.slice(1)};}
    | SYMBOL {$$ = {type: 'symbol', value: $1};}
    ;

element
    : '#' SYMBOL element
    | literal
    | list
    | vector
    | map
    | set
    ;
