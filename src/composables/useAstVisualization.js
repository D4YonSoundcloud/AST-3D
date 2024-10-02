import * as THREE from 'three';
import { LOD } from 'three';
import {ref, shallowRef, watch} from 'vue';
import { getNodeConfig, NODE_TYPES, DEFAULT_NODE_TYPE } from '../assets/astNodeConfig';
import { useSettingsStore } from '../stores/settingsStore';
import { nodeTemplates } from "@/templates/nodeTemplates.js";

export function useAstVisualization(scene, graph) {
    const settingsStore = useSettingsStore();

    const visibleNodes = shallowRef(new Set());
    const visibleLinks = shallowRef(new Set());
    const nodesByType = shallowRef(new Map());
    const linksByType = shallowRef(new Map());

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
        const size = Math.min(2 + childrenCount * 0.5, 10);
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

        const material = new THREE.LineBasicMaterial({
            color: settingsStore.linkColors.normal,
            lineWidth: 0.1,
        });
        material.depthTest = true;
        material.depthWrite = false;

        const geometry = new THREE.BufferGeometry();
        return new THREE.Line(geometry, material);
    }

    function updateLine(line, source, target) {
        const geometry = line.geometry;
        const positions = new Float32Array([
            source.position.x, source.position.y, source.position.z,
            target.position.x, target.position.y, target.position.z
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.computeBoundingSphere();

        // Update line color based on the current settings
        line.material.color.setHex(settingsStore.linkColors.normal);
    }

    function updateMesh(lodObject, node) {
        lodObject.position.set(
            (Math.random() - 0.5) * 225,
            node.type === 'Program' ?
                -node.scopeLevel * 100 + Math.random() * 5 + (5 + (node.children.length * 1.5)) :
                -node.scopeLevel * 100 + Math.random() * 5 + (5 + (node.children.length * 3)),
            (Math.random() - 0.5) * 225
        );
        lodObject.userData = { ...node, type: lodObject.userData.type, originalColor: lodObject.userData.originalColor };
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
        // Clear existing collections
        nodesByType.value = new Map();
        linksByType.value = new Map();

        // Remove old objects from the scene
        while(graph.children.length > 0) {
            const object = graph.children[0];
            graph.remove(object);
            if (object instanceof LOD) {
                returnMeshToPool(object);
            } else if (object instanceof THREE.Line) {
                returnLineToPool(object);
            }
        }

        // Create or update nodes
        nodes.forEach(node => {
            const lodObject = getOrCreateMesh(node.type, node.children.length);
            updateMesh(lodObject, node);
            if (!nodesByType.value.has(node.type)) {
                nodesByType.value.set(node.type, new Set());
            }
            nodesByType.value.get(node.type).add(lodObject);
            graph.add(lodObject);
        });

        // Create or update links
        links.forEach(link => {
            const sourceLOD = graph.children.find(child => child.userData.id === link.source);
            const targetLOD = graph.children.find(child => child.userData.id === link.target);

            if (sourceLOD && targetLOD) {
                const line = getOrCreateLine();
                updateLine(line, sourceLOD, targetLOD);
                line.userData.source = sourceLOD;
                line.userData.target = targetLOD;
                line.userData.relationshipType = link.type || 'other'; // Add relationship type

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

                graph.add(line);
            }
        });
        
        centerVisualization();
    }

    function updateVisibility(visibleNodeTypes) {
        nodesByType.value.forEach((nodes, type) => {
            const isVisible = visibleNodeTypes.has(type);
            nodes.forEach(node => {
                node.visible = isVisible;
            });
        });

        graph.children.forEach(child => {
            if (child instanceof THREE.Line) {
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
    function centerVisualization() {
        if (graph.children.length === 0) return;

        // Calculate the bounding box of all nodes
        const boundingBox = new THREE.Box3();
        graph.children.forEach(child => {
            if (child instanceof THREE.LOD) {
                boundingBox.expandByObject(child);
            }
        });

        const center = new THREE.Vector3();
        boundingBox.getCenter(center);

        // Move all nodes
        graph.children.forEach(child => {
            if (child instanceof THREE.LOD) {
                child.position.sub(center);
            }
        });

        // Update all links
        graph.children.forEach(child => {
            if (child instanceof THREE.Line) {
                const positions = child.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i] -= center.x;
                    positions[i + 1] -= center.y;
                    positions[i + 2] -= center.z;
                }
                child.geometry.attributes.position.needsUpdate = true;
            }
        });

        // Update the graph's world matrix
        graph.updateMatrixWorld(true);
    }

    return {
        updateVisualization,
        updateVisibility,
        updateNodeSettings,
        centerVisualization,
        visibleNodes,
        visibleLinks,
        nodesByType,
        linksByType,
    };
}