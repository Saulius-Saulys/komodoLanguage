const ohm = require('ohm-js');
const fs  = require('fs');
const AST = require('./ast.js');
const semantic = require('./semantics');
const CryptoJS = require('crypto-js');

const decrypt = (value) => CryptoJS.enc.Base64.parse(value).toString(CryptoJS.enc.Utf8);

const Scope = AST.Scope;
const Symbol = AST.SymbolClass;
const VariableClass = AST.VariableClass

const grammar = ohm.grammar(
    fs.readFileSync('./grammar.ohm').toString()
);

const semantics  = grammar.createSemantics();
const astBuilder = semantic.generate(semantics).ASTBuilder;

const filename = process.argv.slice(2).toString();
const matchResult = grammar.match(
    fs.readFileSync(filename).toString()
);

const tree = astBuilder(matchResult).resolve();

const globalScope = new Scope(null);

globalScope.setSymbol(new Symbol("log"), function (arg) {
    console.log(arg.value);
    return arg;
});

globalScope.setSymbol(new Symbol("logLine"), function (arg) {
    console.log("\n" + arg.value);
    return arg;
});

globalScope.setSymbol(new Symbol("toInt"), function (x) {
    var tryParse = parseInt(x.value);
    if(isNaN(tryParse)){
        throw new Error("Unable to parse to int");
    }
    return new VariableClass("int", tryParse);
});

globalScope.setSymbol(new Symbol("toString"), function (x) {
    return new VariableClass("string", x.value.toString());
});

globalScope.setSymbol(new Symbol("toDouble"), function (x) {
    var tryParse = parseFloat(x.value);
    if(isNaN(tryParse)){
        throw new Error("Unable to parse to double");
    }
    return new VariableClass("double", tryParse);
   
});

globalScope.setSymbol(new Symbol("decrypt"), function (x) {
    return new VariableClass("cypher_Decrypt", decrypt(x.value));
});

tree.resolve(globalScope);