const ohm = require('ohm-js');
const fs  = require('fs');
const semantic = require('./src/semantics/semantics');
const systemicFunctions = require('./src/systemicFunctions');

const grammar = ohm.grammar(
    fs.readFileSync('./src/grammar/grammar.ohm').toString()
);

const semantics  = grammar.createSemantics();
const astBuilder = semantic.generate(semantics).ASTBuilder;

const filename = process.argv.slice(2).toString();
const matchResult = grammar.match(
    fs.readFileSync(filename).toString()
);

const tree = astBuilder(matchResult).resolve();

tree.resolve(systemicFunctions.globalScope);