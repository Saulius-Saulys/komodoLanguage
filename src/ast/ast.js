const CryptoJS = require('crypto-js');
const structureAst = require('./structureAst');
const CONST = require('./const');

const values = [];

const encrypt = (value) => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(value));

class VariableClass {
    constructor(type, value) {
        if (type === CONST.TYPES.CYPHER) {
            this.value = encrypt(value);
            this.type = type;
        }
        else {
            this.value = value;
            this.type = type;
        }
    }

    resolve(context) {
        return this;
    }
}

class Assignment {
    constructor(type, symbol, value) {
        this.symbol = symbol;
        this.value = value;
        this.type = type;
    }

    resolve(context) {
        const index = values.findIndex((a) => a.name == this.symbol.name);
        if (
            this.type !== CONST.TYPES.CYPHER &&
            (
                (
                    this.type === CONST.TYPES.DOUBLE ||
                    this.type === CONST.TYPES.INT
                ) &&
                isNaN(this.value.resolve(context).value)
            ) ||
            (
                this.type === CONST.TYPES.STRING &&
                !isNaN(this.value.resolve(context).value)
            )
        ) {
            throw new Error(`The assigned value is not supported by type ${this.type}`)
        }
        if (index >= 0) {
            values[index] = {
                ...values[index], value: this.value.resolve(context).value
            }
        } else {
            values.push({
                name: this.symbol.name,
                value: this.value.resolve(context).value,
                context: context.parentContext,
                type: this.type
            });
        }
        return context.setSymbol(this.symbol, this.value.resolve(context));
    }
}

class Operation {
    constructor(operation, left, right) {
        this.operation = operation;
        this.left = left;
        this.right = right;
    }

    resolve(context) {
        return new VariableClass(CONST.TYPES.BOOL, eval(`${this.left.resolve(context).value} ${this.operation} ${this.right.resolve(context).value}`));
    }
}

class Body {
    constructor(body) {
        this.statements = body;
    }

    resolve(context) {
        const values = this.statements.map(expression => expression.resolve(context));
        return values.pop();
    }
}

class Op {
    constructor(operation, op) {
        this.operation = operation;
        this.op = op;
    }

    resolve(context) {
        if (this.operation === CONST.OPERATORS.NOT) {
            return new VariableClass(CONST.TYPES.BOOL, !op);
        } else if (this.operation === CONST.OPERATORS.INC) {
            return new VariableClass(CONST.TYPES.INT, this.op.resolve(context).value + 1);
        }
    }
}

class Return {
    constructor(returnable) {
        this.returnable = returnable;
    }

    resolve(context) {
        return this.returnable.resolve(context)
    }
}

class Context {
    constructor(parentContext) {
        this.store = {};
        this.parentContext = parentContext ? parentContext : null;
    }

    passContextToChild() {
        return new Context(this);
    }

    setSymbol(symbol, obj) {
        this.store[symbol.name] = obj;
        return this.store[symbol.name];
    }

    getSymbol(name) {
        if (this.store[name]) {
            return this.store[name];
        } else {
            return this.parentContext.getSymbol(name);
        }
    }
}

module.exports = {
    Context,
    Assignment,
    Operation,
    Body,
    Op,
    Return,
    VariableClass,
    ...structureAst
};  
