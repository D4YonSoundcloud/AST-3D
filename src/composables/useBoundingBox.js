import { ref, shallowRef, onUnmounted } from 'vue';
import * as THREE from 'three';

/**
 * Composable for managing a bounding box visualization in THREE.js
 * @param {THREE.Scene} scene - The THREE.js scene
 * @param {Object} options - Configuration options
 * @param {number} options.color - Color of the bounding box (hex)
 * @returns {Object} Bounding box controls and state
 */
export function useBoundingBox(scene, options = {}) {
    const { color = 0x7c4dff } = options;

    const visible = ref(true);
    const box = new THREE.Box3();
    const helper = shallowRef(null);

    /**
     * Initialize the box helper
     */
    function initBoxHelper() {
        if (!helper.value) {
            helper.value = new THREE.Box3Helper(box, new THREE.Color(color));
            scene.add(helper.value);
            helper.value.visible = visible.value;
        }
    }

    /**
     * Update the bounding box based on visible objects in the group
     * @param {THREE.Group} group - The group to calculate bounds from
     */
    function updateBoundingBox(group) {
        if (!helper.value) {
            initBoxHelper();
        }

        box.makeEmpty();
        group.children.forEach(child => {
            if (child.visible) {
                box.expandByObject(child);
            }
        });
        helper.value.updateMatrixWorld(true);
    }

    /**
     * Set the visibility of the bounding box
     * @param {boolean} isVisible - Whether the bounding box should be visible
     */
    function setVisible(isVisible) {
        visible.value = isVisible;
        if (helper.value) {
            helper.value.visible = isVisible;
        }
    }

    /**
     * Toggle the visibility of the bounding box
     */
    function toggleVisibility() {
        setVisible(!visible.value);
    }

    /**
     * Clean up resources
     */
    function dispose() {
        if (helper.value) {
            scene.remove(helper.value);
            helper.value.geometry.dispose();
            helper.value.material.dispose();
            helper.value = null;
        }
    }

    // Cleanup
    onUnmounted(() => {
        dispose();
    });

    return {
        visible,
        updateBoundingBox,
        setVisible,
        toggleVisibility,
        dispose
    };
}