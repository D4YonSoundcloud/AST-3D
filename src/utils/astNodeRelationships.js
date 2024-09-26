/**
 * Represents the relationships between different AST node types.
 * @typedef {Object} ASTNodeRelationships
 * @property {Array<{node: string, strength: number}>} relatedNodes - Array of related nodes and their relationship strength
 */

/**
 * A map of AST node types to their related nodes and relationship strengths.
 * @type {Object<string, ASTNodeRelationships>}
 */
export const astNodeRelationships = {
    'Program': {
        relatedNodes: [
            { node: 'ExpressionStatement', strength: 5 },
            { node: 'VariableDeclaration', strength: 5 },
            { node: 'FunctionDeclaration', strength: 5 },
            { node: 'ClassDeclaration', strength: 5 },
            { node: 'ImportDeclaration', strength: 5 },
            { node: 'ExportAllDeclaration', strength: 5 },
            { node: 'ExportDefaultDeclaration', strength: 5 },
            { node: 'ExportNamedDeclaration', strength: 5 },
            { node: 'BlockStatement', strength: 4 },
            { node: 'EmptyStatement', strength: 3 },
            { node: 'DebuggerStatement', strength: 3 },
        ]
    },
    'Identifier': {
        relatedNodes: [
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'FunctionDeclaration', strength: 5 },
            { node: 'ClassDeclaration', strength: 5 },
            { node: 'MemberExpression', strength: 5 },
            { node: 'CallExpression', strength: 5 },
            { node: 'AssignmentExpression', strength: 5 },
            { node: 'Property', strength: 5 },
            { node: 'ImportSpecifier', strength: 5 },
            { node: 'ExportSpecifier', strength: 5 },
            { node: 'LabeledStatement', strength: 4 },
            { node: 'BreakStatement', strength: 4 },
            { node: 'ContinueStatement', strength: 4 },
            { node: 'MetaProperty', strength: 3 },
        ]
    },
    'Literal': {
        relatedNodes: [
            { node: 'ExpressionStatement', strength: 5 },
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'BinaryExpression', strength: 5 },
            { node: 'UnaryExpression', strength: 5 },
            { node: 'ArrayExpression', strength: 5 },
            { node: 'ObjectExpression', strength: 5 },
            { node: 'Property', strength: 5 },
            { node: 'ReturnStatement', strength: 5 },
            { node: 'SwitchCase', strength: 4 },
            { node: 'TemplateLiteral', strength: 3 },
        ]
    },
    'BigIntLiteral': {
        relatedNodes: [
            { node: 'Literal', strength: 5 },
            { node: 'BinaryExpression', strength: 5 },
            { node: 'UnaryExpression', strength: 5 },
            { node: 'VariableDeclarator', strength: 4 },
            { node: 'ArrayExpression', strength: 4 },
            { node: 'Property', strength: 4 },
        ]
    },
    'RegExpLiteral': {
        relatedNodes: [
            { node: 'Literal', strength: 5 },
            { node: 'VariableDeclarator', strength: 4 },
            { node: 'CallExpression', strength: 4 },
            { node: 'BinaryExpression', strength: 3 },
            { node: 'Property', strength: 3 },
        ]
    },
    'ArrayExpression': {
        relatedNodes: [
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'ReturnStatement', strength: 5 },
            { node: 'ArrayPattern', strength: 5 },
            { node: 'Property', strength: 4 },
            { node: 'CallExpression', strength: 4 },
            { node: 'BinaryExpression', strength: 3 },
            { node: 'AssignmentExpression', strength: 3 },
        ]
    },
    'ObjectExpression': {
        relatedNodes: [
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'ReturnStatement', strength: 5 },
            { node: 'Property', strength: 5 },
            { node: 'ObjectPattern', strength: 5 },
            { node: 'CallExpression', strength: 4 },
            { node: 'AssignmentExpression', strength: 4 },
            { node: 'BinaryExpression', strength: 3 },
        ]
    },
    'FunctionExpression': {
        relatedNodes: [
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'ReturnStatement', strength: 5 },
            { node: 'Property', strength: 5 },
            { node: 'CallExpression', strength: 5 },
            { node: 'AssignmentExpression', strength: 4 },
            { node: 'ArrayExpression', strength: 3 },
            { node: 'ObjectExpression', strength: 3 },
        ]
    },
    'ArrowFunctionExpression': {
        relatedNodes: [
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'ReturnStatement', strength: 5 },
            { node: 'Property', strength: 5 },
            { node: 'CallExpression', strength: 5 },
            { node: 'AssignmentExpression', strength: 4 },
            { node: 'ArrayExpression', strength: 3 },
            { node: 'ObjectExpression', strength: 3 },
        ]
    },
    'ClassExpression': {
        relatedNodes: [
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'ReturnStatement', strength: 5 },
            { node: 'AssignmentExpression', strength: 4 },
            { node: 'Property', strength: 4 },
            { node: 'CallExpression', strength: 3 },
        ]
    },
    'TaggedTemplateExpression': {
        relatedNodes: [
            { node: 'CallExpression', strength: 5 },
            { node: 'TemplateLiteral', strength: 5 },
            { node: 'Identifier', strength: 4 },
            { node: 'MemberExpression', strength: 4 },
            { node: 'VariableDeclarator', strength: 3 },
            { node: 'ReturnStatement', strength: 3 },
        ]
    },
    'TemplateLiteral': {
        relatedNodes: [
            { node: 'TaggedTemplateExpression', strength: 5 },
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'ReturnStatement', strength: 5 },
            { node: 'BinaryExpression', strength: 4 },
            { node: 'Property', strength: 4 },
            { node: 'CallExpression', strength: 4 },
            { node: 'AssignmentExpression', strength: 3 },
        ]
    },
    'TemplateElement': {
        relatedNodes: [
            { node: 'TemplateLiteral', strength: 5 },
            { node: 'TaggedTemplateExpression', strength: 4 },
        ]
    },
    'MetaProperty': {
        relatedNodes: [
            { node: 'MemberExpression', strength: 4 },
            { node: 'Identifier', strength: 3 },
            { node: 'ExpressionStatement', strength: 3 },
        ]
    },
    'Super': {
        relatedNodes: [
            { node: 'CallExpression', strength: 5 },
            { node: 'MemberExpression', strength: 5 },
            { node: 'ClassDeclaration', strength: 4 },
            { node: 'ClassExpression', strength: 4 },
            { node: 'MethodDefinition', strength: 4 },
        ]
    },
    'ThisExpression': {
        relatedNodes: [
            { node: 'MemberExpression', strength: 5 },
            { node: 'ReturnStatement', strength: 4 },
            { node: 'VariableDeclarator', strength: 4 },
            { node: 'AssignmentExpression', strength: 4 },
            { node: 'CallExpression', strength: 4 },
            { node: 'FunctionExpression', strength: 3 },
            { node: 'ArrowFunctionExpression', strength: 3 },
        ]
    },
    'SequenceExpression': {
        relatedNodes: [
            { node: 'ExpressionStatement', strength: 5 },
            { node: 'ForStatement', strength: 4 },
            { node: 'ReturnStatement', strength: 3 },
            { node: 'VariableDeclarator', strength: 3 },
        ]
    },
    'YieldExpression': {
        relatedNodes: [
            { node: 'ExpressionStatement', strength: 5 },
            { node: 'VariableDeclarator', strength: 4 },
            { node: 'ReturnStatement', strength: 4 },
            { node: 'FunctionDeclaration', strength: 3 },
            { node: 'FunctionExpression', strength: 3 },
        ]
    },
    'AwaitExpression': {
        relatedNodes: [
            { node: 'ExpressionStatement', strength: 5 },
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'ReturnStatement', strength: 5 },
            { node: 'ArrowFunctionExpression', strength: 4 },
            { node: 'FunctionDeclaration', strength: 4 },
            { node: 'FunctionExpression', strength: 4 },
        ]
    },
    'ImportExpression': {
        relatedNodes: [
            { node: 'AwaitExpression', strength: 4 },
            { node: 'CallExpression', strength: 4 },
            { node: 'VariableDeclarator', strength: 3 },
            { node: 'ExpressionStatement', strength: 3 },
        ]
    },
    'ChainExpression': {
        relatedNodes: [
            { node: 'MemberExpression', strength: 5 },
            { node: 'CallExpression', strength: 5 },
            { node: 'ExpressionStatement', strength: 4 },
            { node: 'VariableDeclarator', strength: 4 },
            { node: 'ReturnStatement', strength: 4 },
        ]
    },
    'UnaryExpression': {
        relatedNodes: [
            { node: 'ExpressionStatement', strength: 5 },
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'ReturnStatement', strength: 5 },
            { node: 'BinaryExpression', strength: 4 },
            { node: 'ConditionalExpression', strength: 4 },
            { node: 'CallExpression', strength: 3 },
        ]
    },
    'UpdateExpression': {
        relatedNodes: [
            { node: 'ExpressionStatement', strength: 5 },
            { node: 'ForStatement', strength: 5 },
            { node: 'WhileStatement', strength: 4 },
            { node: 'DoWhileStatement', strength: 4 },
            { node: 'ReturnStatement', strength: 3 },
        ]
    },
    'BinaryExpression': {
        relatedNodes: [
            { node: 'ExpressionStatement', strength: 5 },
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'ReturnStatement', strength: 5 },
            { node: 'IfStatement', strength: 5 },
            { node: 'ConditionalExpression', strength: 5 },
            { node: 'WhileStatement', strength: 4 },
            { node: 'DoWhileStatement', strength: 4 },
            { node: 'ForStatement', strength: 4 },
        ]
    },
    'LogicalExpression': {
        relatedNodes: [
            { node: 'ExpressionStatement', strength: 5 },
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'ReturnStatement', strength: 5 },
            { node: 'IfStatement', strength: 5 },
            { node: 'ConditionalExpression', strength: 5 },
            { node: 'WhileStatement', strength: 4 },
            { node: 'DoWhileStatement', strength: 4 },
        ]
    },
    'AssignmentExpression': {
        relatedNodes: [
            { node: 'ExpressionStatement', strength: 5 },
            { node: 'VariableDeclarator', strength: 4 },
            { node: 'ForStatement', strength: 4 },
            { node: 'WhileStatement', strength: 3 },
            { node: 'DoWhileStatement', strength: 3 },
            { node: 'IfStatement', strength: 3 },
        ]
    },
    'ConditionalExpression': {
        relatedNodes: [
            { node: 'ExpressionStatement', strength: 5 },
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'ReturnStatement', strength: 5 },
            { node: 'JSXExpressionContainer', strength: 4 },
            { node: 'Property', strength: 4 },
            { node: 'ArrayExpression', strength: 3 },
        ]
    },
    'CallExpression': {
        relatedNodes: [
            { node: 'ExpressionStatement', strength: 5 },
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'ReturnStatement', strength: 5 },
            { node: 'IfStatement', strength: 4 },
            { node: 'Property', strength: 4 },
            { node: 'ArrayExpression', strength: 4 },
            { node: 'JSXExpressionContainer', strength: 3 },
        ]
    },
    'NewExpression': {
        relatedNodes: [
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'ReturnStatement', strength: 5 },
            { node: 'ExpressionStatement', strength: 5 },
            { node: 'Property', strength: 4 },
            { node: 'ArrayExpression', strength: 3 },
            { node: 'CallExpression', strength: 3 },
        ]
    },
    'MemberExpression': {
        relatedNodes: [
            { node: 'CallExpression', strength: 5 },
            { node: 'AssignmentExpression', strength: 5 },
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'ExpressionStatement', strength: 5 },
            { node: 'ReturnStatement', strength: 5 },
            { node: 'Property', strength: 4 },
            { node: 'BinaryExpression', strength: 4 },
            { node: 'ConditionalExpression', strength: 3 },
        ]
    },
    'FunctionDeclaration': {
        relatedNodes: [
            { node: 'BlockStatement', strength: 5 },
            { node: 'Identifier', strength: 5 },
            { node: 'ReturnStatement', strength: 5 },
            { node: 'VariableDeclaration', strength: 4 },
            { node: 'ExpressionStatement', strength: 4 },
            { node: 'IfStatement', strength: 4 },
            { node: 'ForStatement', strength: 3 },
            { node: 'WhileStatement', strength: 3 },
        ]
    },
    'VariableDeclaration': {
        relatedNodes: [
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'Identifier', strength: 5 },
            { node: 'Literal', strength: 4 },
            { node: 'ObjectExpression', strength: 4 },
            { node: 'ArrayExpression', strength: 4 },
            { node: 'FunctionExpression', strength: 4 },
            { node: 'ArrowFunctionExpression', strength: 4 },
            { node: 'AssignmentExpression', strength: 3 },
        ]
    },
    'ClassDeclaration': {
        relatedNodes: [
            { node: 'ClassBody', strength: 5 },
            { node: 'Identifier', strength: 5 },
            { node: 'MethodDefinition', strength: 5 },
            { node: 'PropertyDefinition', strength: 5 },
            { node: 'Super', strength: 4 },
            { node: 'ClassExpression', strength: 3 },
        ]
    },
    'SwitchCase': {
        relatedNodes: [
            { node: 'SwitchStatement', strength: 5 },
            { node: 'BreakStatement', strength: 5 },
            { node: 'BlockStatement', strength: 4 },
            { node: 'ExpressionStatement', strength: 4 },
            { node: 'ReturnStatement', strength: 3 },
        ]
    },
    'CatchClause': {
        relatedNodes: [
            { node: 'TryStatement', strength: 5 },
            { node: 'BlockStatement', strength: 5 },
            { node: 'Identifier', strength: 4 },
            { node: 'ThrowStatement', strength: 3 },
        ]
    },
    'PropertyDefinition': {
        relatedNodes: [
            { node: 'ClassBody', strength: 5 },
            { node: 'Identifier', strength: 5 },
            { node: 'Literal', strength: 4 },
            { node: 'FunctionExpression', strength: 4 },
            { node: 'ArrowFunctionExpression', strength: 4 },
            { node: 'ObjectExpression', strength: 3 },
        ]
    },
    'ExpressionStatement': {
        relatedNodes: [
            { node: 'CallExpression', strength: 5 },
            { node: 'AssignmentExpression', strength: 5 },
            { node: 'UpdateExpression', strength: 5 },
            { node: 'UnaryExpression', strength: 4 },
            { node: 'BinaryExpression', strength: 4 },
            { node: 'MemberExpression', strength: 4 },
            { node: 'Identifier', strength: 3 },
        ]
    },
    'BlockStatement': {
        relatedNodes: [
            { node: 'FunctionDeclaration', strength: 5 },
            { node: 'FunctionExpression', strength: 5 },
            { node: 'ArrowFunctionExpression', strength: 5 },
            { node: 'IfStatement', strength: 5 },
            { node: 'ForStatement', strength: 5 },
            { node: 'WhileStatement', strength: 5 },
            { node: 'TryStatement', strength: 5 },
            { node: 'SwitchCase', strength: 4 },
        ]
    },
    'EmptyStatement': {
        relatedNodes: [
            { node: 'BlockStatement', strength: 3 },
            { node: 'Program', strength: 2 },
        ]
    },
    'DebuggerStatement': {
        relatedNodes: [
            { node: 'BlockStatement', strength: 3 },
            { node: 'Program', strength: 2 },
        ]
    },
    'ReturnStatement': {
        relatedNodes: [
            { node: 'FunctionDeclaration', strength: 5 },
            { node: 'FunctionExpression', strength: 5 },
            { node: 'ArrowFunctionExpression', strength: 5 },
            { node: 'CallExpression', strength: 4 },
            { node: 'BinaryExpression', strength: 4 },
            { node: 'ConditionalExpression', strength: 4 },
            { node: 'ObjectExpression', strength: 4 },
            { node: 'ArrayExpression', strength: 4 },
        ]
    },
    'LabeledStatement': {
        relatedNodes: [
            { node: 'BreakStatement', strength: 5 },
            { node: 'ContinueStatement', strength: 5 },
            { node: 'WhileStatement', strength: 4 },
            { node: 'ForStatement', strength: 4 },
            { node: 'DoWhileStatement', strength: 4 },
            { node: 'SwitchStatement', strength: 3 },
        ]
    },
    'BreakStatement': {
        relatedNodes: [
            { node: 'SwitchCase', strength: 5 },
            { node: 'WhileStatement', strength: 5 },
            { node: 'ForStatement', strength: 5 },
            { node: 'DoWhileStatement', strength: 5 },
            { node: 'LabeledStatement', strength: 4 },
        ]
    },
    'ContinueStatement': {
        relatedNodes: [
            { node: 'WhileStatement', strength: 5 },
            { node: 'ForStatement', strength: 5 },
            { node: 'DoWhileStatement', strength: 5 },
            { node: 'LabeledStatement', strength: 4 },
        ]
    },
    'IfStatement': {
        relatedNodes: [
            { node: 'BlockStatement', strength: 5 },
            { node: 'BinaryExpression', strength: 5 },
            { node: 'LogicalExpression', strength: 5 },
            { node: 'CallExpression', strength: 4 },
            { node: 'MemberExpression', strength: 4 },
            { node: 'Identifier', strength: 4 },
            { node: 'ReturnStatement', strength: 3 },
        ]
    },
    'SwitchStatement': {
        relatedNodes: [
            { node: 'SwitchCase', strength: 5 },
            { node: 'BreakStatement', strength: 5 },
            { node: 'Identifier', strength: 4 },
            { node: 'MemberExpression', strength: 4 },
            { node: 'Literal', strength: 4 },
            { node: 'BlockStatement', strength: 3 },
        ]
    },
    'ThrowStatement': {
        relatedNodes: [
            { node: 'TryStatement', strength: 5 },
            { node: 'CatchClause', strength: 5 },
            { node: 'NewExpression', strength: 4 },
            { node: 'CallExpression', strength: 4 },
            { node: 'Identifier', strength: 3 },
            { node: 'ObjectExpression', strength: 3 },
        ]
    },
    'TryStatement': {
        relatedNodes: [
            { node: 'BlockStatement', strength: 5 },
            { node: 'CatchClause', strength: 5 },
            { node: 'ThrowStatement', strength: 4 },
            { node: 'CallExpression', strength: 3 },
            { node: 'AwaitExpression', strength: 3 },
        ]
    },
    'WhileStatement': {
        relatedNodes: [
            { node: 'BlockStatement', strength: 5 },
            { node: 'BinaryExpression', strength: 5 },
            { node: 'LogicalExpression', strength: 5 },
            { node: 'UpdateExpression', strength: 4 },
            { node: 'BreakStatement', strength: 4 },
            { node: 'ContinueStatement', strength: 4 },
            { node: 'CallExpression', strength: 3 },
        ]
    },
    'DoWhileStatement': {
        relatedNodes: [
            { node: 'BlockStatement', strength: 5 },
            { node: 'BinaryExpression', strength: 5 },
            { node: 'LogicalExpression', strength: 5 },
            { node: 'UpdateExpression', strength: 4 },
            { node: 'BreakStatement', strength: 4 },
            { node: 'ContinueStatement', strength: 4 },
            { node: 'CallExpression', strength: 3 },
        ]
    },
    'ForStatement': {
        relatedNodes: [
            { node: 'BlockStatement', strength: 5 },
            { node: 'VariableDeclaration', strength: 5 },
            { node: 'BinaryExpression', strength: 5 },
            { node: 'UpdateExpression', strength: 5 },
            { node: 'AssignmentExpression', strength: 4 },
            { node: 'BreakStatement', strength: 4 },
            { node: 'ContinueStatement', strength: 4 },
            { node: 'CallExpression', strength: 3 },
        ]
    },
    'ForInStatement': {
        relatedNodes: [
            { node: 'BlockStatement', strength: 5 },
            { node: 'VariableDeclaration', strength: 5 },
            { node: 'Identifier', strength: 5 },
            { node: 'MemberExpression', strength: 4 },
            { node: 'BreakStatement', strength: 4 },
            { node: 'ContinueStatement', strength: 4 },
            { node: 'CallExpression', strength: 3 },
        ]
    },
    'ForOfStatement': {
        relatedNodes: [
            { node: 'BlockStatement', strength: 5 },
            { node: 'VariableDeclaration', strength: 5 },
            { node: 'Identifier', strength: 5 },
            { node: 'MemberExpression', strength: 4 },
            { node: 'BreakStatement', strength: 4 },
            { node: 'ContinueStatement', strength: 4 },
            { node: 'CallExpression', strength: 3 },
            { node: 'YieldExpression', strength: 3 },
            { node: 'AwaitExpression', strength: 3 },
        ]
    },
    'WithStatement': {
        relatedNodes: [
            { node: 'BlockStatement', strength: 5 },
            { node: 'ObjectExpression', strength: 4 },
            { node: 'Identifier', strength: 4 },
            { node: 'MemberExpression', strength: 4 },
            { node: 'CallExpression', strength: 3 },
        ]
    },
    'VariableDeclarator': {
        relatedNodes: [
            { node: 'VariableDeclaration', strength: 5 },
            { node: 'Identifier', strength: 5 },
            { node: 'ObjectExpression', strength: 4 },
            { node: 'ArrayExpression', strength: 4 },
            { node: 'FunctionExpression', strength: 4 },
            { node: 'ArrowFunctionExpression', strength: 4 },
            { node: 'CallExpression', strength: 4 },
            { node: 'BinaryExpression', strength: 3 },
        ]
    },
    'ImportDeclaration': {
        relatedNodes: [
            { node: 'ImportSpecifier', strength: 5 },
            { node: 'ImportDefaultSpecifier', strength: 5 },
            { node: 'ImportNamespaceSpecifier', strength: 5 },
            { node: 'Literal', strength: 5 },
            { node: 'Identifier', strength: 4 },
        ]
    },
    'ImportSpecifier': {
        relatedNodes: [
            { node: 'ImportDeclaration', strength: 5 },
            { node: 'Identifier', strength: 5 },
        ]
    },
    'ImportDefaultSpecifier': {
        relatedNodes: [
            { node: 'ImportDeclaration', strength: 5 },
            { node: 'Identifier', strength: 5 },
        ]
    },
    'ImportNamespaceSpecifier': {
        relatedNodes: [
            { node: 'ImportDeclaration', strength: 5 },
            { node: 'Identifier', strength: 5 },
        ]
    },
    'ExportAllDeclaration': {
        relatedNodes: [
            { node: 'Literal', strength: 5 },
            { node: 'Identifier', strength: 4 },
        ]
    },
    'ExportDefaultDeclaration': {
        relatedNodes: [
            { node: 'FunctionDeclaration', strength: 5 },
            { node: 'ClassDeclaration', strength: 5 },
            { node: 'Identifier', strength: 5 },
            { node: 'ObjectExpression', strength: 4 },
            { node: 'ArrayExpression', strength: 4 },
            { node: 'CallExpression', strength: 4 },
        ]
    },
    'ExportNamedDeclaration': {
        relatedNodes: [
            { node: 'ExportSpecifier', strength: 5 },
            { node: 'FunctionDeclaration', strength: 5 },
            { node: 'ClassDeclaration', strength: 5 },
            { node: 'VariableDeclaration', strength: 5 },
            { node: 'Identifier', strength: 4 },
        ]
    },
    'ExportSpecifier': {
        relatedNodes: [
            { node: 'ExportNamedDeclaration', strength: 5 },
            { node: 'Identifier', strength: 5 },
        ]
    },
    'MethodDefinition': {
        relatedNodes: [
            { node: 'ClassBody', strength: 5 },
            { node: 'FunctionExpression', strength: 5 },
            { node: 'Identifier', strength: 5 },
            { node: 'BlockStatement', strength: 5 },
            { node: 'ThisExpression', strength: 4 },
            { node: 'Super', strength: 4 },
            { node: 'ReturnStatement', strength: 4 },
        ]
    },
    'ClassBody': {
        relatedNodes: [
            { node: 'ClassDeclaration', strength: 5 },
            { node: 'ClassExpression', strength: 5 },
            { node: 'MethodDefinition', strength: 5 },
            { node: 'PropertyDefinition', strength: 5 },
            { node: 'Identifier', strength: 4 },
        ]
    },
    'ObjectPattern': {
        relatedNodes: [
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'AssignmentExpression', strength: 5 },
            { node: 'Property', strength: 5 },
            { node: 'Identifier', strength: 5 },
            { node: 'RestElement', strength: 4 },
        ]
    },
    'ArrayPattern': {
        relatedNodes: [
            { node: 'VariableDeclarator', strength: 5 },
            { node: 'AssignmentExpression', strength: 5 },
            { node: 'Identifier', strength: 5 },
            { node: 'RestElement', strength: 4 },
        ]
    },
    'RestElement': {
        relatedNodes: [
            { node: 'ArrayPattern', strength: 5 },
            { node: 'ObjectPattern', strength: 5 },
            { node: 'Identifier', strength: 5 },
        ]
    },
    'AssignmentPattern': {
        relatedNodes: [
            { node: 'FunctionDeclaration', strength: 5 },
            { node: 'FunctionExpression', strength: 5 },
            { node: 'ArrowFunctionExpression', strength: 5 },
            { node: 'Identifier', strength: 5 },
            { node: 'ObjectPattern', strength: 4 },
            { node: 'ArrayPattern', strength: 4 },
        ]
    },
    'SpreadElement': {
        relatedNodes: [
            { node: 'ArrayExpression', strength: 5 },
            { node: 'CallExpression', strength: 5 },
            { node: 'NewExpression', strength: 5 },
            { node: 'ObjectExpression', strength: 4 },
        ]
    },
    'Property': {
        relatedNodes: [
            { node: 'ObjectExpression', strength: 5 },
            { node: 'ObjectPattern', strength: 5 },
            { node: 'Identifier', strength: 5 },
            { node: 'Literal', strength: 4 },
            { node: 'FunctionExpression', strength: 4 },
            { node: 'ArrowFunctionExpression', strength: 4 },
        ]
    },
    'PrivateIdentifier': {
        relatedNodes: [
            { node: 'ClassBody', strength: 5 },
            { node: 'PropertyDefinition', strength: 5 },
            { node: 'MethodDefinition', strength: 5 },
            { node: 'MemberExpression', strength: 4 },
        ]
    },
    'JSXElement': {
        relatedNodes: [
            { node: 'JSXOpeningElement', strength: 5 },
            { node: 'JSXClosingElement', strength: 5 },
            { node: 'JSXAttribute', strength: 5 },
            { node: 'JSXExpressionContainer', strength: 5 },
            { node: 'JSXText', strength: 5 },
            { node: 'JSXSpreadAttribute', strength: 4 },
        ]
    },
    'JSXOpeningElement': {
        relatedNodes: [
            { node: 'JSXElement', strength: 5 },
            { node: 'JSXAttribute', strength: 5 },
            { node: 'JSXSpreadAttribute', strength: 5 },
            { node: 'JSXIdentifier', strength: 5 },
        ]
    },
    'JSXClosingElement': {
        relatedNodes: [
            { node: 'JSXElement', strength: 5 },
            { node: 'JSXIdentifier', strength: 5 },
        ]
    },
    'JSXAttribute': {
        relatedNodes: [
            { node: 'JSXOpeningElement', strength: 5 },
            { node: 'JSXIdentifier', strength: 5 },
            { node: 'JSXExpressionContainer', strength: 4 },
            { node: 'Literal', strength: 4 },
        ]
    },
    'JSXSpreadAttribute': {
        relatedNodes: [
            { node: 'JSXOpeningElement', strength: 5 },
            { node: 'JSXExpressionContainer', strength: 5 },
        ]
    },
    'JSXText': {
        relatedNodes: [
            { node: 'JSXElement', strength: 5 },
        ]
    },
    'JSXExpressionContainer': {
        relatedNodes: [
            { node: 'JSXElement', strength: 5 },
            { node: 'JSXAttribute', strength: 5 },
            { node: 'Identifier', strength: 4 },
            { node: 'MemberExpression', strength: 4 },
            { node: 'CallExpression', strength: 4 },
        ]
    },
    'JSXFragment': {
        relatedNodes: [
            { node: 'JSXOpeningFragment', strength: 5 },
            { node: 'JSXClosingFragment', strength: 5 },
            { node: 'JSXText', strength: 5 },
            { node: 'JSXExpressionContainer', strength: 5 },
            { node: 'JSXElement', strength: 4 },
        ]
    },
    'JSXOpeningFragment': {
        relatedNodes: [
            { node: 'JSXFragment', strength: 5 },
        ]
    },
    'JSXClosingFragment': {
        relatedNodes: [
            { node: 'JSXFragment', strength: 5 },
        ]
    },
    'TSTypeAnnotation': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
            { node: 'TSTypeReference', strength: 5 },
            { node: 'TSUnionType', strength: 4 },
            { node: 'TSIntersectionType', strength: 4 },
            { node: 'TSArrayType', strength: 4 },
        ]
    },
    'TSTypeParameterDeclaration': {
        relatedNodes: [
            { node: 'TSTypeParameter', strength: 5 },
            { node: 'FunctionDeclaration', strength: 4 },
            { node: 'ClassDeclaration', strength: 4 },
            { node: 'TSInterfaceDeclaration', strength: 4 },
        ]
    },
    'TSTypeParameterInstantiation': {
        relatedNodes: [
            { node: 'TSTypeReference', strength: 5 },
            { node: 'CallExpression', strength: 4 },
            { node: 'NewExpression', strength: 4 },
        ]
    },
    'TSParameterProperty': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
            { node: 'AssignmentPattern', strength: 4 },
            { node: 'TSTypeAnnotation', strength: 4 },
        ]
    },
    'TSDeclareFunction': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
            { node: 'TSTypeAnnotation', strength: 5 },
            { node: 'TSTypeParameterDeclaration', strength: 4 },
        ]
    },
    'TSDeclareMethod': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
            { node: 'TSTypeAnnotation', strength: 5 },
            { node: 'TSTypeParameterDeclaration', strength: 4 },
        ]
    },
    'TSQualifiedName': {
        relatedNodes: [
            { node: 'TSTypeReference', strength: 5 },
            { node: 'Identifier', strength: 5 },
        ]
    },
    'TSCallSignatureDeclaration': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
            { node: 'TSTypeParameterDeclaration', strength: 4 },
        ]
    },
    'TSConstructSignatureDeclaration': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
            { node: 'TSTypeParameterDeclaration', strength: 4 },
        ]
    },
    'TSPropertySignature': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSMethodSignature': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
            { node: 'TSTypeAnnotation', strength: 5 },
            { node: 'TSTypeParameterDeclaration', strength: 4 },
        ]
    },
    'TSIndexSignature': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSAnyKeyword': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSBooleanKeyword': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSNeverKeyword': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSNullKeyword': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSNumberKeyword': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSObjectKeyword': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSStringKeyword': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSSymbolKeyword': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSUndefinedKeyword': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSUnknownKeyword': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSVoidKeyword': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSThisType': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSFunctionType': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
            { node: 'TSTypeParameterDeclaration', strength: 4 },
        ]
    },
    'TSConstructorType': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
            { node: 'TSTypeParameterDeclaration', strength: 4 },
        ]
    },
    'TSTypeReference': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
            { node: 'TSQualifiedName', strength: 5 },
            { node: 'TSTypeParameterInstantiation', strength: 4 },
        ]
    },
    'TSTypePredicate': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSTypeQuery': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
            { node: 'TSQualifiedName', strength: 5 },
        ]
    },
    'TSTypeLiteral': {
        relatedNodes: [
            { node: 'TSPropertySignature', strength: 5 },
            { node: 'TSCallSignatureDeclaration', strength: 4 },
            { node: 'TSConstructSignatureDeclaration', strength: 4 },
            { node: 'TSIndexSignature', strength: 4 },
        ]
    },
    'TSArrayType': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSTupleType': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSOptionalType': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSRestType': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSUnionType': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSIntersectionType': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSConditionalType': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSInferType': {
        relatedNodes: [
            { node: 'TSTypeParameter', strength: 5 },
        ]
    },
    'TSParenthesizedType': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSTypeOperator': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSIndexedAccessType': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
        ]
    },
    'TSMappedType': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
            { node: 'TSTypeParameter', strength: 5 },
        ]
    },
    'TSLiteralType': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
            { node: 'Literal', strength: 5 },
        ]
    },
    'TSExpressionWithTypeArguments': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
            { node: 'TSQualifiedName', strength: 5 },
            { node: 'TSTypeParameterInstantiation', strength: 4 },
        ]
    },
    'TSInterfaceDeclaration': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
            { node: 'TSInterfaceBody', strength: 5 },
            { node: 'TSTypeParameterDeclaration', strength: 4 },
            { node: 'TSExpressionWithTypeArguments', strength: 4 },
        ]
    },
    'TSInterfaceBody': {
        relatedNodes: [
            { node: 'TSPropertySignature', strength: 5 },
            { node: 'TSMethodSignature', strength: 5 },
            { node: 'TSIndexSignature', strength: 4 },
        ]
    },
    'TSTypeAliasDeclaration': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
            { node: 'TSTypeAnnotation', strength: 5 },
            { node: 'TSTypeParameterDeclaration', strength: 4 },
        ]
    },
    'TSAsExpression': {
        relatedNodes: [
            { node: 'Expression', strength: 5 },
            { node: 'TSType', strength: 5 },
        ]
    },
    'TSTypeAssertion': {
        relatedNodes: [
            { node: 'TSType', strength: 5 },
            { node: 'Expression', strength: 5 },
        ]
    },
    'TSEnumDeclaration': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
            { node: 'TSEnumMember', strength: 5 },
        ]
    },
    'TSEnumMember': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
            { node: 'Expression', strength: 4 },
        ]
    },
    'TSModuleDeclaration': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
            { node: 'Literal', strength: 5 },
            { node: 'TSModuleBlock', strength: 5 },
        ]
    },
    'TSModuleBlock': {
        relatedNodes: [
            { node: 'Statement', strength: 5 },
        ]
    },
    'TSImportType': {
        relatedNodes: [
            { node: 'TSTypeAnnotation', strength: 5 },
            { node: 'TSTypeParameterInstantiation', strength: 4 },
        ]
    },
    'TSImportEqualsDeclaration': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
            { node: 'TSExternalModuleReference', strength: 5 },
            { node: 'TSEntityName', strength: 4 },
        ]
    },
    'TSExternalModuleReference': {
        relatedNodes: [
            { node: 'Literal', strength: 5 },
        ]
    },
    'TSNonNullExpression': {
        relatedNodes: [
            { node: 'Expression', strength: 5 },
        ]
    },
    'TSExportAssignment': {
        relatedNodes: [
            { node: 'Expression', strength: 5 },
        ]
    },
    'TSNamespaceExportDeclaration': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
        ]
    },
    'TSTypeParameter': {
        relatedNodes: [
            { node: 'Identifier', strength: 5 },
            { node: 'TSType', strength: 4 },
        ]
    }
};