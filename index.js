var ohm = require('ohm-js');    		// core - ohm js library
var fs  = require('fs');        		// used for file reading
var ast = require('./ast.js')		// ast modules
var smn = require('./semantics')	// semantics

var Scope 	= ast.Scope;		// scope
var Symbol 	= ast.SymbolClass; 	// symbols of global scope
var Number 	= ast.NumberClass; 	// original values

// Read grammar file and create grammar
var grammar = ohm.grammar(
    fs.readFileSync('./grammar.ohm').toString()
);

// Creating semantics
var semantics  = grammar.createSemantics();
var astBuilder = smn.generate(semantics).TreeBuilder;


// Creating a tree from a file
let filename = process.argv.slice(2).toString();
let matchResult = grammar.match(
    fs.readFileSync(filename).toString()
);

// Grammar match failed, stoping program...
if (matchResult.failed()) {
    return console.log("Failed to match " + filename + "\n" +  matchResult.message);
}

var tree = astBuilder(matchResult).toTree();

// Global scope
let globalScope = new Scope(null);

globalScope.setSymbol(new Symbol("log"), function (arg) {
    console.log(arg.value);
    return arg;
});

globalScope.setSymbol(new Symbol("logLine"), function (arg) {
    console.log("\n" + arg.value);
    return arg;
});

globalScope.setSymbol(new Symbol("toInt"), function (...arg) {
    var x = arg.map(o => o['value']);
    var int = parseInt(x);
    return new Number(int);
});

globalScope.setSymbol(new Symbol("toString"), function (...arg) {
    var x = arg.map(o => o['value']);
    return new Number(x.toString());
});

globalScope.setSymbol(new Symbol("toDouble"), function (...arg) {
    var x = arg.map(o => o['value']);
    return new Number(x.toString());
});

// Resolving global scope
tree.resolve(globalScope);