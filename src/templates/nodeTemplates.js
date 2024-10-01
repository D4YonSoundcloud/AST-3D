// src/templates/nodeTemplates.js

export const nodeTemplates = {
    default: {
        name: "Default",
        nodeTypes: {
            // Default settings for each node type
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
        },
    },
    clarity: {
        name: "Clarity",
        nodeTypes: {
            Program: { color: 0x4A90E2, shape: 'sphere' },
            Identifier: { color: 0xF5A623, shape: 'tetrahedron' },
            Literal: { color: 0x7ED321, shape: 'octahedron' },

            // Declarations
            FunctionDeclaration: { color: 0xBD10E0, shape: 'cylinder' },
            VariableDeclaration: { color: 0x9013FE, shape: 'box' },
            ClassDeclaration: { color: 0xD0021B, shape: 'icosahedron' },

            // Expressions
            AssignmentExpression: { color: 0x4A4A4A, shape: 'dodecahedron' },
            BinaryExpression: { color: 0xF8E71C, shape: 'cone' },
            LogicalExpression: { color: 0x50E3C2, shape: 'torus' },
            UnaryExpression: { color: 0xB8E986, shape: 'sphere' },
            UpdateExpression: { color: 0x417505, shape: 'cylinder' },
            ConditionalExpression: { color: 0x9B9B9B, shape: 'box' },
            CallExpression: { color: 0xFF9500, shape: 'sphere' },
            NewExpression: { color: 0x00A699, shape: 'cylinder' },
            MemberExpression: { color: 0xE37100, shape: 'cone' },
            ArrayExpression: { color: 0x7B16FF, shape: 'box' },
            ObjectExpression: { color: 0x02CCB9, shape: 'icosahedron' },
            ArrowFunctionExpression: { color: 0xFF5A5F, shape: 'cylinder' },

            // Statements
            BlockStatement: { color: 0x00A699, shape: 'box' },
            ExpressionStatement: { color: 0xFF5A5F, shape: 'sphere' },
            IfStatement: { color: 0xFFB400, shape: 'dodecahedron' },
            SwitchStatement: { color: 0x007A87, shape: 'icosahedron' },
            ForStatement: { color: 0x8CE071, shape: 'torus' },
            WhileStatement: { color: 0x7B0051, shape: 'cylinder' },
            DoWhileStatement: { color: 0x00D1C1, shape: 'sphere' },
            TryStatement: { color: 0xFFAA91, shape: 'box' },
            CatchClause: { color: 0xB4A76C, shape: 'sphere' },
            ThrowStatement: { color: 0xFC642D, shape: 'tetrahedron' },
            ReturnStatement: { color: 0x4D5055, shape: 'octahedron' },

            // Declarations and Specifiers
            VariableDeclarator: { color: 0x6B7C93, shape: 'tetrahedron' },
            FunctionExpression: { color: 0xF7B733, shape: 'cylinder' },
            ClassExpression: { color: 0xDCE0E0, shape: 'icosahedron' },

            // Modules
            ImportDeclaration: { color: 0x00A699, shape: 'dodecahedron' },
            ExportDefaultDeclaration: { color: 0xFF5A5F, shape: 'cone' },
            ExportNamedDeclaration: { color: 0xFFB400, shape: 'torus' },

            // JSX (if applicable)
            JSXElement: { color: 0x61DAFB, shape: 'sphere' },
            JSXAttribute: { color: 0xFFD700, shape: 'box' },

            // Others
            TemplateLiteral: { color: 0xFC8181, shape: 'cylinder' },
            TaggedTemplateExpression: { color: 0xF6AD55, shape: 'sphere' },
            ThisExpression: { color: 0xC8B432, shape: 'tetrahedron' },
            Super: { color: 0x76E4F7, shape: 'octahedron' },
            AwaitExpression: { color: 0x9F7AEA, shape: 'cone' },
            YieldExpression: { color: 0xF687B3, shape: 'torus' },

            // Default for any unspecified node types
            default: { color: 0xCCCCCC, shape: 'sphere' }
            // Add more node types as needed
        }
    },
    performance: {
        name: "Performance",
        nodeTypes: {
            // Core elements
            Program: { color: 0x4285F4, shape: 'box' },
            Identifier: { color: 0x34A853, shape: 'box' },
            Literal: { color: 0xFBBC05, shape: 'box' },

            // Declarations
            FunctionDeclaration: { color: 0xEA4335, shape: 'box' },
            VariableDeclaration: { color: 0x4285F4, shape: 'box' },
            ClassDeclaration: { color: 0x34A853, shape: 'box' },

            // Expressions
            AssignmentExpression: { color: 0xFBBC05, shape: 'tetrahedron' },
            BinaryExpression: { color: 0xEA4335, shape: 'tetrahedron' },
            LogicalExpression: { color: 0x4285F4, shape: 'tetrahedron' },
            UnaryExpression: { color: 0x34A853, shape: 'tetrahedron' },
            UpdateExpression: { color: 0xFBBC05, shape: 'tetrahedron' },
            ConditionalExpression: { color: 0xEA4335, shape: 'tetrahedron' },
            CallExpression: { color: 0x4285F4, shape: 'tetrahedron' },
            NewExpression: { color: 0x34A853, shape: 'tetrahedron' },
            MemberExpression: { color: 0xFBBC05, shape: 'tetrahedron' },
            ArrayExpression: { color: 0xEA4335, shape: 'box' },
            ObjectExpression: { color: 0x4285F4, shape: 'box' },
            ArrowFunctionExpression: { color: 0x34A853, shape: 'box' },

            // Statements
            BlockStatement: { color: 0xFBBC05, shape: 'box' },
            ExpressionStatement: { color: 0xEA4335, shape: 'box' },
            IfStatement: { color: 0x4285F4, shape: 'box' },
            SwitchStatement: { color: 0x34A853, shape: 'box' },
            ForStatement: { color: 0xFBBC05, shape: 'box' },
            WhileStatement: { color: 0xEA4335, shape: 'box' },
            DoWhileStatement: { color: 0x4285F4, shape: 'box' },
            TryStatement: { color: 0x34A853, shape: 'box' },
            CatchClause: { color: 0xFBBC05, shape: 'box' },
            ThrowStatement: { color: 0xEA4335, shape: 'tetrahedron' },
            ReturnStatement: { color: 0x4285F4, shape: 'tetrahedron' },

            // Declarations and Specifiers
            VariableDeclarator: { color: 0x34A853, shape: 'tetrahedron' },
            FunctionExpression: { color: 0xFBBC05, shape: 'box' },
            ClassExpression: { color: 0xEA4335, shape: 'box' },

            // Modules
            ImportDeclaration: { color: 0x4285F4, shape: 'box' },
            ExportDefaultDeclaration: { color: 0x34A853, shape: 'box' },
            ExportNamedDeclaration: { color: 0xFBBC05, shape: 'box' },

            // JSX (if applicable)
            JSXElement: { color: 0xEA4335, shape: 'box' },
            JSXAttribute: { color: 0x4285F4, shape: 'tetrahedron' },

            // Others
            TemplateLiteral: { color: 0x34A853, shape: 'box' },
            TaggedTemplateExpression: { color: 0xFBBC05, shape: 'box' },
            ThisExpression: { color: 0xEA4335, shape: 'tetrahedron' },
            Super: { color: 0x4285F4, shape: 'tetrahedron' },
            AwaitExpression: { color: 0x34A853, shape: 'tetrahedron' },
            YieldExpression: { color: 0xFBBC05, shape: 'tetrahedron' },

            // Default for any unspecified node types
            default: { color: 0xCCCCCC, shape: 'box' }
        }
    },
    cyberpunk80s: {
        name: "Cyberpunk 80s",
        nodeTypes: {
            // Root
            Program: { color: 0x00FF00, shape: 'box' },

            // Identifiers and Literals
            Identifier: { color: 0x00FFFF, shape: 'octahedron' },
            Literal: { color: 0xFF00FF, shape: 'tetrahedron' },

            // Declarations
            FunctionDeclaration: { color: 0x008000, shape: 'cylinder' },
            VariableDeclaration: { color: 0x00FF7F, shape: 'dodecahedron' },
            ClassDeclaration: { color: 0xFF1493, shape: 'icosahedron' },

            // Expressions
            AssignmentExpression: { color: 0x7FFF00, shape: 'cone' },
            BinaryExpression: { color: 0x32CD32, shape: 'octahedron' },
            LogicalExpression: { color: 0x20B2AA, shape: 'dodecahedron' },
            UnaryExpression: { color: 0x00CED1, shape: 'tetrahedron' },
            UpdateExpression: { color: 0x40E0D0, shape: 'cone' },
            CallExpression: { color: 0x98FB98, shape: 'sphere' },
            NewExpression: { color: 0xADFF2F, shape: 'cylinder' },
            MemberExpression: { color: 0x90EE90, shape: 'torus' },
            ArrayExpression: { color: 0x00FA9A, shape: 'box' },
            ObjectExpression: { color: 0x48D1CC, shape: 'icosahedron' },
            ArrowFunctionExpression: { color: 0x66CDAA, shape: 'cylinder' },

            // Statements
            BlockStatement: { color: 0x3CB371, shape: 'box' },
            ExpressionStatement: { color: 0x2E8B57, shape: 'sphere' },
            IfStatement: { color: 0x00FF7F, shape: 'octahedron' },
            SwitchStatement: { color: 0x7CFC00, shape: 'dodecahedron' },
            ForStatement: { color: 0x7FFF00, shape: 'torus' },
            WhileStatement: { color: 0x00FF00, shape: 'cylinder' },
            DoWhileStatement: { color: 0x32CD32, shape: 'sphere' },
            TryStatement: { color: 0x98FB98, shape: 'box' },
            CatchClause: { color: 0x90EE90, shape: 'sphere' },
            ThrowStatement: { color: 0x00FA9A, shape: 'tetrahedron' },
            ReturnStatement: { color: 0x3CB371, shape: 'cone' },

            // Declarators and Specifiers
            VariableDeclarator: { color: 0x2E8B57, shape: 'octahedron' },
            FunctionExpression: { color: 0x008000, shape: 'cylinder' },
            ClassExpression: { color: 0x006400, shape: 'icosahedron' },

            // Modules
            ImportDeclaration: { color: 0x9ACD32, shape: 'box' },
            ExportDefaultDeclaration: { color: 0x6B8E23, shape: 'sphere' },
            ExportNamedDeclaration: { color: 0x556B2F, shape: 'cylinder' },

            // JSX
            JSXElement: { color: 0x00FF7F, shape: 'box' },
            JSXAttribute: { color: 0x7FFF00, shape: 'sphere' },

            // Others
            TemplateLiteral: { color: 0x00FA9A, shape: 'cylinder' },
            TaggedTemplateExpression: { color: 0x90EE90, shape: 'sphere' },
            ThisExpression: { color: 0x98FB98, shape: 'tetrahedron' },
            Super: { color: 0x00FF00, shape: 'octahedron' },
            AwaitExpression: { color: 0x32CD32, shape: 'cone' },
            YieldExpression: { color: 0x3CB371, shape: 'torus' },

            // Default
            default: { color: 0x008000, shape: 'sphere' }
        }
    },
    pastelRainbow: {
        name: "Pastel Rainbow",
        nodeTypes: {
            Program: { color: 0xFFB3BA, shape: 'sphere' },
            Identifier: { color: 0xFFDFBA, shape: 'sphere' },
            Literal: { color: 0xFFFFBA, shape: 'sphere' },
            FunctionDeclaration: { color: 0xBAFFBA, shape: 'sphere' },
            VariableDeclaration: { color: 0xBAFFFF, shape: 'sphere' },
            AssignmentExpression: { color: 0xBABAFF, shape: 'sphere' },
            BinaryExpression: { color: 0xFFBAFF, shape: 'sphere' },
            CallExpression: { color: 0xDFFFBA, shape: 'sphere' },
            MemberExpression: { color: 0xFFDFFF, shape: 'sphere' },
            IfStatement: { color: 0xBADFFF, shape: 'sphere' },
            ForStatement: { color: 0xFFBADF, shape: 'sphere' },
            ReturnStatement: { color: 0xDFBAFF, shape: 'sphere' },
            // Add more node types as needed
        }
    },
    highContrast: {
        name: "High Contrast",
        nodeTypes: {
            // Root
            Program: { color: 0xFFFFFF, shape: 'sphere' },

            // Identifiers and Literals
            Identifier: { color: 0x000000, shape: 'box' },
            Literal: { color: 0xFFFF00, shape: 'octahedron' },

            // Declarations
            FunctionDeclaration: { color: 0xFF0000, shape: 'cylinder' },
            VariableDeclaration: { color: 0x00FF00, shape: 'box' },
            ClassDeclaration: { color: 0x0000FF, shape: 'icosahedron' },

            // Expressions
            AssignmentExpression: { color: 0xFF00FF, shape: 'cone' },
            BinaryExpression: { color: 0x00FFFF, shape: 'octahedron' },
            LogicalExpression: { color: 0xFFFF00, shape: 'dodecahedron' },
            UnaryExpression: { color: 0xFF8000, shape: 'tetrahedron' },
            UpdateExpression: { color: 0x8000FF, shape: 'cone' },
            CallExpression: { color: 0x00FF80, shape: 'sphere' },
            NewExpression: { color: 0xFF0080, shape: 'cylinder' },
            MemberExpression: { color: 0x80FF00, shape: 'torus' },
            ArrayExpression: { color: 0x0080FF, shape: 'box' },
            ObjectExpression: { color: 0xFF8000, shape: 'icosahedron' },
            ArrowFunctionExpression: { color: 0x8000FF, shape: 'cylinder' },

            // Statements
            BlockStatement: { color: 0xFFFF00, shape: 'box' },
            ExpressionStatement: { color: 0x00FFFF, shape: 'sphere' },
            IfStatement: { color: 0xFF00FF, shape: 'octahedron' },
            SwitchStatement: { color: 0x80FF00, shape: 'dodecahedron' },
            ForStatement: { color: 0x0080FF, shape: 'torus' },
            WhileStatement: { color: 0xFF8000, shape: 'cylinder' },
            DoWhileStatement: { color: 0x8000FF, shape: 'sphere' },
            TryStatement: { color: 0x00FF80, shape: 'box' },
            CatchClause: { color: 0xFF0080, shape: 'sphere' },
            ThrowStatement: { color: 0xFFFF00, shape: 'tetrahedron' },
            ReturnStatement: { color: 0x00FFFF, shape: 'cone' },

            // Declarators and Specifiers
            VariableDeclarator: { color: 0xFF00FF, shape: 'octahedron' },
            FunctionExpression: { color: 0x80FF00, shape: 'cylinder' },
            ClassExpression: { color: 0x0080FF, shape: 'icosahedron' },

            // Modules
            ImportDeclaration: { color: 0xFF8000, shape: 'box' },
            ExportDefaultDeclaration: { color: 0x8000FF, shape: 'sphere' },
            ExportNamedDeclaration: { color: 0x00FF80, shape: 'cylinder' },

            // JSX
            JSXElement: { color: 0xFF0080, shape: 'box' },
            JSXAttribute: { color: 0xFFFF00, shape: 'sphere' },

            // Others
            TemplateLiteral: { color: 0x00FFFF, shape: 'cylinder' },
            TaggedTemplateExpression: { color: 0xFF00FF, shape: 'sphere' },
            ThisExpression: { color: 0x80FF00, shape: 'tetrahedron' },
            Super: { color: 0x0080FF, shape: 'octahedron' },
            AwaitExpression: { color: 0xFF8000, shape: 'cone' },
            YieldExpression: { color: 0x8000FF, shape: 'torus' },

            // Default
            default: { color: 0xFFFFFF, shape: 'sphere' }
        }
    },
    dataScientist: {
        name: "Data Scientist",
        nodeTypes: {
            Program: { color: 0x3776AB, shape: 'sphere' },  // Python blue
            Identifier: { color: 0xF7931E, shape: 'box' },  // Jupyter orange
            Literal: { color: 0x4CAF50, shape: 'octahedron' },  // Pandas green
            FunctionDeclaration: { color: 0xE10098, shape: 'cylinder' },  // NumPy pink
            VariableDeclaration: { color: 0x0071B5, shape: 'box' },  // R blue
            AssignmentExpression: { color: 0xFFC107, shape: 'icosahedron' },  // Scikit-learn yellow
            BinaryExpression: { color: 0xFF5722, shape: 'dodecahedron' },  // TensorFlow orange
            CallExpression: { color: 0x03A9F4, shape: 'torus' },  // Matplotlib light blue
            MemberExpression: { color: 0x9C27B0, shape: 'cone' },  // Seaborn purple
            IfStatement: { color: 0x795548, shape: 'sphere' },  // Keras brown
            ForStatement: { color: 0x607D8B, shape: 'cylinder' },  // SciPy grey
            ReturnStatement: { color: 0x8BC34A, shape: 'box' },  // Plotly green
            // Add more node types as needed
        }
    }
};