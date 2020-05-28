const AST = require('../ast/ast.js');

const arithmeticSemantic = {
    Add: function(left, _, right) {
        return new AST.Operation('+', left.resolve(), right.resolve())
    },
    Subtract: function(left, _, right){
        return new AST.Operation('-', left.resolve(), right.resolve())
    },
    Multiply: function(left, _, right){
        return new AST.Operation('*', left.resolve(), right.resolve())
    },
    Divide: function(left, _, right) {
        return new AST.Operation('/', left.resolve(), right.resolve())
    },
    Equal: function(left, _, right){
        return new AST.Operation('==', left.resolve(), right.resolve())
    },
    NotEqual: function(left, _, right){
        return new AST.Operation('!=', left.resolve(), right.resolve())
    },
    Greater: function(left, _, right){
        return new AST.Operation('>', left.resolve(), right.resolve())
    },
    LessThen: function(left, _, right) {
        return new AST.Operation('<', left.resolve(), right.resolve())
    },
    GreaterThenOrEqual: function(left, _, right) {
        return new AST.Operation('>=', left.resolve(), right.resolve())
    },
    LowerThenOrEqual: function(left, _, right) {
        return new AST.Operation('<=', left.resolve(), right.resolve())
    },

}

module.exports = {...arithmeticSemantic}