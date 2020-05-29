const AST = require('./ast/ast.js');
const CryptoJS = require('crypto-js');
const fs = require('fs');

const Context = AST.Context;
const Symbol = AST.SymbolClass;
const VariableClass = AST.VariableClass

const decrypt = (value) => CryptoJS.enc.Base64.parse(value).toString(CryptoJS.enc.Utf8);
const globalContext = new Context(null);

globalContext.setSymbol(new Symbol("log"), function (arg) {
    console.log(arg.value);
    return arg;
});

globalContext.setSymbol(new Symbol("logLine"), function (arg) {
    console.log("\n" + arg.value);
    return arg;
});

globalContext.setSymbol(new Symbol("toInt"), function (x) {
    var tryParse = parseInt(x.value);
    if(isNaN(tryParse)){
        throw new Error("Unable to parse to int");
    }
    return new VariableClass("int", tryParse);
});

globalContext.setSymbol(new Symbol("toString"), function (x) {
    return new VariableClass("string", x.value.toString());
});

globalContext.setSymbol(new Symbol("toDouble"), function (x) {
    var tryParse = parseFloat(x.value);
    if(isNaN(tryParse)){
        throw new Error("Unable to parse to double");
    }
    return new VariableClass("double", tryParse);
   
});

globalContext.setSymbol(new Symbol("decrypt"), function (x) {
    return new VariableClass("cypher_Decrypt", decrypt(x.value));
});

globalContext.setSymbol(new Symbol("writeFile"), function (x, filePath) {
    fs.writeFile(filePath.value, x.value, function (err) {
        new Error("failed to append");
    });
});

globalContext.setSymbol(new Symbol("appendFile"), function (x, filePath) {
    fs.appendFile(filePath.value, x.value + "\n", function (err) {
        new Error("failed to append");
    });
});

module.exports={globalContext}