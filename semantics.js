const AST = require('./ast.js');
const ArithmeticSemantics = require('./arithmeticSemantic');

module.exports.generate = function (semantics) {
    var ASTBuilder = semantics.addOperation('resolve', {

        Program: body => new AST.Body(body.resolve()),

        Assignment_full: function (type, variable, _1, value, _2) {
            return new AST.Assignment(type.sourceString, variable.resolve(), value.resolve())
        },
        Assignment_withoutType: function(variable, _1, value, _2) { 
            return new AST.Assignment(null, variable.resolve(), value.resolve()) 
        },
        Id: function (x) { 
            return new AST.SymbolClass(this.sourceString, null) 
        },
        
        Not: function(_, op) {
            return new AST.Op('not', op.resolve())
        },
        Increase: function(op, _) {
            return new AST.Op('increase', op.resolve())
        },

        Number: function(num) {
            return new AST.VariableClass("int", parseInt(num.sourceString))
        },
        String: function(quotes1, text, quotes2) {
            return new AST.VariableClass("string", text.sourceString)
        },
        Cypher: function(_1, value, _2) {
            return new AST.VariableClass("cypher", value.sourceString)
        },

        Brackets: function(_, values, __) {
            return values.resolve()
        },

        Body: function(_, body, _1) {
            return new AST.Body(body.resolve())
        },

        FunctionDefinition: function(name, _1, params, _2, _3, body) {
            return new AST.FunctionDef(name.resolve(), params.resolve(), body.resolve())
        },

        Return: function(_1, exprs, _2) {
            return new AST.Return(exprs.resolve())
        },

        Params: function(params) {
            return params.asIteration().resolve()
        },

        FunctionCall: function(name, _1, args, _2) {
            return new AST.FunctionCall(name.resolve(), args.resolve())
        },

        Arguments: function(args) {
            return args.asIteration().resolve()
        },

        If: function(_1, condition, _2, _3, thenBody, _4, elseBody) { 
            return new AST.IfStatement(condition.resolve(), thenBody.resolve(), elseBody ? elseBody.resolve()[0] : null) 
        },

        For: function(_1, _2, assignment, condition, _3, increment, _5, loopBody) {
            return new AST.ForLoop(assignment.resolve(), condition.resolve(), increment.resolve(), loopBody.resolve())
        },

        While: function(_1, condition, body) {
            return new AST.WhileLoop(condition.resolve(), body.resolve())
        },

        Bool: function(val) {
             return new AST.VariableClass("bool", val.sourceString)
        },
        ...ArithmeticSemantics.arithmeticSemantic
    });

    return {
        ASTBuilder: ASTBuilder
    };
};
