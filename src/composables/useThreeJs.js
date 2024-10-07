import {onUnmounted, ref, watch} from 'vue';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {Line2} from "three/addons/lines/Line2.js";

export function useThreeJS(container, initialData) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 5000);
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    const controls = ref(null);
    const graph = new THREE.Group();
    const isDataReady = ref(false);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    const pointLight = new THREE.PointLight(0xF44336, 0.8);
    const pointLight2 = new THREE.PointLight(0x00ff0a, 0.8);

    const lightsOn = ref(true);
    const isShiftPressed = ref(false);

    function initVisualization() {
        if (!isDataReady.value) return;

        setupCamera();
        setupControls(camera, renderer);
        setupLights();
        setupEventListeners();
        adjustCameraToFitScene();
    }

// Helper functions
    function setupCamera() {
        camera.position.set(200, 200, 300);
        camera.lookAt(0, 0, 0);
    }

    function setupControls(camera, renderer) {
        if (controls.value) {
            // If controls already exist, just update their properties
            updateControlsProperties();
        } else {
            // If controls don't exist, create new ones
            controls.value = new OrbitControls(camera, renderer.domElement);
            updateControlsProperties();
        }
    }

    function updateControlsProperties() {
        if (controls.value) {
            controls.value.enableDamping = true;
            controls.value.dampingFactor = 0.1;
            controls.value.rotateSpeed = 0.4;
            controls.value.maxDistance = 100000;
            controls.value.minDistance = 10;
        }
    }

// Don't forget to dispose of controls when they're no longer needed
    function disposeControls() {
        if (controls.value) {
            controls.value.dispose();
            controls.value = null;
        }
    }

    function setupLights() {
        scene.add(graph);

        pointLight.position.set(200, 300, 200);
        pointLight.lookAt(0, 0, 0);
        pointLight2.position.set(450, -350, -200);
        pointLight2.lookAt(0, 0, 0);

        if (lightsOn.value) {
            scene.add(ambientLight);
            scene.add(pointLight);
            scene.add(pointLight2);
        }
    }

    // Use a closure to ensure event listeners are only added once
    function setupEventListeners() {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
    }

    function cleanupEventListeners() {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    }

    function adjustCameraToFitScene() {
        const boundingBox = calculateBoundingBox();
        const { center, size } = getBoundingBoxProperties(boundingBox);

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;

        camera.position.set(center.x, center.y, center.z + cameraZ);
        camera.lookAt(center);

        const minZ = boundingBox.min.z;
        camera.far = (cameraZ - minZ) * 100;
        camera.updateProjectionMatrix();

        controls.value.target.copy(center);
        controls.value.update();
    }

    function calculateBoundingBox() {
        const boundingBox = new THREE.Box3();
        graph.children.forEach(child => {
            if (child.visible) {
                boundingBox.expandByObject(child);
            }
        });
        return boundingBox;
    }

    function getBoundingBoxProperties(boundingBox) {
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        boundingBox.getCenter(center);
        boundingBox.getSize(size);
        return { center, size };
    }

    function handleKeyDown(event) {
        if (event.key === 'Shift') {
            isShiftPressed.value = true;
        }
    }

    function handleKeyUp(event) {
        if (event.key === 'Shift') {
            isShiftPressed.value = false;
        }
    }

    function toggleLights() {
        lightsOn.value = !lightsOn.value;
        if (lightsOn.value) {
            scene.add(ambientLight);
            scene.add(pointLight);
            scene.add(pointLight2);
        } else {
            scene.remove(ambientLight);
            scene.remove(pointLight);
            scene.remove(pointLight2);
        }

        // Update materials for all nodes
        graph.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
                child.material = lightsOn.value ? child.userData.lambertMaterial : child.userData.basicMaterial;
            }
        });
    }

    function handleResize() {
        if (container.value) {
            camera.aspect = container.value.clientWidth / container.value.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.value.clientWidth, container.value.clientHeight);

            // Update line material resolution
            graph.children.forEach(child => {
                if (child instanceof Line2) {
                    child.material.resolution.set(container.value.clientWidth, container.value.clientHeight);
                }
            });
        }
    }

    let animationFrameId = null;

    function startRenderLoop() {
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            controls.value.update();
            renderer.render(scene, camera);
        };
        animate();
    }

    function stopRenderLoop() {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    watch(isShiftPressed, (newValue) => {
        if (controls.value) {
            controls.value.enableZoom = !newValue;
        }
    });

    watch(() => initialData.value, (newData) => {
        if (newData && newData.length > 0) {
            isDataReady.value = true;
            initVisualization();
            if (container.value) {
                container.value.appendChild(renderer.domElement);
                handleResize();
            }
            startRenderLoop();
            window.addEventListener('resize', handleResize);
        }
    });

    onUnmounted(() => {
        stopRenderLoop();
        cleanupEventListeners();
        disposeControls();
        window.removeEventListener('resize', handleResize);
    });

    return {
        scene,
        camera,
        renderer,
        controls,
        graph,
        handleResize,
        startRenderLoop,
        stopRenderLoop,
        toggleLights,
        initVisualization,
        lightsOn,
        isShiftPressed,
        isDataReady,
    };
}