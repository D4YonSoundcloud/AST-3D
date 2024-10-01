import { defineStore } from 'pinia'
import { ref } from 'vue'

// Define all possible JavaScript AST node types
export const ALL_NODE_TYPES = [
    'Program',
    'Identifier', 'Literal', 'BigIntLiteral', 'RegExpLiteral',
    'ArrayExpression', 'ObjectExpression', 'FunctionExpression', 'ArrowFunctionExpression', 'ClassExpression',
    'TaggedTemplateExpression', 'TemplateLiteral', 'TemplateElement',
    'MetaProperty', 'Super', 'ThisExpression',
    'SequenceExpression', 'YieldExpression', 'AwaitExpression',
    'ImportExpression', 'ChainExpression',
    'UnaryExpression', 'UpdateExpression',
    'BinaryExpression', 'LogicalExpression', 'AssignmentExpression',
    'ConditionalExpression',
    'CallExpression', 'NewExpression', 'MemberExpression',
    'FunctionDeclaration', 'VariableDeclaration', 'ClassDeclaration',
    'SwitchCase', 'CatchClause', 'PropertyDefinition',
    'ExpressionStatement', 'BlockStatement', 'EmptyStatement', 'DebuggerStatement',
    'ReturnStatement', 'LabeledStatement', 'BreakStatement', 'ContinueStatement',
    'IfStatement', 'SwitchStatement', 'ThrowStatement', 'TryStatement',
    'WhileStatement', 'DoWhileStatement', 'ForStatement', 'ForInStatement', 'ForOfStatement',
    'WithStatement',
    'VariableDeclarator',
    'ImportDeclaration', 'ImportSpecifier', 'ImportDefaultSpecifier', 'ImportNamespaceSpecifier',
    'ExportAllDeclaration', 'ExportDefaultDeclaration', 'ExportNamedDeclaration', 'ExportSpecifier',
    'MethodDefinition', 'ClassBody',
    'ObjectPattern', 'ArrayPattern', 'RestElement', 'AssignmentPattern',
    'SpreadElement', 'Property', 'PrivateIdentifier',
    // JSX (if you're parsing JSX)
    'JSXElement', 'JSXOpeningElement', 'JSXClosingElement', 'JSXAttribute', 'JSXSpreadAttribute',
    'JSXText', 'JSXExpressionContainer', 'JSXFragment', 'JSXOpeningFragment', 'JSXClosingFragment',
    // TypeScript specific (if you're parsing TypeScript)
    'TSTypeAnnotation', 'TSTypeParameterDeclaration', 'TSTypeParameterInstantiation',
    'TSParameterProperty', 'TSDeclareFunction', 'TSDeclareMethod', 'TSQualifiedName',
    'TSCallSignatureDeclaration', 'TSConstructSignatureDeclaration', 'TSPropertySignature',
    'TSMethodSignature', 'TSIndexSignature', 'TSAnyKeyword', 'TSBooleanKeyword',
    'TSNeverKeyword', 'TSNullKeyword', 'TSNumberKeyword', 'TSObjectKeyword', 'TSStringKeyword',
    'TSSymbolKeyword', 'TSUndefinedKeyword', 'TSUnknownKeyword', 'TSVoidKeyword',
    'TSThisType', 'TSFunctionType', 'TSConstructorType', 'TSTypeReference', 'TSTypePredicate',
    'TSTypeQuery', 'TSTypeLiteral', 'TSArrayType', 'TSTupleType', 'TSOptionalType',
    'TSRestType', 'TSUnionType', 'TSIntersectionType', 'TSConditionalType', 'TSInferType',
    'TSParenthesizedType', 'TSTypeOperator', 'TSIndexedAccessType', 'TSMappedType',
    'TSLiteralType', 'TSExpressionWithTypeArguments', 'TSInterfaceDeclaration',
    'TSInterfaceBody', 'TSTypeAliasDeclaration', 'TSAsExpression', 'TSTypeAssertion',
    'TSEnumDeclaration', 'TSEnumMember', 'TSModuleDeclaration', 'TSModuleBlock',
    'TSImportType', 'TSImportEqualsDeclaration', 'TSExternalModuleReference',
    'TSNonNullExpression', 'TSExportAssignment', 'TSNamespaceExportDeclaration',
    'TSTypeAnnotation', 'TSTypeParameterDeclaration', 'TSTypeParameterInstantiation',
    'TSParameterProperty'
]

export const DEFAULT_VISIBLE_NODE_TYPES = [
    'Program',
    'FunctionDeclaration',
    'VariableDeclaration',
    'ClassDeclaration',
    'ImportDeclaration',
    'ExportDefaultDeclaration',
    'ExportNamedDeclaration',
    'IfStatement',
    'SwitchStatement',
    'BlockStatement',
    'ReturnStatement',
    'ForStatement',
    'WhileStatement',
    'TryStatement',
    'ObjectExpression',
    'ArrayExpression',
    'Property'
]

export const useAstStore = defineStore('ast', () => {
    const ast = ref(null)
    const nodes = ref([])
    const links = ref([])
    const hoveredNode = ref(null)
    const availableNodeTypes = ref(new Set(ALL_NODE_TYPES))
    const visibleNodeTypes = ref(new Set(DEFAULT_VISIBLE_NODE_TYPES))
    const currentAstNodeTypes = ref(new Set())

    const currentNodeData = ref(null)

    const visualizationUpdateTrigger = ref(0);

    function setAst(newAst) {
        ast.value = newAst
    }

    function setNodes(newNodes) {
        nodes.value = newNodes
    }

    function setLinks(newLinks) {
        links.value = newLinks
    }

    function setHoveredNode(node) {
        hoveredNode.value = node
    }

    function setCurrentAstNodeTypes(nodeTypes) {
        currentAstNodeTypes.value = new Set(nodeTypes)
    }

    function toggleAvailableNodeType(type) {
        if (availableNodeTypes.value.has(type)) {
            availableNodeTypes.value.delete(type)
            visibleNodeTypes.value.delete(type)
        } else {
            availableNodeTypes.value.add(type)
            visibleNodeTypes.value.add(type)
        }
    }

    function toggleVisibleNodeType(type) {
        if (visibleNodeTypes.value.has(type)) {
            visibleNodeTypes.value.delete(type)
        } else {
            visibleNodeTypes.value.add(type)
        }
    }

    function setCurrentNodeData(nodeData) {
        currentNodeData.value = nodeData
    }

    function triggerVisualizationUpdate() {
        visualizationUpdateTrigger.value += 1;
    }

    return {
        ast,
        nodes,
        links,
        hoveredNode,
        availableNodeTypes,
        visibleNodeTypes,
        currentAstNodeTypes,
        currentNodeData,
        visualizationUpdateTrigger,
        setAst,
        setNodes,
        setLinks,
        setHoveredNode,
        setCurrentAstNodeTypes,
        toggleAvailableNodeType,
        toggleVisibleNodeType,
        setCurrentNodeData,
        triggerVisualizationUpdate,
        ALL_NODE_TYPES,
        DEFAULT_VISIBLE_NODE_TYPES
    }
})