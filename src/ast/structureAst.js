class FunctionDef {
    constructor(symbol, params, body) {
        this.symbol = symbol;
        this.params = params;
        this.body = body;
    }

    resolve(context) {
        let body = this.body;
        let params = this.params;

        return context.setSymbol(new SymbolClass(this.symbol.name), function() {
            let childContext = context.passContextToChild();
            params.forEach((param, i) => childContext.setSymbol(new SymbolClass(param.name), arguments[i]));
            return body.resolve(childContext);
        });
    }
}

class FunctionCall {
    constructor(name, args) {
        this.fun = name;
        this.args = args;
    }

    resolve(context) {
        let fun = context.getSymbol(this.fun.name);
        let args = this.args.map(arg => arg.resolve(context));
        return fun.apply(null, args);
    }
}

class WhileLoop {
    constructor (condition, body) {
        this.condition = condition;
        this.body = body;
    }

    resolve (context) {
        while (true) {
            if (!this.condition.resolve(context).value) {
                break;
            }

            this.body.resolve(context);
        }
    }
}

class ForLoop {
    constructor (assignment, condition, increment, body) {
        this.assignment = assignment;
        this.condition = condition;
        this.increment = increment;
        this.body = body;
    }

    resolve(context) {
        this.assignment.resolve(context);

        while(true) {
            if (!this.condition.resolve(context).value) {
                break;
            }
            this.body.resolve(context);
            context.setSymbol(new SymbolClass(this.assignment.symbol.name), this.increment.resolve(context))
        }
    }
}

class IfStatement {
    constructor(condition, thenBody, elseBody) {
        this.condition = condition;
        this.thenBody = thenBody;
        this.elseBody = elseBody;
    }

    resolve(context) {
        if (this.condition.resolve(context).value) {
            return this.thenBody.resolve(context);
        } else {
            return this.elseBody.resolve(context);
        }
    }
}

class SymbolClass {
    constructor(name) {
        this.name = name;
    }

    resolve(context) {
        return context.getSymbol(this.name);
    }
}

module.exports = {
    FunctionCall, 
    IfStatement, 
    FunctionDef, 
    WhileLoop, 
    ForLoop, 
    SymbolClass
}