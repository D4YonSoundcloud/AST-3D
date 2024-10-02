import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';
import {LOD} from "three";
import {Frustum} from "three";
import { useSettingsStore } from '../stores/settingsStore';

export function useNodeInteractions(scene, camera, controls, graph, updateInfoPanel, renderer) {
    const settingsStore = useSettingsStore();

    const hoveredNode = ref(null);
    const selectedNode = ref(null);
    const originalCameraPosition = ref(null);
    const originalControlsTarget = ref(null);
    const isMovingCamera = ref(false);
    const isCameraAnimating = ref(false);
    const cursorType = ref('grab');

    const COLORS = {
        DEFAULT: 0xAAAAAA,
        SELECTED: 0x00FF00,
        HOVERED: 0x00FF00,
        HOVERED_NONCONNECTED: 0xFFA500
    };


    function updateCamera(camera, controls) {
        if (camera && controls.value && controls.value.target) {
            originalCameraPosition.value = camera.position.clone();
            originalControlsTarget.value = controls.value.target.clone();
        }
    }

    function onMouseMove(event) {
        if (isMovingCamera.value || isCameraAnimating.value) {
            // updateEdgeHighlightOnly();
            return;
        }

        const rect = renderer.domElement.getBoundingClientRect();
        const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

        const intersects = raycaster.intersectObjects(graph.children.filter(child => child instanceof THREE.LOD && child.visible));

        if (intersects.length > 0) {
            const intersectedLOD = intersects[0].object.parent;
            if (intersectedLOD.userData && intersectedLOD.userData.id !== undefined) {
                if (hoveredNode.value !== intersectedLOD) {
                    hoveredNode.value = intersectedLOD;
                    updateHighlight();
                    updateInfoPanel(intersectedLOD.userData);
                    cursorType.value = 'crosshair';
                }
            }

            renderer.domElement.onclick = (e) => {
                if (e.button === 0) {
                    onNodeLeftClick(intersectedLOD)
                }
            }
        } else {
            if (hoveredNode.value) {
                hoveredNode.value = null;
                updateHighlight();
                updateInfoPanel(null);
                cursorType.value = 'grab';
            }

            renderer.domElement.onclick = null
        }

        renderer.domElement.oncontextmenu = (e) => {
            e.preventDefault()
            onNodeRightClick()
        }
    }

    function updateHighlight() {
        const hasSelectedNode = selectedNode.value !== null;
        const hasHoveredNode = hoveredNode.value !== null;

        // Reset all nodes and edges
        graph.children.forEach(child => {
            if (child instanceof LOD && child.visible) {
                resetNodeHighlight(child);
            } else if (child instanceof THREE.Line && child.visible) {
                resetEdgeHighlight(child);
            }
        });

        // Highlight nodes and edges based on depth
        if (hasSelectedNode) {
            highlightNodeAndChildren(selectedNode.value, settingsStore.highlightDepth);
        }
        if (hasHoveredNode && hoveredNode.value.userData.id !== selectedNode.value) {
            highlightNodeAndChildren(hoveredNode.value.userData.id, settingsStore.highlightDepth);
        }

        // Make non-connected nodes and edges transparent
        makeNonConnectedTransparent(
            hasSelectedNode ? selectedNode.value : (hasHoveredNode ? hoveredNode.value.userData.id : null),
            settingsStore.highlightDepth
        );

        updateRenderOrder();
        renderer.render(scene, camera);
    }

    function resetNodeHighlight(node) {
        const baseColor = new THREE.Color(node.userData.originalColor);
        node.levels.forEach(level => {
            level.object.material.color.set(baseColor);
            level.object.material.emissive.setHex(baseColor);
            level.object.material.opacity = 1;
            level.object.material.transparent = true;
            level.object.material.needsUpdate = true;
        });
        node.scale.setScalar(1);
    }

    function resetEdgeHighlight(edge) {
        setEdgeProperties(edge, settingsStore.linkColors.normal, 1, 0);
    }

    /**
     * Highlights a node and its children up to the specified depth
     * @param {string} nodeId - The ID of the node to highlight
     * @param {number} maxDepth - The maximum depth to highlight
     * @param {number} currentDepth - The current depth in the recursion
     */
    function highlightNodeAndChildren(nodeId, maxDepth, currentDepth = 0) {
        const node = graph.children.find(child => child instanceof LOD && child.userData.id === nodeId);
        if (!node) return;

        const highlightColor = calculateHighlightColor(currentDepth, maxDepth);
        highlightNode(node, currentDepth === 0, highlightColor);

        if (currentDepth < maxDepth) {
            const childNodes = getChildNodes(node);
            childNodes.forEach(childNode => {
                highlightEdge(node, childNode, highlightColor);
                highlightNodeAndChildren(childNode.userData.id, maxDepth, currentDepth + 1);
            });
        }
    }

    /**
     * Calculates the highlight color for a given depth
     * @param {number} currentDepth - The current depth in the tree
     * @param {number} maxDepth - The maximum depth set by the user
     * @returns {THREE.Color} The calculated highlight color
     */
    function calculateHighlightColor(currentDepth, maxDepth) {
        const baseColor = new THREE.Color(settingsStore.linkColors.hover);
        const darknessFactor = 1 - (currentDepth / maxDepth) * 0.99; // Darken up to 50%
        return baseColor.multiplyScalar(darknessFactor);
    }


    function highlightNode(node, isPrimary, highlightColor) {
        const baseColor = new THREE.Color(node.userData.originalColor);
        node.levels.forEach(level => {
            level.object.material.color.set(baseColor);
            // level.object.material.emissive.set(baseColor);
            level.object.material.opacity = 1;
            level.object.material.transparent = false;
            level.object.material.needsUpdate = true;
        });
        node.scale.setScalar(isPrimary ? 1.15 : 1.1);
    }

    /**
     * Highlights an edge between two nodes
     * @param {THREE.Object3D} sourceNode - The source node of the edge
     * @param {THREE.Object3D} targetNode - The target node of the edge
     * @param {THREE.Color} highlightColor - The color to use for highlighting
     */
    function highlightEdge(sourceNode, targetNode, highlightColor) {
        const edge = graph.children.find(child =>
            child instanceof THREE.Line &&
            child.userData.source === sourceNode &&
            child.userData.target === targetNode
        );

        if (edge) {
            setEdgeProperties(edge, highlightColor.getHex(), 1, 1);
        }
    }

    function setEdgeProperties(edge, color, opacity, renderOrder) {
        edge.material.color.setHex(color);
        edge.material.opacity = opacity;
        edge.renderOrder = renderOrder;
        edge.material.transparent = opacity < 1;
        edge.material.needsUpdate = true;
    }

    function updateRenderOrder() {
        graph.children.forEach(child => {
            if (child instanceof THREE.Line && child.visible) {
                const sourceRenderOrder = child.userData.source.renderOrder || 0;
                const targetRenderOrder = child.userData.target.renderOrder || 0;
                child.renderOrder = Math.max(sourceRenderOrder, targetRenderOrder, child.renderOrder);
            }
        });
    }

    function makeNonConnectedTransparent(rootNodeId, maxDepth) {
        if (!rootNodeId) return;

        const connectedNodes = new Set();
        const nodesToProcess = [{id: rootNodeId, depth: 0}];

        while (nodesToProcess.length > 0) {
            const {id: currentNodeId, depth} = nodesToProcess.pop();
            if (connectedNodes.has(currentNodeId) || depth > maxDepth) continue;

            connectedNodes.add(currentNodeId);
            if (depth < maxDepth) {
                const childNodes = getChildNodes(graph.children.find(child => child instanceof LOD && child.userData.id === currentNodeId));
                nodesToProcess.push(...childNodes.map(node => ({id: node.userData.id, depth: depth + 1})));
            }
        }

        graph.children.forEach(child => {
            if (child instanceof LOD && child.visible) {
                if (!connectedNodes.has(child.userData.id)) {
                    child.levels.forEach(level => {
                        level.object.material.opacity = settingsStore.nonConnectedOpacity;
                        level.object.material.transparent = true;
                        level.object.material.needsUpdate = true;
                    });
                }
            } else if (child instanceof THREE.Line && child.visible) {
                if (!connectedNodes.has(child.userData.source.userData.id) || !connectedNodes.has(child.userData.target.userData.id)) {
                    setEdgeProperties(child, settingsStore.linkColors.normal, settingsStore.nonConnectedOpacity, 0);
                }
            }
        });
    }

    function onNodeLeftClick(node) {
        if (isCameraAnimating.value) return;

        if (!originalCameraPosition.value) {
            originalCameraPosition.value = camera.position.clone();
            originalControlsTarget.value = controls.value.target.clone();
        }

        const connectedNodes = getChildNodes(node);
        const boundingBox = new THREE.Box3();

        connectedNodes.forEach(connectedNode => {
            boundingBox.expandByObject(connectedNode);
        });

        const center = new THREE.Vector3();
        boundingBox.getCenter(center);

        const size = new THREE.Vector3();
        boundingBox.getSize(size);

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;

        const newPosition = new THREE.Vector3(
            center.x + cameraDistance,
            center.y + cameraDistance / 2,
            center.z + cameraDistance
        );

        isCameraAnimating.value = true;

        gsap.to(camera.position, {
            duration: 0.8,
            x: newPosition.x,
            y: newPosition.y,
            z: newPosition.z,
            onUpdate: () => camera.updateProjectionMatrix(),
            onComplete: () => {
                isCameraAnimating.value = false;
            },
        });

        gsap.to(controls.value.target, {
            duration: 0.8,
            x: center.x,
            y: center.y,
            z: center.z,
            onUpdate: () => controls.value.update(),
        });

        selectedNode.value = node.userData.id;
        updateHighlight();
    }

    function onNodeRightClick() {
        if (originalCameraPosition.value && originalControlsTarget.value) {

            gsap.to(camera.position, {
                duration: 0.8,
                x: originalCameraPosition.value.x,
                y: originalCameraPosition.value.y,
                z: originalCameraPosition.value.z,
                onUpdate: () => camera.updateProjectionMatrix(),
                onComplete: () => {
                    isCameraAnimating.value = false;
                },
            });

            gsap.to(controls.value.target, {
                duration: 0.8,
                x: originalControlsTarget.value.x,
                y: originalControlsTarget.value.y,
                z: originalControlsTarget.value.z,
                onUpdate: () => controls.value.update(),
            });
        }

        selectedNode.value = null;
        hoveredNode.value = null;
        updateHighlight();
    }

    function onCameraControlsStart() {
        isMovingCamera.value = true;
        document.body.style.cursor = 'grabbing';  // Change cursor to grabbing
    }

    function onCameraControlsEnd() {
        isMovingCamera.value = false;
        document.body.style.cursor = 'default';  // Reset cursor to default
    }

    function isObjectVisible(camera, object) {
        const frustum = new THREE.Frustum();
        const projScreenMatrix = new THREE.Matrix4();
        projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        frustum.setFromProjectionMatrix(projScreenMatrix);

        // Use a bounding sphere for all objects
        const boundingSphere = new THREE.Sphere();
        const box = new THREE.Box3().setFromObject(object);
        box.getBoundingSphere(boundingSphere);

        return frustum.intersectsSphere(boundingSphere);
    }

    function countVisibleNodes(camera, nodes) {
        return nodes.filter(node => isObjectVisible(camera, node)).length;
    }

    function getChildNodes(node) {
        const childNodes = [];
        graph.children.forEach(child => {
            if (child instanceof THREE.Line &&
                child.userData.source === node &&
                child.userData.relationshipType === 'parent-child') {
                childNodes.push(child.userData.target);
            }
        });
        return childNodes;
    }


    onMounted(() => {
        if (camera && controls.value && controls.value.target) {
            originalCameraPosition.value = camera.position.clone();
            originalControlsTarget.value = controls.value.target.clone();
        }
    });

    return {
        hoveredNode,
        selectedNode,
        onMouseMove,
        onNodeLeftClick,
        onNodeRightClick,
        updateHighlight,
        updateCamera,
        onCameraControlsStart,
        onCameraControlsEnd,
        isCameraAnimating,
        cursorType,
    };
}