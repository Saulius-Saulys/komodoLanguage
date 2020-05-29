const AST = require('../ast/ast.js');
const arithmeticSemantics = require('./arithmeticSemantic');
const variableSemantics = require('./variableSemantic');
const structureSemantics = require('./structureSemantic');

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

        Brackets: function(_, values, __) {
            return values.resolve()
        },

        Body: function(_, body, _1) {
            return new AST.Body(body.resolve())
        },

        Return: function(_1, exprs, _2) {
            return new AST.Return(exprs.resolve())
        },

        Params: function(params) {
            return params.asIteration().resolve()
        },

        Arguments: function(args) {
            return args.asIteration().resolve()
        },
        ...structureSemantics,
        ...arithmeticSemantics,
        ...variableSemantics
    });

    return {
        ASTBuilder: ASTBuilder
    };
};
