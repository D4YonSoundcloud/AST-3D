import * as acorn from 'acorn';

export function analyzeCode(code, astStore) {
    let ast;
    const nodes = [];
    const links = [];
    let nodeId = 0;
    let scopeLevel = 0;

    // Parse the code only once
    try {
        ast = acorn.parse(code, {
            ecmaVersion: 2020,
            sourceType: 'module',
            locations: true
        });
    } catch (e) {
        // If 'module' parsing fails, try 'script' parsing
        try {
            ast = acorn.parse(code, {
                ecmaVersion: 2020,
                sourceType: 'script',
                locations: true
            });
        } catch (e) {
            console.error("Failed to parse code:", e);
            return { ast: null, nodes: [], links: [] };
        }
    }

    function addNode(node, parent) {
        // Check if the node has already been added
        if (nodes.some(n => n.id === nodeId)) {
            console.warn(`Node with id ${nodeId} already exists. Skipping.`);
            return nodeId;
        }

        const nodeObj = {
            id: `node_${nodeId++}`,
            type: node.type,
            loc: node.loc,
            parent: parent,
            children: [],
            dependencies: [],
            scopeLevel: scopeLevel
        };

        switch (node.type) {
            case 'FunctionDeclaration':
            case 'FunctionExpression':
                nodeObj.name = node.id ? node.id.name : 'anonymous';
                nodeObj.params = node.params.map(p => p.name);
                break;
            case 'VariableDeclaration':
                nodeObj.kind = node.kind;
                nodeObj.declarations = node.declarations.map(d => ({
                    name: d.id.name,
                    init: d.init ? d.init.type : null
                }));
                break;
            case 'Identifier':
                nodeObj.name = node.name;
                break;
        }

        nodes.push(nodeObj);
        if (parent !== undefined) {
            links.push({ source: parent, target: nodeObj.id, type: 'parent-child' });
            const parentNode = nodes.find(n => n.id === parent);
            if (parentNode) {
                parentNode.children.push(nodeObj.id);
            }
        }

        return nodeObj.id;
    }

    function traverse(node, parent) {
        const currentId = addNode(node, parent);

        if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
            scopeLevel++;
        }

        for (const key in node) {
            if (node[key] && typeof node[key] === 'object') {
                if (Array.isArray(node[key])) {
                    node[key].forEach(child => {
                        if (child && typeof child === 'object' && 'type' in child) {
                            traverse(child, currentId);
                        }
                    });
                } else if ('type' in node[key]) {
                    traverse(node[key], currentId);
                }
            }
        }

        if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
            scopeLevel--;
        }
    }

    function findDeclaration(name, scopeLevel) {
        for (let level = scopeLevel; level >= 0; level--) {
            const declaration = nodes.find(n =>
                n.scopeLevel === level &&
                (n.type === 'VariableDeclaration' || n.type === 'FunctionDeclaration') &&
                (n.name === name || (n.declarations && n.declarations.some(d => d.name === name)))
            );
            if (declaration) return declaration;
        }
        return null;
    }

    traverse(ast);

    // Analyze dependencies
    nodes.forEach(node => {
        if (node.type === 'Identifier') {
            const declaration = findDeclaration(node.name, node.scopeLevel);
            if (declaration && declaration.id !== node.id) {
                node.dependencies.push(declaration.id);
                links.push({ source: node.id, target: declaration.id, type: 'dependency' });
            }
        }
    });


    // Update the store
    astStore.setAst(ast);
    astStore.setNodes(nodes);
    astStore.setLinks(links);
    // Update the currentAstNodeTypes in the store
    astStore.setCurrentAstNodeTypes(new Set(nodes.map(node => node.type)));

    console.log(`Analyzed AST: ${nodes.length} nodes, ${links.length} links`);

    return { ast, nodes, links};
}