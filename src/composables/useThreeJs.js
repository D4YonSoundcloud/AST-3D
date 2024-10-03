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

        camera.position.set(200, 200, 300);
        camera.lookAt(0, 0, 0);

        controls.value = new OrbitControls(camera, renderer.domElement);
        controls.value.enableDamping = true;
        controls.value.dampingFactor = 0.1;
        controls.value.rotateSpeed = 0.4;
        controls.value.maxDistance = 4000;
        controls.value.minDistance = 10;

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

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Calculate bounding box of all visible nodes
        const boundingBox = new THREE.Box3();
        graph.children.forEach(child => {
            if (child.visible) {
                boundingBox.expandByObject(child);
            }
        });

        // Adjust camera to fit all visible nodes
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;

        camera.position.set(center.x, center.y, center.z + cameraZ);
        camera.lookAt(center);

        const minZ = boundingBox.min.z;
        camera.far = (cameraZ - minZ) * 2;
        camera.updateProjectionMatrix();

        controls.value.target.copy(center);
        controls.value.update();
    }

    function handleKeyDown(event) {
        if (event.key === 'Shift') {
            isShiftPressed.value = true;
            if (controls.value) {
                controls.value.enableZoom = false;
            }
        }
    }

    function handleKeyUp(event) {
        if (event.key === 'Shift') {
            isShiftPressed.value = false;
            if (controls.value) {
                controls.value.enableZoom = true;
            }
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
        lightsOn,
        isShiftPressed,
        isDataReady,
    };
}