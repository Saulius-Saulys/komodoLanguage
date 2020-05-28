let valuesHolder = [];

class Scope {
    constructor(parentScope) {
        this.store = {};
        this.parentScope = parentScope ? parentScope : null;
    }

    createChildScope() {
        return new Scope(this);
    }

    setSymbol(symbol, obj) {
        let hIndex = valuesHolder.findIndex(hVal => hVal.name === symbol.name && hVal.scope === this.parentScope);

        if (hIndex >= 0) {
            obj.previousValue = valuesHolder[hIndex].value;
            obj.prepreviousValue = valuesHolder[hIndex].previousValue;

            valuesHolder[hIndex].previousValue = valuesHolder[hIndex].value
            valuesHolder[hIndex].value = obj.value
        }

        this.store[symbol.name] = obj;
        return this.store[symbol.name];
    }

    getSymbol(name) {
        if (this.store[name]) {
            return this.store[name];
        } else if (this.parentScope) {
            return this.parentScope.getSymbol(name);
        } else {
            return null;
        }
    }
}

// Class for number
class NumberClass {
    constructor(value) {
        this.value = value;
        this.previousValue = value;
        this.prepreviousValue = value;
    }

    resolve(scope) {
        return this;
    }
}

// Class for symbol
class SymbolClass {
    constructor(name) {
        this.name = name;
    }

    resolve(scope) {
        return scope.getSymbol(this.name);
    }
}

class Assignment {
    constructor(symbol, value) {
        this.symbol = symbol;
        this.value = value;
    }

    resolve(scope) {
        if (!valuesHolder.find(obj => obj.name === this.symbol.name && obj.scope === scope.parentScope)) {
            valuesHolder.push({
                name: this.symbol.name,
                value: this.value.resolve(scope).value,
                previousValue: this.value.resolve(scope).value,
                scope: scope.parentScope
            });
        }
        return scope.setSymbol(this.symbol, this.value.resolve(scope));
    }
}

class Operation {
    constructor(operation, op1, op2) {
        this.operation = operation;
        this.op1 = op1;
        this.op2 = op2;
    }

    resolve(scope) {
        var op1 = this.op1.resolve(scope).value;
        var op2 = this.op2.resolve(scope).value;

        switch (this.operation) {
            case 'add':
                return new NumberClass(op1 + op2);
            case 'sub':
                return new NumberClass(op1 - op2);
            case 'mul':
                return new NumberClass(op1 * op2);
            case 'div':
                return new NumberClass(op1 / op2);
            case 'eq':
                return new NumberClass(op1 == op2);
            case 'neq':
                return new NumberClass(op1 != op2);
            case 'gt':
                return new NumberClass(op1 > op2);
            case 'lt':
                return new NumberClass(op1 < op2);
            case 'gte':
                return new NumberClass(op1 >= op2);
            case 'lte':
                return new NumberClass(op1 <= op2);
        }
    }
}

class FunctionCall {
    constructor(name, args) {
        this.fun = name;
        this.args = args;
    }

    resolve(scope) {
        let fun = scope.getSymbol(this.fun.name);
        let args = this.args.map(arg => arg.resolve(scope));
        return fun.apply(null, args);
    }
}

class FunctionDef {
    constructor(symbol, params, body) {
        this.symbol = symbol;
        this.params = params;
        this.body = body;
    }

    resolve(scope) {
        let body = this.body;
        let params = this.params;

        return scope.setSymbol(new SymbolClass(this.symbol.name), function() {
            let childScope = scope.createChildScope();
            params.forEach((param, i) => childScope.setSymbol(new SymbolClass(param.name), arguments[i]));
            return body.resolve(childScope);
        });
    }
}

// Class for body
class Body {
    constructor(body) {
        this.statements = body;
    }

    resolve(scope) {
        let values = this.statements.map(expression => expression.resolve(scope));
        return values.pop();
    }
}

class IfStatement {
    constructor(condition, thenBody, elseBody) {
        this.condition = condition;
        this.thenBody = thenBody;
        this.elseBody = elseBody;
    }

    resolve(scope) {
        let value = this.condition.resolve(scope);

        if (value.value) {
            return this.thenBody.resolve(scope);
        } else if (this.elseBody) {
            return this.elseBody.resolve(scope);
        } else {
            return new NumberClass(false);
        }
    }
}

class ForLoop {
    constructor(assingment, condition, increment, body) {
        this.assingment = assingment;
        this.condition = condition;
        this.increment = increment;
        this.body = body;
    }

    resolve(scope) {

        // Lets assing value 
        this.assingment.resolve(scope);

        var symbol = new SymbolClass(this.assingment.symbol.name);

        // Repeat until contition is met
        while(true) {

            if(!this.condition.resolve(scope).value) {
                break;
            }

            // Lets do something whitin body
            this.body.resolve(scope);

            // Increment symbol
            scope.setSymbol(symbol, this.increment.resolve(scope))
        }

    }
}

class Op {
    constructor(operation, op) {
        this.operation = operation;
        this.op = op;
    }

    resolve(scope) {
        var op = this.op.resolve(scope).value;

        switch (this.operation) {
            case 'not':
                return new NumberClass(!op);
            case 'incr':
                return new NumberClass(op + 1);
        }
    }
}

class Return {
    constructor(returnable) {
        this.returnable = returnable;
    }

    resolve(scope) {
        return this.returnable.resolve(scope)
    }
}

module.exports = {
    Scope: Scope,
    NumberClass: NumberClass,
    SymbolClass: SymbolClass,
    Assignment: Assignment,
    Operation: Operation,
    FunctionCall: FunctionCall,
    FunctionDef: FunctionDef,
    Body: Body,
    IfStatement: IfStatement,
    ForLoop: ForLoop,
    Op: Op,
    Return: Return
};  
