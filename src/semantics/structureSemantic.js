const AST = require('../ast/ast.js');

const structureSemantic = {
    If: function(_1, condition, _2, _3, thenBody, _4, elseBody) { 
        return new AST.IfStatement(condition.resolve(), thenBody.resolve(), elseBody ? elseBody.resolve()[0] : null) 
    },

    For: function(_1, _2, assignment, condition, _3, increment, _5, loopBody) {
        return new AST.ForLoop(assignment.resolve(), condition.resolve(), increment.resolve(), loopBody.resolve())
    },

    While: function(_1, condition, body) {
        return new AST.WhileLoop(condition.resolve(), body.resolve())
    },
    FunctionDefinition: function(name, _1, params, _2, _3, body) {
        return new AST.FunctionDef(name.resolve(), params.resolve(), body.resolve())
    },
    FunctionCall: function(name, _1, args, _2) {
        return new AST.FunctionCall(name.resolve(), args.resolve())
    },
}

module.exports = {...structureSemantic}