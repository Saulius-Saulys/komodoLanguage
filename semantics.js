var Tree = require('./ast.js');

module.exports.generate = function(semantics) {
    var TreeBuilder = semantics.addOperation('toTree', {

        Program: body => new Tree.Body(body.toTree()),

        Assignment_full: (type, variable, _1, value, _2) => new Tree.Assignment(type.sourceString, variable.toTree(), value.toTree()),
        Assignment_withoutType: (variable, _1, value, _2) => new Tree.Assignment(null, variable.toTree(), value.toTree()),
        Id: function (x, y) { return new Tree.SymbolClass(this.sourceString, null) },

        Add: (op1, _, op2) => new Tree.Operation('add', op1.toTree(), op2.toTree()),
        Sub: (op1, _, op2) => new Tree.Operation('sub', op1.toTree(), op2.toTree()),
        Mul: (op1, _, op2) => new Tree.Operation('mul', op1.toTree(), op2.toTree()),
        Div: (op1, _, op2) => new Tree.Operation('div', op1.toTree(), op2.toTree()),
        Eq: (op1, _, op2)  => new Tree.Operation('eq', op1.toTree(), op2.toTree()),
        Neq: (op1, _, op2) => new Tree.Operation('neq', op1.toTree(), op2.toTree()),
        Gt: (op1, _, op2)  => new Tree.Operation('gt', op1.toTree(), op2.toTree()),
        Lt: (op1, _, op2)  => new Tree.Operation('lt', op1.toTree(), op2.toTree()),
        Gte: (op1, _, op2) => new Tree.Operation('gte', op1.toTree(), op2.toTree()),
        Lte: (op1, _, op2) => new Tree.Operation('lte', op1.toTree(), op2.toTree()),

        Not: (_, op) => new Tree.Op('not', op.toTree()),
        Incr: (op, _) => new Tree.Op('incr', op.toTree()),

        Number: num => new Tree.NumberClass(num.calculate()),
        String: (quotes1, text, quotes2) => new Tree.NumberClass(text.sourceString),

        Cluster: (_, values, __) => values.toTree(),
        Brackets: (_, values, __) => values.toTree(),

        Body: (_, body, _1) => new Tree.Body(body.toTree()),

        FunctionDefinition: (name, _1, params, _2, _3, body) => new Tree.FunctionDef(name.toTree(), params.toTree(), body.toTree()),

        Return: (_1, exprs, _2) => new Tree.Return(exprs.toTree()),

        Params: params => params.asIteration().toTree(),

        FunctionCall: (name, _1, args, _2) => new Tree.FunctionCall(name.toTree(), args.toTree()),

        Arguments: args => args.asIteration().toTree(),

        If: (condition, _1, thenBody, _2, elseBody) => { return new Tree.IfStatement(condition.toTree(), thenBody.toTree(), elseBody ? elseBody.toTree()[0] : null) },

        For: (_1, _2, assignment, condition, _3, increment, _5, loopBody) => new Tree.ForLoop(assignment.toTree(), condition.toTree(), increment.toTree(), loopBody.toTree()),

        While: (_1, condition, body) => new Tree.WhileLoop(condition.toTree(), body.toTree()),

        Declaration: (type, name, _1 ) => new Tree.VariableClass(type.sourceString, name.sourceString)
    });

    var Calculator = semantics.addOperation('calculate', {
        Add: function (op1, _, op2) {
            return op1.calculate() + op2.calculate();
        },
        Sub: function (op1, _, op2) {
            return op1.calculate() - op2.calculate();
        },
        Mul: function (op1, _, op2) {
            return op1.calculate() * op2.calculate();
        },
        Div: function (op1, _, op2) {
            return op1.calculate() / op2.calculate();
        },
        Cluster: function (_1, op, _2) {
            return op.calculate();
        },
        int: function (digit) {
            return parseInt(this.sourceString, 10);
        },
        float: function (digit1, dot, digit1) {
            return parseFloat(this.sourceString);
        }
    });

    return {
        Calculator: Calculator,
        TreeBuilder: TreeBuilder
    };
};
