import * as THREE from 'three';
import { LOD } from 'three';
import {ref, shallowRef, watch} from 'vue';
import { getNodeConfig, NODE_TYPES, DEFAULT_NODE_TYPE } from '../assets/astNodeConfig';
import { Line2 } from "three/addons/lines/Line2.js";
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { useSettingsStore } from '../stores/settingsStore';
import { nodeTemplates } from "@/templates/nodeTemplates.js";
import { gsap } from "gsap";

const BASE_SPAWN_RANGE = 150;
const SCOPE_MULTIPLIER = 2;
const CHILD_SPAWN_RANGE = 150; // Range for spawning children around their parent
const VERTICAL_SPACING = 125; // Vertical spacing between scope levels

export function useAstVisualization(scene, graph) {
    const settingsStore = useSettingsStore();

    const visibleNodes = shallowRef(new Set());
    const visibleLinks = shallowRef(new Set());
    const nodesByType = shallowRef(new Map());
    const linksByType = shallowRef(new Map());
    const isTransitioning = ref(false);

    const meshPool = new Map();
    const linePool = [];

    const lodLevels = ref([
        { distance: 0, detail: 'high' },
        { distance: 50, detail: 'medium' },
        { distance: 150, detail: 'low' },
    ]);

    function getNodeConfig(type) {
        if (settingsStore.settings[type]) {
            return settingsStore.settings[type];
        }
        // If the specific type doesn't exist in current settings, check the default template
        if (nodeTemplates.default.nodeTypes[type]) {
            settingsStore.updateNodeTypeSetting(type, 'color', nodeTemplates.default.nodeTypes[type].color);
            settingsStore.updateNodeTypeSetting(type, 'shape', nodeTemplates.default.nodeTypes[type].shape);
            return nodeTemplates.default.nodeTypes[type];
        }
        // If still not found, return a default configuration
        console.warn(`No configuration found for node type: ${type}. Using default.`);
        return { color: 0x808080, shape: 'sphere' };
    }

    function createLODObject(nodeType, childrenCount) {
        const lod = new THREE.LOD();
        const nodeConfig = getNodeConfig(nodeType);

        lodLevels.value.forEach(level => {
            const mesh = createMeshForDetail(nodeType, childrenCount, level.detail);
            lod.addLevel(mesh, level.distance);
        });

        return lod;
    }

    function createMeshForDetail(nodeType, childrenCount, detailLevel) {
        const nodeConfig = getNodeConfig(nodeType);
        const geometry = createGeometryForDetail(nodeConfig.shape, childrenCount, detailLevel);
        const material = new THREE.MeshLambertMaterial({ color: nodeConfig.color });
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }

    function createGeometryForDetail(shape, childrenCount, detailLevel) {
        const size = Math.min(5 + childrenCount * 0.5);
        const segmentMultiplier = detailLevel === 'high' ? 0.5 : detailLevel === 'medium' ? 0.25 : 0.1;

        switch (shape) {
            case 'sphere':
                return new THREE.SphereGeometry(size * 0.7, Math.max(8, Math.floor(32 * segmentMultiplier)), Math.max(6, Math.floor(32 * segmentMultiplier)));
            case 'cube':
            case 'box':
                return new THREE.BoxGeometry(size, size, size);
            case 'tetrahedron':
                return new THREE.TetrahedronGeometry(size * 1.25, Math.floor(2 * segmentMultiplier));
            case 'octahedron':
                return new THREE.OctahedronGeometry(size * 1.25, Math.floor(2 * segmentMultiplier));
            case 'icosahedron':
                return new THREE.IcosahedronGeometry(size * 1.25, Math.floor(2 * segmentMultiplier));
            case 'capsule':
                return new THREE.CapsuleGeometry(size * 0.5, size, Math.max(4, Math.floor(16 * segmentMultiplier)), Math.max(8, Math.floor(32 * segmentMultiplier)));
            case 'cylinder':
                return new THREE.CylinderGeometry(size * 0.5, size * 0.5, size, Math.max(8, Math.floor(32 * segmentMultiplier)), Math.max(1, Math.floor(4 * segmentMultiplier)));
            case 'cone':
                return new THREE.ConeGeometry(size * 0.75, size, Math.max(8, Math.floor(32 * segmentMultiplier)), Math.max(1, Math.floor(4 * segmentMultiplier)));
            case 'torus':
                return new THREE.TorusGeometry(size * 0.5, size * 0.25, Math.max(8, Math.floor(16 * segmentMultiplier)), Math.max(6, Math.floor(24 * segmentMultiplier)));
            case 'dodecahedron':
                return new THREE.DodecahedronGeometry(size, Math.floor(2 * segmentMultiplier));
            case 'extrude':
                const shape = new THREE.Shape();
                shape.moveTo(0, 0);
                shape.lineTo(size, 0);
                shape.lineTo(size, size);
                shape.lineTo(0, size);
                shape.lineTo(0, 0);
                const extrudeSettings = {
                    steps: Math.max(1, Math.floor(4 * segmentMultiplier)),
                    depth: size * 0.5,
                    bevelEnabled: true,
                    bevelThickness: size * 0.1,
                    bevelSize: size * 0.05,
                    bevelSegments: Math.max(1, Math.floor(4 * segmentMultiplier))
                };
                return new THREE.ExtrudeGeometry(shape, extrudeSettings);
            default:
                return new THREE.SphereGeometry(size * 1.25, Math.max(8, Math.floor(32 * segmentMultiplier)), Math.max(6, Math.floor(32 * segmentMultiplier)));
        }
    }

    function getOrCreateMesh(type, childrenCount) {
        if (!meshPool.has(type)) {
            meshPool.set(type, []);
        }

        let lodObject;
        if (meshPool.get(type).length > 0) {
            lodObject = meshPool.get(type).pop();
            const nodeConfig = getNodeConfig(type);
            lodObject.levels.forEach(level => {
                level.object.geometry.dispose();
                level.object.geometry = createGeometryForDetail(nodeConfig.shape, childrenCount, getLODDetailLevel(level.distance));
                level.object.material.color.setHex(nodeConfig.color);
            });
        } else {
            lodObject = createLODObject(type, childrenCount);
        }

        const nodeConfig = getNodeConfig(type);
        lodObject.userData = {
            originalColor: nodeConfig.color,
            type: type
        };

        return lodObject;
    }

    function getOrCreateLine() {
        if (linePool.length > 0) {
            return linePool.pop();
        }

        const geometry = new LineGeometry();
        const material = new LineMaterial({
            color: settingsStore.linkColors.normal,
            linewidth: 1.5, // in pixels
            vertexColors: false,
            dashed: false,
            alphaToCoverage: true,
        });

        // Initialize the geometry with dummy positions
        geometry.setPositions(new Float32Array(6)); // 2 points * 3 coordinates each

        const line = new Line2(geometry, material);
        line.computeLineDistances();

        return line;
    }

    function updateLine(line, source, target) {
        if (!line || !line.geometry || !source || !target) {
            console.error('Invalid line, source, or target:', { line, source, target });
            return;
        }

        // Ensure the world matrices are up-to-date
        source.updateMatrixWorld(true);
        target.updateMatrixWorld(true);

        // Get the world positions of the source and target nodes
        const sourceWorldPos = new THREE.Vector3();
        const targetWorldPos = new THREE.Vector3();
        source.getWorldPosition(sourceWorldPos);
        target.getWorldPosition(targetWorldPos);

        const positions = new Float32Array([
            sourceWorldPos.x, sourceWorldPos.y, sourceWorldPos.z,
            targetWorldPos.x, targetWorldPos.y, targetWorldPos.z
        ]);

        try {
            line.geometry.setPositions(positions);
            line.computeLineDistances();
        } catch (error) {
            console.error('Error updating line geometry:', error);
        }

        // Update line color based on the current settings
        line.material.color.setHex(settingsStore.linkColors.normal);

        // Ensure the material is using the correct resolution
        line.material.resolution.set(window.innerWidth, window.innerHeight);
    }


    function updateMesh(lodObject, node) {
        let x, y, z;

        if (node.type === 'Program') {
            // Position the root node at the center
            x = 0;
            y = 0;
            z = 0;
        } else {
            const scopeMultiplier = Math.pow(SCOPE_MULTIPLIER, node.scopeLevel);
            const spawnRange = BASE_SPAWN_RANGE * scopeMultiplier;

            const randomAngle = Math.random() * Math.PI * 2;
            const randomRadius = Math.random() * spawnRange;

            x = Math.cos(randomAngle) * randomRadius;
            z = Math.sin(randomAngle) * randomRadius;
            y = -node.scopeLevel * VERTICAL_SPACING;

            // If the node has a parent, position it relative to the parent
            if (node.parent !== undefined) {
                const parentNode = graph.children.find(child => child.userData.id === node.parent);
                if (parentNode) {
                    const childAngle = Math.random() * Math.PI * 2;
                    const childRadius = Math.random() * CHILD_SPAWN_RANGE;

                    x = parentNode.position.x + Math.cos(childAngle) * childRadius;
                    z = parentNode.position.z + Math.sin(childAngle) * childRadius;
                }
            }
        }

        // Adjust vertical position based on the number of children
        y += 5 + node.children.length * (node.type === 'Program' ? 1.5 : 3);

        lodObject.position.set(x, y, z);

        lodObject.userData = {
            ...node,
            type: lodObject.userData.type,
            originalColor: lodObject.userData.originalColor
        };
    }

    function updateNodeSettings(nodeType) {
        const nodeSettings = settingsStore.settings[nodeType];
        if (nodeSettings) {
            graph.children.forEach(child => {
                if (child instanceof THREE.LOD && child.userData.type === nodeType) {
                    updateNodeGeometry(child, nodeSettings.shape, child.userData.children.length);
                    updateNodeColor(child, nodeSettings.color);
                }
            });
        }
    }

    function updateNodeGeometry(node, shape, childrenCount) {
        node.levels.forEach(level => {
            const oldGeometry = level.object.geometry;
            level.object.geometry = createGeometryForDetail(shape, childrenCount, getLODDetailLevel(level.distance));
            oldGeometry.dispose();
        });
    }

    function updateNodeColor(node, color) {
        node.levels.forEach(level => {
            level.object.material.color.setHex(color);
        });
        node.userData.originalColor = color;
    }

    function updateVisualization(nodes, links) {
        isTransitioning.value = true

        console.log('calling updateVisualization')
        const existingNodes = new Map(graph.children
            .filter(child => child instanceof LOD)
            .map(node => [node.userData.id, node]));

        // Clear existing collections
        nodesByType.value = new Map();
        linksByType.value = new Map();

        // Update or create nodes
        nodes.forEach(node => {
            let lodObject;
            if (existingNodes.has(node.id)) {
                lodObject = existingNodes.get(node.id);
                updateExistingMesh(lodObject, node);
            } else {
                lodObject = getOrCreateMesh(node.type, node.children.length);
                updateNewMesh(lodObject, node);
            }

            if (!nodesByType.value.has(node.type)) {
                nodesByType.value.set(node.type, new Set());
            }
            nodesByType.value.get(node.type).add(lodObject);

            if (!existingNodes.has(node.id)) {
                graph.add(lodObject);
            }
            existingNodes.delete(node.id);
        });

        // Remove nodes that no longer exist
        existingNodes.forEach(node => {
            graph.remove(node);
            returnMeshToPool(node);
        });

        graph.updateMatrixWorld(true);

        // Update links
        updateLinks(links);
        isTransitioning.value = false;
    }

    function updateExistingMesh(lodObject, node) {
        lodObject.userData = {
            ...node,
            type: lodObject.userData.type,
            originalColor: lodObject.userData.originalColor
        };
        const newPosition = calculateNodePosition(node);
        if (lodObject.position.distanceTo(newPosition) > 0.1) {
            lodObject.position.lerp(newPosition, 0.5); // Smooth transition
        }
    }

    function updateNewMesh(lodObject, node) {
        lodObject.position.copy(calculateNodePosition(node));
        lodObject.userData = {
            ...node,
            type: lodObject.userData.type,
            originalColor: lodObject.userData.originalColor
        };
    }

    function calculateNodePosition(node){
        const basePosition = new THREE.Vector3(0, 0, 0);

        if (settingsStore.modelType === 'city') {
            return calculateCityPosition(node, basePosition);
        } else if (settingsStore.modelType === 'tree') {
            return calculateTreePosition(node, basePosition);
        } else if (settingsStore.modelType === 'tree2d') {
            return calculateTree2DPosition(node, basePosition);
        }

        // Default to city model if unknown type
        return calculateCityPosition(node, basePosition);
    }

    function calculateCityPosition(node, basePosition) {
        const scopeMultiplier = Math.pow(SCOPE_MULTIPLIER, node.scopeLevel);
        const spawnRange = BASE_SPAWN_RANGE * scopeMultiplier;

        const randomAngle = Math.random() * Math.PI * 2;
        const randomRadius = Math.random() * spawnRange;

        basePosition.x = Math.cos(randomAngle) * randomRadius;
        basePosition.z = Math.sin(randomAngle) * randomRadius;
        basePosition.y = (-node.scopeLevel * VERTICAL_SPACING) + (5 + node.children.length * (node.type === 'Program' ? 1.5 : 3));

        // If the node has a parent, position it relative to the parent
        if (node.parent !== undefined) {
            const parentNode = graph.children.find(child => child.userData.id === node.parent);
            if (parentNode) {
                const childAngle = Math.random() * Math.PI * 2;
                const childRadius = Math.random() * CHILD_SPAWN_RANGE;

                basePosition.x = parentNode.position.x + Math.cos(childAngle) * childRadius;
                basePosition.z = parentNode.position.z + Math.sin(childAngle) * childRadius;
            }
        }

        if (node.type === 'Program') {
            basePosition.x = 0;
            basePosition.z = 0;
            basePosition.y = (-node.scopeLevel * VERTICAL_SPACING) + (50 + node.children.length * 1.5);
        }

        return basePosition;
    }

    function calculateTreePosition(node, basePosition) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 50 + Math.random() * 100; // Adjust these values as needed

        basePosition.x = Math.cos(angle) * radius;
        basePosition.z = Math.sin(angle) * radius;
        basePosition.y = -node.scopeLevel * 50; // Adjust vertical spacing as needed

        if (node.parent) {
            const parentNode = graph.children.find(child => child.userData.id === node.parent);
            if (parentNode) {
                basePosition.add(parentNode.position);
            }
        }


        return basePosition;
    }

    function calculateTree2DPosition(node, basePosition) {
        const HORIZONTAL_SPACING_2D = 60;
        const VERTICAL_SPACING_2D = 100;

        if (node.type === 'Program') {
            basePosition.set(0, 0, 0);
        } else {
            const parentNode = graph.children.find(child => child instanceof THREE.LOD && child.userData.id === node.parent);
            if (parentNode) {
                const siblingIndex = parentNode.userData.children.indexOf(node.id);
                const siblingCount = parentNode.userData.children.length;

                basePosition.x = parentNode.position.x + (siblingIndex - (siblingCount - 1) / 2) * HORIZONTAL_SPACING_2D;
                basePosition.y = parentNode.position.y - VERTICAL_SPACING_2D;
                basePosition.z = parentNode.position.z;
            } else {
                // If parent not found, use a fallback position
                const randomOffset = (Math.random() - 0.5) * 75;
                basePosition.set(randomOffset, -node.scopeLevel * VERTICAL_SPACING_2D, randomOffset);
            }
        }

        return basePosition;
    }

    function recalculateAllNodePositions() {
        isTransitioning.value = true;

        // Hide all lines
        graph.children.forEach(child => {
            if (child instanceof Line2) {
                child.visible = false;
            }
        });

        const animations = [];

        graph.children.forEach(child => {
            if (child instanceof THREE.LOD) {
                const newPosition = calculateNodePosition(child.userData);

                // Immediately set the position for layout calculation
                child.position.copy(newPosition);

                // Then animate from the old position to the new position
                const oldPosition = child.userData.oldPosition || child.position.clone();
                child.position.copy(oldPosition);

                const animation = new Promise(resolve => {
                    gsap.to(child.position, {
                        x: newPosition.x,
                        y: newPosition.y,
                        z: newPosition.z,
                        duration: 0,
                        onComplete: resolve
                    });

                    // child.position.x = newPosition.x
                    // child.position.y = newPosition.y
                    // child.position.z = newPosition.z
                });

                animations.push(animation);

                // Store the new position for the next transition
                child.userData.oldPosition = newPosition.clone();
            }
        });

        return Promise.all(animations).then(() => {
            // Update and show all lines after all nodes have been repositioned
            graph.children.forEach(child => {
                if (child instanceof Line2) {
                    updateLine(child, child.userData.source, child.userData.target);
                    child.visible = true;
                }
            });
            isTransitioning.value = false;
        });
    }

    function updateLinks(links) {
        const existingLines = new Map(graph.children
            .filter(child => child instanceof Line2)
            .map(line => [`${line.userData.source.userData.id}-${line.userData.target.userData.id}`, line]));

        links.forEach(link => {
            const sourceLOD = graph.children.find(child => child.userData.id === link.source);
            const targetLOD = graph.children.find(child => child.userData.id === link.target);

            if (sourceLOD && targetLOD) {
                const lineKey = `${link.source}-${link.target}`;
                let line;

                if (existingLines.has(lineKey)) {
                    line = existingLines.get(lineKey);
                    existingLines.delete(lineKey);
                } else {
                    line = getOrCreateLine();
                    graph.add(line);
                }

                updateLine(line, sourceLOD, targetLOD);
                line.userData.source = sourceLOD;
                line.userData.target = targetLOD;
                line.userData.relationshipType = link.type || 'other';
                line.visible = sourceLOD.visible && targetLOD.visible;

                const sourceType = sourceLOD.userData.type;
                const targetType = targetLOD.userData.type;

                if (!linksByType.value.has(sourceType)) {
                    linksByType.value.set(sourceType, new Set());
                }
                if (!linksByType.value.has(targetType)) {
                    linksByType.value.set(targetType, new Set());
                }
                linksByType.value.get(sourceType).add(line);
                linksByType.value.get(targetType).add(line);
            }
        });

        // Remove lines that no longer exist
        existingLines.forEach(line => {
            graph.remove(line);
            returnLineToPool(line);
        });
    }


    function updateVisibility(visibleNodeTypes) {
        console.log('calling update visibility');
        nodesByType.value.forEach((nodes, type) => {
            const isVisible = visibleNodeTypes.has(type);
            nodes.forEach(node => {
                node.visible = isVisible;
            });
        });

        graph.children.forEach(child => {
            if (child instanceof Line2) {
                const sourceVisible = child.userData.source.visible;
                const targetVisible = child.userData.target.visible;
                child.visible = sourceVisible && targetVisible;
            }
        });
    }

    function returnMeshToPool(mesh) {
        const type = mesh.userData.type;
        if (!meshPool.has(type)) {
            meshPool.set(type, []);
        }
        meshPool.get(type).push(mesh);
    }

    function returnLineToPool(line) {
        linePool.push(line);
    }

    function getLODDetailLevel(distance) {
        for (let i = lodLevels.value.length - 1; i >= 0; i--) {
            if (distance >= lodLevels.value[i].distance) {
                return lodLevels.value[i].detail;
            }
        }
        return 'high';
    }

    return {
        updateVisualization,
        updateVisibility,
        updateNodeSettings,
        recalculateAllNodePositions,
        isTransitioning,
        visibleNodes,
        visibleLinks,
        nodesByType,
        linksByType,
    };
}