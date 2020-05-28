const CryptoJS = require('crypto-js');
let valuesHolder = [];

const encrypt = (value) => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(value));

class Scope {
    constructor(parentScope) {
        this.store = {};
        this.parentScope = parentScope ? parentScope : null;
    }

    createChildScope() {
        return new Scope(this);
    }

    setSymbol(symbol, obj) {
        this.store[symbol.name] = obj;
        return this.store[symbol.name];
    }

    getSymbol(name) {
        if (this.store[name]) {
            return this.store[name];
        } else {
            return this.parentScope.getSymbol(name);
        }
    }
}

class VariableClass {
    constructor(type, value) {
        if (type === "cypher") {
            this.value = encrypt(value);
            this.type = type;
        }
        else {
            this.value = value;
            this.type = type;
        }
    }

    resolve(scope) {
        return this;
    }
}

class SymbolClass {
    constructor(name) {
        this.name = name;
    }

    resolve(scope) {
        return scope.getSymbol(this.name);
    }
}

class Assignment {
    constructor(type, symbol, value) {
        this.symbol = symbol;
        this.value = value;
        this.type = type;
    }

    resolve(scope) {
        const index = valuesHolder.findIndex((a) => a.name == this.symbol.name);
        if (
            this.type !== "cypher" &&
            (
                (
                    this.type === "double" ||
                    this.type === "int"
                ) &&
                isNaN(this.value.resolve(scope).value)
            ) ||
            (
                this.type === "string" &&
                !isNaN(this.value.resolve(scope).value)
            )
        ) {
            throw new Error(`The assigned value is not supported by type ${this.type}`)
        }
        if (index >= 0) {
            valuesHolder[index] = {
                ...valuesHolder[index], value: this.value.resolve(scope).value
            }
        } else {
            valuesHolder.push({
                name: this.symbol.name,
                value: this.value.resolve(scope).value,
                scope: scope.parentScope,
                type: this.type
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
        return new VariableClass("bool", eval(`${this.op1.resolve(scope).value} ${this.operation} ${this.op2.resolve(scope).value}`));
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
        if (this.condition.resolve(scope).value) {
            return this.thenBody.resolve(scope);
        } else {
            return this.elseBody.resolve(scope);
        }
    }
}

class WhileLoop {
    constructor (condition, body) {
        this.condition = condition;
        this.body = body;
    }

    resolve (scope) {
        while (true) {
            if (!this.condition.resolve(scope).value) {
                break;
            }

            this.body.resolve(scope);
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

    resolve(scope) {
        this.assignment.resolve(scope);

        while(true) {
            if (!this.condition.resolve(scope).value) {
                break;
            }
            this.body.resolve(scope);
            scope.setSymbol(new SymbolClass(this.assignment.symbol.name), this.increment.resolve(scope))
        }
    }
}

class Op {
    constructor(operation, op) {
        this.operation = operation;
        this.op = op;
    }

    resolve(scope) {
        if (this.operation === 'not') {
            return new VariableClass("bool", !op);
        } else if (this.operation === 'increase') {
            return new VariableClass("int", this.op.resolve(scope).value + 1);
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
    SymbolClass: SymbolClass,
    Assignment: Assignment,
    Operation: Operation,
    FunctionCall: FunctionCall,
    FunctionDef: FunctionDef,
    Body: Body,
    IfStatement: IfStatement,
    ForLoop: ForLoop,
    Op: Op,
    Return: Return,
    VariableClass: VariableClass,
    WhileLoop: WhileLoop
};  
