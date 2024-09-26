<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    required: true
  }
})

const iconPaths = {
  // Expressions
  AssignmentExpression: 'M5 12h14m-3-3l3 3-3 3M7 7l10 10M17 7L7 17',
  BinaryExpression: 'M4 12h6v-2l4-4 4 4v2h2M2 17h20M7 17l5-5 5 5',
  LogicalExpression: 'M6 12h12M6 7a5 5 0 000 10M18 7a5 5 0 010 10M12 4v16',
  UnaryExpression: 'M12 3v18m-6-9h12m-9-6l6 6-6 6',
  UpdateExpression: 'M12 2v20M2 12h20m-10-6l6 6-6 6m0-12l-6 6 6 6',
  ConditionalExpression: 'M2 6h20L12 18z M7 10h10 M9 14h6',
  CallExpression: 'M20 12a8 8 0 11-16 0 8 8 0 0116 0zm-8-5v10m-5-5h10',
  NewExpression: 'M12 2l4 4m-4-4l-4 4m4-4v20m-8-8l4-4m-4 4l4 4m12-4l-4-4m4 4l-4 4',
  SequenceExpression: 'M4 6h16M4 12h16M4 18h16m-2-14v12m-6-12v12',
  MemberExpression: 'M3 6h18l-9 12zm9 0v12m-4-3h8',
};

const getIconPath = computed(() => {
  return iconPaths[props.type] || 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z';
})
</script>

<template>
  <svg class="node-type-icon" viewBox="0 0 18 18" width="18" height="18">
    <template v-if="type === 'Program'">
      <rect x="1" y="1" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1"/>
      <line x1="4" y1="6" x2="14" y2="6" stroke="currentColor" stroke-width="1"/>
      <line x1="4" y1="9" x2="14" y2="9" stroke="currentColor" stroke-width="1"/>
      <line x1="4" y1="12" x2="14" y2="12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'Identifier'">
      <circle cx="9" cy="9" r="7" fill="none" stroke="currentColor" stroke-width="1"/>
      <text x="9" y="12" font-size="8" fill="currentColor" text-anchor="middle">ID</text>
    </template>
    <template v-else-if="type === 'Literal'">
      <polygon points="9,1 17,5 17,13 9,17 1,13 1,5" fill="none" stroke="currentColor" stroke-width="1"/>
      <text x="9" y="12" font-size="8" fill="currentColor" text-anchor="middle">"A"</text>
    </template>
    <template v-else-if="type === 'BigIntLiteral'">
      <text x="9" y="11" font-size="7" fill="currentColor" text-anchor="middle">1234n</text>
    </template>
    <template v-else-if="type === 'RegExpLiteral'">
      <text x="9" y="12" font-size="6" fill="currentColor" text-anchor="middle">/\w+/</text>
    </template>
    <template v-else-if="type === 'ArrayExpression'">
      <rect x="3" y="3" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1"/>
      <line x1="3" y1="6" x2="15" y2="6" stroke="currentColor" stroke-width="1"/>
      <line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" stroke-width="1"/>
      <line x1="3" y1="12" x2="15" y2="12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'ObjectExpression'">
      <rect x="1" y="1" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1" rx="3" ry="3"/>
      <line x1="1" y1="6" x2="17" y2="6" stroke="currentColor" stroke-width="1"/>
      <line x1="1" y1="11" x2="17" y2="11" stroke="currentColor" stroke-width="1"/>
      <line x1="9" y1="6" x2="9" y2="16" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'FunctionExpression'">
      <text x="4" y="12" font-size="8" fill="currentColor">fn()</text>
    </template>
    <template v-else-if="type === 'ArrowFunctionExpression'">
      <path d="M3 9 H12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M12 9 L15 6 M12 9 L15 12" stroke="currentColor" stroke-width="1" fill="none"/>
      <circle cx="3" cy="9" r="2" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'ClassExpression'">
      <rect x="1" y="1" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1" rx="3" ry="3"/>
      <line x1="1" y1="6" x2="17" y2="6" stroke="currentColor" stroke-width="1"/>
      <circle cx="9" cy="11" r="3" fill="none" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TaggedTemplateExpression'">
      <path d="M1 9 H17 M5 4 L9 9 L5 14 M13 4 L9 9 L13 14" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="9" cy="9" r="2" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'TemplateLiteral'">
      <text x="9" y="11" font-size="10" fill="currentColor" text-anchor="middle">${}</text>
    </template>
    <template v-else-if="type === 'TemplateElement'">
      <text x="9" y="11" font-size="8" fill="currentColor" text-anchor="middle">`text`</text>
    </template>
    <template v-else-if="type === 'MetaProperty'">
      <text x="9" y="12" font-size="8" fill="currentColor" text-anchor="middle">meta</text>
    </template>
    <template v-else-if="type === 'Super'">
      <text x="9" y="12" font-size="6" fill="currentColor" text-anchor="middle">super</text>
    </template>
    <template v-else-if="type === 'ThisExpression'">
      <text x="9" y="12" font-size="7" fill="currentColor" text-anchor="middle">this.</text>
    </template>
    <template v-else-if="type === 'SequenceExpression'">
      <path d="M3 9 H15 M7 5 V13 M11 5 V13" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="5" cy="9" r="1" fill="currentColor"/>
      <circle cx="9" cy="9" r="1" fill="currentColor"/>
      <circle cx="13" cy="9" r="1" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'YieldExpression'">
      <path d="M3 9 H15 M9 3 V15 M3 9 Q9 3 15 9 T15 9" fill="none" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'AwaitExpression'">
      <path d="M9 3 V15 M3 9 H15 M5 7 L13 11 M5 11 L13 7" fill="none" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'ImportExpression'">
      <path d="M3 9 H15 M9 3 V15 M12 6 L9 9 L12 12" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="9" cy="9" r="7" fill="none" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'ChainExpression'">
      <path d="M3 9 H15 M6 6 Q9 9 12 6 M6 12 Q9 9 12 12" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="9" cy="9" r="2" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'UnaryExpression'">
      <circle cx="9" cy="9" r="7" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M5 9 H13 M9 5 V13" stroke="currentColor" stroke-width="1" fill="none"/>
    </template>
    <template v-else-if="type === 'UpdateExpression'">
      <path d="M3 9 H15 M9 3 V15 M6 6 L12 12 M12 6 L6 12" fill="none" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'BinaryExpression'">
      <circle cx="5" cy="9" r="3" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="13" cy="9" r="3" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M8 9 H10" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'LogicalExpression'">
      <text x="9" y="11" font-size="6" fill="currentColor" text-anchor="middle">| |</text>
    </template>
    <template v-else-if="type === 'AssignmentExpression'">
      <path d="M3 9 H15 M7 6 L10 9 L7 12 M11 6 L14 9 L11 12" fill="none" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'ConditionalExpression'">
      <path d="M9 3 L17 9 L9 15 L1 9 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M5 9 H13 M9 5 V13" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'CallExpression'">
      <circle cx="9" cy="9" r="7" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M5 9 H13 M9 5 V13 M13 5 L5 13" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'NewExpression'">
      <circle cx="9" cy="9" r="7" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M5 9 H13 M9 5 V13" stroke="currentColor" stroke-width="1"/>
      <circle cx="9" cy="9" r="2" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'MemberExpression'">
      <rect x="3" y="3" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M3 7 H15 M7 7 V15" stroke="currentColor" stroke-width="1"/>
      <circle cx="11" cy="11" r="2" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'FunctionDeclaration'">
      <rect x="1" y="3" width="16" height="12" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M1 7 H17 M5 1 V5 M13 1 V5" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'VariableDeclaration'">
      <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="1"/>
      <text x="9" y="11" font-size="6" fill="currentColor" text-anchor="middle">var</text>
    </template>
    <template v-else-if="type === 'ClassDeclaration'">
      <rect x="1" y="1" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1" rx="3" ry="3"/>
      <path d="M1 5 H17 M5 5 V17 M13 5 V17" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'SwitchCase'">
      <path d="M1 5 H17 L9 17 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M5 5 V11 H13" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'CatchClause'">
      <path d="M1 9 Q9 3 17 9 Q9 15 1 9" fill="none" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'PropertyDefinition'">
      <rect x="3" y="3" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M3 7 H15 M9 7 V15" stroke="currentColor" stroke-width="1"/>
      <circle cx="6" cy="11" r="2" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'ExpressionStatement'">
      <path d="M3 3 H15 V15 H3 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M3 9 H15 M7 5 L11 13 M11 5 L7 13" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'BlockStatement'">
      <path d="M3 3 H15 V15 H3 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M6 6 H12 M6 9 H12 M6 12 H12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'EmptyStatement'">
      <circle cx="9" cy="9" r="7" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M6 9 H12" stroke="currentColor" stroke-width="2"/>
    </template>
    <template v-else-if="type === 'DebuggerStatement'">
      <path d="M3 3 H15 V15 H3 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M3 9 H15 M9 3 V15 M6 6 L12 12 M12 6 L6 12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'ReturnStatement'">
      <path d="M3 3 H15 V15 H3 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M12 9 H6 M6 6 L3 9 L6 12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'LabeledStatement'">
      <path d="M3 3 H15 V15 H3 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M3 7 H15" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'BreakStatement'">
      <path d="M3 9 H15 M9 3 V15 M6 6 L12 12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'ContinueStatement'">
      <path d="M3 3 H15 V15 H3 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M3 9 H12 M9 6 L12 9 L9 12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'IfStatement'">
      <path d="M9 3 L17 9 L9 15 L1 9 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M9 7 V11 M9 13 V13.5" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'SwitchStatement'">
      <path d="M3 3 H15 V15 H3 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M3 7 H15 M3 11 H15 M7 3 V15" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'ThrowStatement'">
      <path d="M9 3 L17 15 H1 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M9 6 V10 M9 12 V12.5" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TryStatement'">
      <text x="9" y="6" font-size="4" fill="currentColor" text-anchor="middle">try</text>
      <text x="9" y="10" font-size="4" fill="currentColor" text-anchor="middle">catch</text>
      <text x="9" y="14" font-size="4" fill="currentColor" text-anchor="middle">finally</text>
    </template>
    <template v-else-if="type === 'WhileStatement'">
      <circle cx="9" cy="9" r="7" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M5 9 A4 4 0 0 1 13 9 A4 4 0 0 1 5 9" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M9 5 V9 H13" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'DoWhileStatement'">
      <circle cx="9" cy="9" r="7" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M5 9 A4 4 0 0 0 13 9 A4 4 0 0 0 5 9" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M9 13 V9 H5" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'ForStatement'">
      <rect x="3" y="3" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M5 7h8M5 11h8" stroke="currentColor" stroke-width="1"/>
      <path d="M7 5v8M11 5v8" stroke="currentColor" stroke-width="1"/>
      <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'ForInStatement'">
      <rect x="3" y="3" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M5 9h8" stroke="currentColor" stroke-width="1"/>
      <path d="M7 6l2 3-2 3M11 6l2 3-2 3" stroke="currentColor" stroke-width="1" fill="none"/>
    </template>
    <template v-else-if="type === 'ForOfStatement'">
      <rect x="3" y="3" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M5 9h8" stroke="currentColor" stroke-width="1"/>
      <circle cx="7" cy="9" r="1.5" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="11" cy="9" r="1.5" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M7 6v6M11 6v6" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'WithStatement'">
      <text x="9" y="11" font-size="6" fill="currentColor" text-anchor="middle">with</text>
    </template>
    <template v-else-if="type === 'VariableDeclarator'">
      <path d="M3 9 H15" stroke="currentColor" stroke-width="1"/>
      <circle cx="6" cy="9" r="3" fill="none" stroke="currentColor" stroke-width="1"/>
      <text x="12" y="11" font-size="6" fill="currentColor" text-anchor="middle">=</text>
    </template>
    <template v-else-if="type === 'ImportDeclaration'">
      <path d="M3 3 H15 V15 H3 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M9 3 V15 M3 9 H9 M7 7 L9 9 L7 11" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'ImportSpecifier'">
      <path d="M3 6 H15 V12 H3 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <text x="9" y="10" font-size="4" fill="currentColor" text-anchor="middle">as</text>
    </template>
    <template v-else-if="type === 'ImportDefaultSpecifier'">
      <path d="M3 6 H15 V12 H3 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M3 9 H15" stroke="currentColor" stroke-width="1"/>
      <text x="9" y="11" font-size="4" fill="currentColor" text-anchor="middle">default</text>
    </template>
    <template v-else-if="type === 'ImportNamespaceSpecifier'">
      <path d="M3 6 H15 V12 H3 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <text x="6" y="11" font-size="4" fill="currentColor" text-anchor="middle">*</text>
      <text x="12" y="10" font-size="4" fill="currentColor" text-anchor="middle">as</text>
    </template>
    <template v-else-if="type === 'ExportAllDeclaration'">
      <path d="M3 3 H15 V15 H3 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M9 3 V15 M9 9 H15 M11 7 L9 9 L11 11" stroke="currentColor" stroke-width="1"/>
      <text x="6" y="9" font-size="6" fill="currentColor" text-anchor="middle">*</text>
    </template>
    <template v-else-if="type === 'ExportDefaultDeclaration'">
      <path d="M3 3 H15 V15 H3 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M9 3 V15 M9 9 H15 M11 7 L9 9 L11 11" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'ExportNamedDeclaration'">
      <path d="M3 3 H15 V15 H3 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M9 3 V15 M9 9 H15 M11 7 L9 9 L11 11" stroke="currentColor" stroke-width="1"/>
      <text x="6" y="11" font-size="6" fill="currentColor" text-anchor="middle">{}</text>
    </template>
    <template v-else-if="type === 'ExportSpecifier'">
      <path d="M3 6 H15 V12 H3 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M7 6 V12 M11 6 V12" stroke="currentColor" stroke-width="1"/>
      <text x="9" y="10" font-size="4" fill="currentColor" text-anchor="middle">as</text>
    </template>
    <template v-else-if="type === 'MethodDefinition'">
      <rect x="3" y="3" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M3 7 H15" stroke="currentColor" stroke-width="1"/>
      <text x="9" y="12" font-size="6" fill="currentColor" text-anchor="middle">fn()</text>
    </template>
    <template v-else-if="type === 'ClassBody'">
      <rect x="3" y="3" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1" rx="2" ry="2"/>
      <path d="M3 7 H15 M7 7 V15" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'ObjectPattern'">
      <path d="M3 6 Q9 3 15 6 V12 Q9 15 3 12 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M6 9 H12 M9 6 V12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'ArrayPattern'">
      <path d="M6 3 H12 V15 H6 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M6 7 H12 M6 11 H12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'RestElement'">
      <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M5 9 H13 M5 7 Q9 13 13 7" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'AssignmentPattern'">
      <path d="M3 9 H15 M7 6 L10 9 L7 12 M11 6 L14 9 L11 12" fill="none" stroke="currentColor" stroke-width="1"/>
      <circle cx="5" cy="9" r="2" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'SpreadElement'">
      <path d="M3 9 H15 M5 6 Q9 12 13 6 M5 12 Q9 6 13 12" fill="none" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'Property'">
      <rect x="3" y="3" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M3 9 H15 M9 3 V15" stroke="currentColor" stroke-width="1"/>
      <circle cx="6" cy="6" r="2" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'PrivateIdentifier'">
      <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="1"/>
      <text x="9" y="12" font-size="8" fill="currentColor" text-anchor="middle">#</text>
    </template>
    <template v-else-if="type === 'JSXElement'">
      <text x="9" y="11" font-size="6" fill="currentColor" text-anchor="middle">JSX</text>
    </template>
    <template v-else-if="type === 'JSXOpeningElement'">
      <path d="M3 9 L9 3 L15 9 H3 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <text x="9" y="8" font-size="6" fill="currentColor" text-anchor="middle">JSX</text>
    </template>
    <template v-else-if="type === 'JSXClosingElement'">
      <path d="M3 9 H15 L9 15 L3 9 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <text x="9" y="13" font-size="6" fill="currentColor" text-anchor="middle">JSX</text>
    </template>
    <template v-else-if="type === 'JSXAttribute'">
      <rect x="3" y="5" width="12" height="8" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M9 5 V13" stroke="currentColor" stroke-width="1"/>
      <text x="6" y="10" font-size="4" fill="currentColor" text-anchor="middle">attr</text>
    </template>
    <template v-else-if="type === 'JSXSpreadAttribute'">
      <rect x="3" y="5" width="12" height="8" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M5 9 H11 M5 7 Q8 11 11 7 M5 11 Q8 7 11 11" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'JSXText'">
      <rect x="3" y="5" width="12" height="8" fill="none" stroke="currentColor" stroke-width="1"/>
      <path d="M5 9 H13 M7 7 V11 M11 7 V11" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'JSXExpressionContainer'">
      <path d="M3 6 Q9 3 15 6 V12 Q9 15 3 12 Z" fill="none" stroke="currentColor" stroke-width="1"/>
      <text x="9" y="11" font-size="6" fill="currentColor" text-anchor="middle">{}</text>
    </template>
    <template v-else-if="type === 'JSXFragment'">
      <text x="9" y="11" font-size="6" fill="currentColor" text-anchor="middle">Frag</text>
    </template>
    <template v-else-if="type === 'JSXOpeningFragment'">
      <path d="M3 6 H15 M3 12 H15 M6 6 V12" fill="none" stroke="currentColor" stroke-width="1"/>
      <text x="12" y="11" font-size="6" fill="currentColor" text-anchor="middle">&lt;</text>
    </template>
    <template v-else-if="type === 'JSXClosingFragment'">
      <path d="M3 6 H15 M3 12 H15 M12 6 V12" fill="none" stroke="currentColor" stroke-width="1"/>
      <text x="6" y="11" font-size="6" fill="currentColor" text-anchor="middle">/&gt;</text>
    </template>
    <template v-else-if="type === 'TSTypeAnnotation'">
      <path d="M3 9h12M9 3v12" stroke="currentColor" stroke-width="1" fill="none"/>
      <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1" fill="none"/>
    </template>
    <template v-else-if="type === 'TSTypeParameterDeclaration'">
      <path d="M3 6h12v6H3z" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M6 6v6M10 6v6" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSTypeParameterInstantiation'">
      <path d="M3 6h12v6H3z" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M6 6v6M10 6v6" stroke="currentColor" stroke-width="1"/>
      <circle cx="8" cy="9" r="1" fill="currentColor"/>
      <circle cx="12" cy="9" r="1" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'TSParameterProperty'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 9h12M7 3v12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSDeclareFunction'">
      <path d="M3 6h12v6H3z" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M7 3v12M11 3v12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSDeclareMethod'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 7h12M7 7v8" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSQualifiedName'">
      <path d="M3 9h12" stroke="currentColor" stroke-width="1" fill="none"/>
      <circle cx="6" cy="9" r="3" stroke="currentColor" stroke-width="1" fill="none"/>
      <circle cx="12" cy="9" r="3" stroke="currentColor" stroke-width="1" fill="none"/>
    </template>
    <template v-else-if="type === 'TSCallSignatureDeclaration'">
      <path d="M3 6h12v6H3z" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M6 6v6M10 6v6" stroke="currentColor" stroke-width="1"/>
      <circle cx="3" cy="9" r="2" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'TSConstructSignatureDeclaration'">
      <path d="M3 6h12v6H3z" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M6 6v6M10 6v6" stroke="currentColor" stroke-width="1"/>
      <path d="M3 9l3-3v6z" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'TSPropertySignature'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 9h12" stroke="currentColor" stroke-width="1"/>
      <circle cx="7" cy="6" r="2" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'TSMethodSignature'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 9h12M9 3v12" stroke="currentColor" stroke-width="1"/>
      <circle cx="6" cy="6" r="2" fill="none" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSIndexSignature'">
      <path d="M3 6h12v6H3z" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M7 3v12" stroke="currentColor" stroke-width="1"/>
      <path d="M3 9h8" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSAnyKeyword'">
      <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M5 9h8M9 5v8" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSBooleanKeyword'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M6 9h6M9 6v6" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSNeverKeyword'">
      <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M6 12l6-6M6 6l6 6" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSNullKeyword'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 3l12 12M15 3l-12 12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSNumberKeyword'">
      <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M6 7h6M6 11h6" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSObjectKeyword'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 7h12M3 11h12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSStringKeyword'">
      <path d="M3 6h12v6H3z" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M5 9h8" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSSymbolKeyword'">
      <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M6 7l6 4M6 11l6-4" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSUndefinedKeyword'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 15l12-12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSUnknownKeyword'">
      <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M7 7l4 4M11 7l-4 4" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSVoidKeyword'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
    </template>
    <template v-else-if="type === 'TSThisType'">
      <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1" fill="none"/>
      <circle cx="9" cy="9" r="2" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'TSFunctionType'">
      <path d="M3 6h12v6H3z" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M7 6v6M11 6v6" stroke="currentColor" stroke-width="1"/>
      <circle cx="9" cy="9" r="2" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'TSConstructorType'">
      <path d="M3 6h12v6H3z" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M7 6v6M11 6v6" stroke="currentColor" stroke-width="1"/>
      <path d="M9 4l3 2h-6z" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'TSTypeReference'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 9h12M9 3v12" stroke="currentColor" stroke-width="1"/>
      <circle cx="9" cy="9" r="2" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'TSTypePredicate'">
      <path d="M3 6h12v6H3z" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 9h12M9 6v6" stroke="currentColor" stroke-width="1"/>
      <circle cx="6" cy="7.5" r="1" fill="currentColor"/>
      <circle cx="12" cy="10.5" r="1" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'TSTypeQuery'">
      <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M6 9h6M9 6v6" stroke="currentColor" stroke-width="1"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'TSTypeLiteral'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 7h12M3 11h12M7 3v12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSArrayType'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 7h12M3 11h12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSTupleType'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M7 3v12M11 3v12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSOptionalType'">
      <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M6 9h6" stroke="currentColor" stroke-width="1"/>
      <circle cx="12" cy="9" r="1.5" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'TSRestType'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 9h12" stroke="currentColor" stroke-width="1"/>
      <path d="M6 6q3 6 6 0" stroke="currentColor" stroke-width="1" fill="none"/>
    </template>
    <template v-else-if="type === 'TSUnionType'">
      <circle cx="6" cy="9" r="3" stroke="currentColor" stroke-width="1" fill="none"/>
      <circle cx="12" cy="9" r="3" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M9 9h0.1" stroke="currentColor" stroke-width="2"/>
    </template>
    <template v-else-if="type === 'TSIntersectionType'">
      <circle cx="6" cy="9" r="3" stroke="currentColor" stroke-width="1" fill="none"/>
      <circle cx="12" cy="9" r="3" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M9 9h0.1" stroke="currentColor" stroke-width="2"/>
      <path d="M6 9h6" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSConditionalType'">
      <path d="M9 3L3 9l6 6 6-6z" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M6 9h6M9 6v6" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSInferType'">
      <path d="M3 6h12v6H3z" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 9h12" stroke="currentColor" stroke-width="1"/>
      <path d="M9 6l-3 3 3 3" stroke="currentColor" stroke-width="1" fill="none"/>
    </template>
    <template v-else-if="type === 'TSParenthesizedType'">
      <path d="M6 3q-3 3 0 12M12 3q3 3 0 12" stroke="currentColor" stroke-width="1" fill="none"/>
    </template>
    <template v-else-if="type === 'TSTypeOperator'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 9h12M9 3v12" stroke="currentColor" stroke-width="1"/>
      <circle cx="9" cy="9" r="2" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'TSIndexedAccessType'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 9h12" stroke="currentColor" stroke-width="1"/>
      <path d="M9 3v12" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/>
    </template>
    <template v-else-if="type === 'TSMappedType'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 7h12M3 11h12" stroke="currentColor" stroke-width="1"/>
      <path d="M7 3v12" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/>
    </template>
    <template v-else-if="type === 'TSLiteralType'">
      <polygon points="9,3 15,9 9,15 3,9" stroke="currentColor" stroke-width="1" fill="none"/>
      <circle cx="9" cy="9" r="2" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'TSExpressionWithTypeArguments'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 9h12" stroke="currentColor" stroke-width="1"/>
      <path d="M9 3v12" stroke="currentColor" stroke-width="1"/>
      <circle cx="6" cy="6" r="1.5" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'TSInterfaceDeclaration'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none" rx="2" ry="2"/>
      <path d="M3 7h12" stroke="currentColor" stroke-width="1"/>
      <path d="M7 7v8" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSInterfaceBody'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none" rx="2" ry="2"/>
      <path d="M3 7h12M3 11h12" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSTypeAliasDeclaration'">
      <path d="M3 6h12v6H3z" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 9h12" stroke="currentColor" stroke-width="1"/>
      <path d="M7 6v6" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/>
    </template>
    <template v-else-if="type === 'TSAsExpression'">
      <path d="M3 9h12" stroke="currentColor" stroke-width="1" fill="none"/>
      <circle cx="6" cy="9" r="3" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M11 6l3 3-3 3" stroke="currentColor" stroke-width="1" fill="none"/>
    </template>
    <template v-else-if="type === 'TSTypeAssertion'">
      <path d="M3 9h12" stroke="currentColor" stroke-width="1" fill="none"/>
      <circle cx="12" cy="9" r="3" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M7 6l-3 3 3 3" stroke="currentColor" stroke-width="1" fill="none"/>
    </template>
    <template v-else-if="type === 'TSEnumDeclaration'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 7h12M3 11h12" stroke="currentColor" stroke-width="1"/>
      <circle cx="6" cy="9" r="1" fill="currentColor"/>
      <circle cx="9" cy="9" r="1" fill="currentColor"/>
      <circle cx="12" cy="9" r="1" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'TSEnumMember'">
      <rect x="3" y="6" width="12" height="6" stroke="currentColor" stroke-width="1" fill="none"/>
      <circle cx="6" cy="9" r="1.5" fill="currentColor"/>
      <path d="M9 7v4" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSModuleDeclaration'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none" rx="2" ry="2"/>
      <path d="M3 7h12" stroke="currentColor" stroke-width="1"/>
      <path d="M6 7v8M10 7v8" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/>
    </template>
    <template v-else-if="type === 'TSModuleBlock'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none" rx="2" ry="2"/>
      <path d="M6 3v12M10 3v12" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/>
    </template>
    <template v-else-if="type === 'TSImportType'">
      <path d="M3 6h12v6H3z" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 9h12" stroke="currentColor" stroke-width="1"/>
      <path d="M9 6v6M12 7l-3 2 3 2" stroke="currentColor" stroke-width="1" fill="none"/>
    </template>
    <template v-else-if="type === 'TSImportEqualsDeclaration'">
      <path d="M3 6h12v6H3z" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 9h12" stroke="currentColor" stroke-width="1"/>
      <path d="M7 6v6M11 6v6" stroke="currentColor" stroke-width="1"/>
      <path d="M7 9h4" stroke="currentColor" stroke-width="1"/>
    </template>
    <template v-else-if="type === 'TSExternalModuleReference'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none" rx="2" ry="2"/>
      <path d="M3 9h12" stroke="currentColor" stroke-width="1"/>
      <path d="M9 3v12" stroke="currentColor" stroke-width="1" stroke-dasharray="2 2"/>
    </template>
    <template v-else-if="type === 'TSNonNullExpression'">
      <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M6 9h6M9 6v6" stroke="currentColor" stroke-width="1"/>
      <circle cx="9" cy="9" r="2" fill="currentColor"/>
    </template>
    <template v-else-if="type === 'TSExportAssignment'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none"/>
      <path d="M3 9h12" stroke="currentColor" stroke-width="1"/>
      <path d="M9 3v12" stroke="currentColor" stroke-width="1"/>
      <path d="M12 6l3 3-3 3" stroke="currentColor" stroke-width="1" fill="none"/>
    </template>
    <template v-else-if="type === 'TSNamespaceExportDeclaration'">
      <rect x="3" y="3" width="12" height="12" stroke="currentColor" stroke-width="1" fill="none" rx="2" ry="2"/>
      <path d="M3 7h12" stroke="currentColor" stroke-width="1"/>
      <path d="M7 7v8" stroke="currentColor" stroke-width="1"/>
      <path d="M12 10l3 2-3 2" stroke="currentColor" stroke-width="1" fill="none"/>
    </template>
  </svg>
</template>


<style scoped>
.node-type-icon {
  fill: currentColor;
}
</style>