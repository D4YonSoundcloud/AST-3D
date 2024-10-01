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

        graph.children.forEach(child => {
            if (child instanceof LOD && child.visible) {
                updateNodeHighlight(child, hasSelectedNode, hasHoveredNode);
            } else if (child instanceof THREE.Line && child.visible) {
                updateEdgeHighlight(child, hasSelectedNode, hasHoveredNode);
            }
        });

        updateRenderOrder();
        renderer.render(scene, camera);
    }

    function updateNodeHighlight(node, hasSelectedNode, hasHoveredNode) {
        const isSelected = node.userData.id === selectedNode.value;
        const isHovered = node === hoveredNode.value;
        const isConnectedToSelected = hasSelectedNode && isConnectedTo(node, selectedNode.value);
        const isConnectedToHovered = hasHoveredNode && isConnectedTo(node, hoveredNode.value.userData.id);

        const baseColor = new THREE.Color(node.userData.originalColor);

        node.levels.forEach(level => {
            level.object.material.color.set(baseColor);
            level.object.material.emissive.setHex(0x000000);
        });

        node.scale.setScalar(isSelected || isHovered ? 1.15 : 1);

        const opacity = isSelected || isConnectedToSelected || isHovered || isConnectedToHovered || !hasSelectedNode ? 1 : 0.2;

        node.levels.forEach(level => {
            level.object.material.opacity = opacity;
            level.object.material.transparent = opacity < 1;
            level.object.material.needsUpdate = true;
        });

        if (isConnectedToSelected && !isSelected) {
            node.levels.forEach(level => {
                level.object.material.emissive.setHex(0x444444);
            });
        }
    }

    function updateEdgeHighlight(edge, hasSelectedNode, hasHoveredNode) {
        const isConnectedToSelected = hasSelectedNode && isConnectedTo(edge, selectedNode.value);
        const isConnectedToHovered = hasHoveredNode && isConnectedTo(edge, hoveredNode.value.userData.id);

        if (isConnectedToSelected) {
            setEdgeProperties(edge, settingsStore.linkColors.selected, 1, 2);
        } else if (isConnectedToHovered) {
            setEdgeProperties(edge, hasSelectedNode ? settingsStore.linkColors.hover : settingsStore.linkColors.hover, 1, 1);
        } else {
            setEdgeProperties(edge,
                edge.userData.type === 'dependency' ? 0x989898 :
                    edge.userData.sourceType === 'Program' ? 0x282828 : settingsStore.linkColors.normal,
                hasSelectedNode ? 0.2 : 1, 0);
        }
    }

    function setEdgeProperties(edge, color, opacity, renderOrder) {
        edge.material.color.setHex(color);
        edge.material.opacity = opacity;
        edge.renderOrder = renderOrder;
        edge.material.transparent = opacity < 1;
        edge.material.needsUpdate = true;
    }

    function isConnectedTo(object, nodeId) {
        return (object.userData.source && object.userData.source.userData.id === nodeId) ||
            (object.userData.target && object.userData.target.userData.id === nodeId);
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

    function onNodeLeftClick(node) {
        if (isCameraAnimating.value) return;

        if (!originalCameraPosition.value) {
            originalCameraPosition.value = camera.position.clone();
            originalControlsTarget.value = controls.value.target.clone();
        }

        const connectedNodes = getConnectedNodes(node);
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
                    updateHighlight();
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

    function getConnectedNodes(node) {
        const connectedNodes = new Set();
        graph.children.forEach(child => {
            if (child instanceof THREE.Line &&
                (child.userData.source === node || child.userData.target === node)) {
                connectedNodes.add(child.userData.source === node ? child.userData.target : child.userData.source);
            }
        });
        return Array.from(connectedNodes);
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