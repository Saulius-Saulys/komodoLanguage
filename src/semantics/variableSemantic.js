const AST = require('../ast/ast.js');

const variableSemantic = {
    Number: function(num) {
        return new AST.VariableClass("int", parseInt(num.sourceString))
    },
    String: function(quotes1, text, quotes2) {
        return new AST.VariableClass("string", text.sourceString)
    },
    Cypher: function(_1, value, _2) {
        return new AST.VariableClass("cypher", value.sourceString)
    },
    Bool: function(val) {
        return new AST.VariableClass("bool", val.sourceString)
   },
}

module.exports = {...variableSemantic}