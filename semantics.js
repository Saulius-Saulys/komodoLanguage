var Tree = require('./ast.js');

module.exports.generate = function(semantics) {
    var TreeBuilder = semantics.addOperation('toTree', {

        Program: body => new Tree.Body(body.toTree()),

        Assignment_full: (type, variable, _1, value, _2) => new Tree.Assignment(type.sourceString, variable.toTree(), value.toTree()),
        Assignment_withoutType: (variable, _1, value, _2) => new Tree.Assignment(null, variable.toTree(), value.toTree()),
        Id: function (x) { return new Tree.SymbolClass(this.sourceString, null) },

        Add: (op1, _, op2) => new Tree.Operation('+', op1.toTree(), op2.toTree()),
        Subtract: (op1, _, op2) => new Tree.Operation('-', op1.toTree(), op2.toTree()),
        Multiply: (op1, _, op2) => new Tree.Operation('*', op1.toTree(), op2.toTree()),
        Divide: (op1, _, op2) => new Tree.Operation('/', op1.toTree(), op2.toTree()),
        Equal: (op1, _, op2)  => new Tree.Operation('==', op1.toTree(), op2.toTree()),
        NotEqual: (op1, _, op2) => new Tree.Operation('!=', op1.toTree(), op2.toTree()),
        Greater: (op1, _, op2)  => new Tree.Operation('>', op1.toTree(), op2.toTree()),
        LessThen: (op1, _, op2)  => new Tree.Operation('<', op1.toTree(), op2.toTree()),
        GreaterThenOrEqual: (op1, _, op2) => new Tree.Operation('>=', op1.toTree(), op2.toTree()),
        LowerThenOrEqual: (op1, _, op2) => new Tree.Operation('<=', op1.toTree(), op2.toTree()),

        Not: (_, op) => new Tree.Op('not', op.toTree()),
        Increase: (op, _) => new Tree.Op('increase', op.toTree()),

        Number: num => new Tree.VariableClass("int", parseInt(num.sourceString)),
        String: (quotes1, text, quotes2) => new Tree.VariableClass("string", text.sourceString),
        Cypher: (_1, value, _2) => new  Tree.VariableClass("cypher", value.sourceString),

        Brackets: (_, values, __) => values.toTree(),

        Body: (_, body, _1) => new Tree.Body(body.toTree()),

        FunctionDefinition: (name, _1, params, _2, _3, body) => new Tree.FunctionDef(name.toTree(), params.toTree(), body.toTree()),

        Return: (_1, exprs, _2) => new Tree.Return(exprs.toTree()),

        Params: params => params.asIteration().toTree(),

        FunctionCall: (name, _1, args, _2) => new Tree.FunctionCall(name.toTree(), args.toTree()),

        Arguments: args => args.asIteration().toTree(),

        If: (_1, condition, _2, _3, thenBody, _4, elseBody) => { return new Tree.IfStatement(condition.toTree(), thenBody.toTree(), elseBody ? elseBody.toTree()[0] : null) },

        For: (_1, _2, assignment, condition, _3, increment, _5, loopBody) => new Tree.ForLoop(assignment.toTree(), condition.toTree(), increment.toTree(), loopBody.toTree()),

        While: (_1, condition, body) => new Tree.WhileLoop(condition.toTree(), body.toTree()),

        Bool: (val) => new Tree.VariableClass("bool", val.sourceString)
    });

    return {
        TreeBuilder: TreeBuilder
    };
};
