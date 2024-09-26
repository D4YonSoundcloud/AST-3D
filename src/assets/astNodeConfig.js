export const NODE_TYPES = {
    // Program
    Program: { color: 0x9C27B0, shape: 'sphere' },

    // Literals and Identifiers
    Identifier: { color: 0x3F51B5, shape: 'tetrahedron' },
    Literal: { color: 0x1e4d54, shape: 'icosahedron' },
    BigIntLiteral: { color: 0x006064, shape: 'icosahedron' },
    RegExpLiteral: { color: 0x0097A7, shape: 'icosahedron' },

    // Expressions
    ArrayExpression: { color: 0xCDDC39, shape: 'octahedron' },
    ObjectExpression: { color: 0xff791b, shape: 'octahedron' },
    FunctionExpression: { color: 0x795548, shape: 'sphere' },
    ArrowFunctionExpression: { color: 0x4CAF50, shape: 'octahedron' },
    ClassExpression: { color: 0x9C27B0, shape: 'octahedron' },
    TaggedTemplateExpression: { color: 0xE91E63, shape: 'octahedron' },
    TemplateLiteral: { color: 0x673AB7, shape: 'icosahedron' },
    TemplateElement: { color: 0xCDDC39, shape: 'icosahedron' },
    MetaProperty: { color: 0x607D8B, shape: 'tetrahedron' },
    Super: { color: 0xFF5722, shape: 'tetrahedron' },
    ThisExpression: { color: 0x009688, shape: 'tetrahedron' },
    SequenceExpression: { color: 0x00BCD4, shape: 'octahedron' },
    YieldExpression: { color: 0xFFC107, shape: 'octahedron' },
    AwaitExpression: { color: 0xFF9800, shape: 'octahedron' },
    ImportExpression: { color: 0x3F51B5, shape: 'octahedron' },
    ChainExpression: { color: 0xF44336, shape: 'octahedron' },

    // Unary Operations
    UnaryExpression: { color: 0x795548, shape: 'octahedron' },
    UpdateExpression: { color: 0xFFC107, shape: 'octahedron' },

    // Binary Operations
    BinaryExpression: { color: 0x673AB7, shape: 'octahedron' },
    LogicalExpression: { color: 0x9C27B0, shape: 'octahedron' },
    AssignmentExpression: { color: 0xF44336, shape: 'octahedron' },

    // Conditional
    ConditionalExpression: { color: 0xFFEB3B, shape: 'octahedron' },

    // Call and Member
    CallExpression: { color: 0xE91E63, shape: 'octahedron' },
    NewExpression: { color: 0x8BC34A, shape: 'octahedron' },
    MemberExpression: { color: 0x009688, shape: 'octahedron' },

    // Declarations
    FunctionDeclaration: { color: 0x00ff0a, shape: 'sphere' },
    VariableDeclaration: { color: 0x00fffd, shape: 'sphere' },
    ClassDeclaration: { color: 0x9C27B0, shape: 'sphere' },

    // Clauses
    SwitchCase: { color: 0x00BCD4, shape: 'box' },
    CatchClause: { color: 0xFF5722, shape: 'box' },
    PropertyDefinition: { color: 0x4CAF50, shape: 'octahedron' },

    // Statements
    ExpressionStatement: { color: 0xff38ca, shape: 'box' },
    BlockStatement: { color: 0xffffff, shape: 'box' },
    EmptyStatement: { color: 0x9E9E9E, shape: 'box' },
    DebuggerStatement: { color: 0x795548, shape: 'box' },
    ReturnStatement: { color: 0x2196F3, shape: 'box' },
    LabeledStatement: { color: 0x3F51B5, shape: 'box' },
    BreakStatement: { color: 0xFF5722, shape: 'box' },
    ContinueStatement: { color: 0xFF9800, shape: 'box' },
    IfStatement: { color: 0xedff00, shape: 'box' },
    SwitchStatement: { color: 0x03A9F4, shape: 'icosahedron' },
    ThrowStatement: { color: 0xF44336, shape: 'box' },
    TryStatement: { color: 0x4CAF50, shape: 'box' },
    WhileStatement: { color: 0x9E9E9E, shape: 'box' },
    DoWhileStatement: { color: 0x673AB7, shape: 'box' },
    ForStatement: { color: 0xff8a00, shape: 'box' },
    ForInStatement: { color: 0xFF9800, shape: 'box' },
    ForOfStatement: { color: 0xFFC107, shape: 'box' },
    WithStatement: { color: 0x607D8B, shape: 'box' },

    // Declarations
    VariableDeclarator: { color: 0x01a756, shape: 'tetrahedron' },

    // Imports and Exports
    ImportDeclaration: { color: 0x795548, shape: 'octahedron' },
    ImportSpecifier: { color: 0x795548, shape: 'octahedron' },
    ImportDefaultSpecifier: { color: 0x8D6E63, shape: 'octahedron' },
    ImportNamespaceSpecifier: { color: 0x795548, shape: 'octahedron' },
    ExportAllDeclaration: { color: 0x00BCD4, shape: 'octahedron' },
    ExportDefaultDeclaration: { color: 0x00ACC1, shape: 'octahedron' },
    ExportNamedDeclaration: { color: 0x26C6DA, shape: 'octahedron' },
    ExportSpecifier: { color: 0x4DD0E1, shape: 'octahedron' },

    // Class Elements
    MethodDefinition: { color: 0x7B1FA2, shape: 'octahedron' },
    ClassBody: { color: 0x6A1B9A, shape: 'box' },

    // Others
    ObjectPattern: { color: 0xE65100, shape: 'octahedron' },
    ArrayPattern: { color: 0xEF6C00, shape: 'octahedron' },
    RestElement: { color: 0xF57C00, shape: 'tetrahedron' },
    AssignmentPattern: { color: 0xFB8C00, shape: 'octahedron' },
    SpreadElement: { color: 0x607D8B, shape: 'tetrahedron' },
    Property: { color: 0xf9a44a, shape: 'octahedron' },
    PrivateIdentifier: { color: 0x3949AB, shape: 'tetrahedron' },
};

export const NODE_DESCRIPTIONS = {
    Program: "The root node of the entire AST.",
    VariableDeclaration: "Declares one or more variables.",
    VariableDeclarator: "Represents the binding of a variable to its initial value.",
    Identifier: "An identifier, representing a variable or property name.",
    CallExpression: "Represents a function call.",
    MemberExpression: "Represents accessing a property of an object.",
    Literal: "A literal value, such as a string, number, or boolean.",
    NewExpression: "Creating a new object with a constructor function.",
    ObjectExpression: "Represents an object literal.",
    Property: "Represents a property in an object literal.",
    FunctionDeclaration: "Declares a function with a given name and parameters.",
    BlockStatement: "A block of statements, usually enclosed in braces.",
    ExpressionStatement: "A statement consisting of a single expression.",
    AssignmentExpression: "Assigns a value to a variable or property.",
    BinaryExpression: "An expression with a binary operator, like addition or comparison.",
    ArrayExpression: "Represents an array literal.",
    SwitchStatement: "A switch statement, with cases and possibly a default.",
    SwitchCase: "A case in a switch statement.",
    ConditionalExpression: "A ternary conditional expression (condition ? expr1 : expr2).",
    ArrowFunctionExpression: "Represents an arrow function expression.",
    BreakStatement: "A break statement, used to exit loops or switch statements.",
    LogicalExpression: "An expression with a logical operator (&&, ||, ??).",
    IfStatement: "An if statement, possibly with an else clause.",
    ReturnStatement: "A return statement in a function.",
    UpdateExpression: "An update expression, like increment or decrement.",
    ForInStatement: "A for...in loop, used to iterate over object properties.",
    UnaryExpression: "An expression with a unary operator, like negation or typeof.",
    ForStatement: "A standard for loop.",
    SpreadElement: "A spread element in an array literal or function call.",
    WhileStatement: "A while loop.",
    ChainExpression: "Represents optional chaining (?.) in member expressions.",
    TemplateLiteral: "A template literal string, possibly with embedded expressions.",
    TemplateElement: "A part of a template literal, either a string or an expression."
};

export const DEFAULT_NODE_TYPE = { color: 0x808080, shape: 'sphere' }


export function getNodeConfig(type) {
    return NODE_TYPES[type] || { color: 0x808080, shape: 'sphere' };
}

export function getNodeDescription(type) {
    return NODE_DESCRIPTIONS[type] || "No description available";
}