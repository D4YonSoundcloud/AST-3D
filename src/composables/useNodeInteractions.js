import { ref, onMounted } from 'vue';
import * as THREE from 'three';
import gsap from 'gsap';
import {LOD} from "three";
import {Frustum} from "three";

export function useNodeInteractions(scene, camera, controls, graph, updateInfoPanel, renderer) {
    const hoveredNode = ref(null);
    const selectedNode = ref(null);
    const originalCameraPosition = ref(null);
    const originalControlsTarget = ref(null);

    const COLORS = {
        DEFAULT: 0xAAAAAA,
        SELECTED: 0x00FF00,
        HOVERED: 0x00FF00,
        HOVERED_NONCONNECTED: 0xFFA500
    };

    onMounted(() => {
        if (camera && controls.value && controls.value.target) {
            originalCameraPosition.value = camera.position.clone();
            originalControlsTarget.value = controls.value.target.clone();
        }


        console.log(camera.position, originalCameraPosition.value)
    });

    function updateCamera(camera, controls) {
        if (camera && controls.value && controls.value.target) {
            originalCameraPosition.value = camera.position.clone();
            originalControlsTarget.value = controls.value.target.clone();
        }

        console.log(camera.position, originalCameraPosition.value)
    }

    function onMouseMove(event) {
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
                const isSelected = child.userData.id === selectedNode.value;
                const isHovered = child === hoveredNode.value;
                const isConnectedToSelected = hasSelectedNode &&
                    graph.children.some(line =>
                        line instanceof THREE.Line &&
                        ((line.userData.source.userData.id === selectedNode.value && line.userData.target === child) ||
                            (line.userData.target.userData.id === selectedNode.value && line.userData.source === child))
                    );
                const isConnectedToHovered = hasHoveredNode !== null &&
                    graph.children.some(line =>
                        line instanceof THREE.Line &&
                        ((line.userData.source === hoveredNode.value && line.userData.target === child) ||
                            (line.userData.target === hoveredNode.value && line.userData.source === child))
                    );

                const baseColor = new THREE.Color(child.userData.originalColor);

                child.levels.forEach(level => {
                    level.object.material.color.set(baseColor);
                    level.object.material.emissive.setHex(0x000000);
                });

                child.scale.setScalar(isSelected || isHovered ? 1.15 : 1);

                child.levels.forEach(level => {
                    level.object.material.opacity = !hasSelectedNode || isSelected || isConnectedToSelected || isHovered || isConnectedToHovered ? 1 : 0.1;
                    level.object.material.transparent = true;
                    level.object.material.needsUpdate = true;
                });

            } else if (child instanceof THREE.Line && child.visible) {
                const isConnectedToSelected = hasSelectedNode &&
                    (child.userData.source.userData.id === selectedNode.value ||
                        child.userData.target.userData.id === selectedNode.value);

                const isConnectedToHovered = hasHoveredNode &&
                    (child.userData.source.userData.id === hoveredNode.value.userData.id ||
                        child.userData.target.userData.id === hoveredNode.value.userData.id);

                if (isConnectedToSelected) {
                    child.material.color.setHex(COLORS.SELECTED);
                    child.material.opacity = 1;
                    child.renderOrder = 2;
                } else if (isConnectedToHovered) {
                    child.material.color.setHex(hasSelectedNode ? COLORS.HOVERED_NONCONNECTED : COLORS.HOVERED);
                    child.material.opacity = 1;
                    child.renderOrder = 1;
                } else {
                    // Reset to default state
                    child.material.color.setHex(child.userData.type === 'dependency' ? 0x989898 :
                        child.userData.sourceType === 'Program' ? 0x282828 :
                            COLORS.DEFAULT);
                    child.material.opacity = hasSelectedNode ? 0.1 : 0.5;  // Set to default opacity
                    child.renderOrder = 0;
                }

                child.material.transparent = true;
                child.material.needsUpdate = true;
            }
        });

        graph.children.forEach(child => {
            if (child instanceof THREE.Line && child.visible) {
                const sourceRenderOrder = child.userData.source.renderOrder || 0;
                const targetRenderOrder = child.userData.target.renderOrder || 0;
                child.renderOrder = Math.max(sourceRenderOrder, targetRenderOrder, child.renderOrder);
            }
        });

        renderer.render(scene, camera);
    }

    function onNodeLeftClick(node) {
        if (!originalCameraPosition.value) {
            originalCameraPosition.value = camera.position.clone()
            originalControlsTarget.value = controls.value.target.clone()
        }

        const connectedNodes = getConnectedNodes(node)
        const boundingBox = new THREE.Box3()

        connectedNodes.forEach(connectedNode => {
            boundingBox.expandByObject(connectedNode)
        })

        const center = new THREE.Vector3()
        boundingBox.getCenter(center)

        const size = new THREE.Vector3()
        boundingBox.getSize(size)

        const maxDim = Math.max(size.x, size.y, size.z)
        const fov = camera.fov * (Math.PI / 180)
        const cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5

        const newPosition = new THREE.Vector3(
            center.x + cameraDistance,
            center.y + cameraDistance / 2,
            center.z + cameraDistance
        )

        gsap.to(camera.position, {
            duration: 1.4,
            x: newPosition.x,
            y: newPosition.y,
            z: newPosition.z,
            // onUpdate: () => camera.updateProjectionMatrix(),
        })

        gsap.to(controls.value.target, {
            duration: 1.4,
            x: center.x,
            y: center.y,
            z: center.z,
            onUpdate: () => controls.value.update(),
        })

        selectedNode.value = node.userData.id
        updateHighlight()
    }

    function onNodeRightClick() {
        if (originalCameraPosition.value && originalControlsTarget.value) {
            gsap.to(camera.position, {
                duration: 1,
                x: originalCameraPosition.value.x,
                y: originalCameraPosition.value.y,
                z: originalCameraPosition.value.z,
                onUpdate: () => camera.updateProjectionMatrix(),
            });

            gsap.to(controls.value.target, {
                duration: 1,
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



    return {
        hoveredNode,
        selectedNode,
        onMouseMove,
        onNodeLeftClick,
        onNodeRightClick,
        updateHighlight,
        updateCamera
    };
}