import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export function useThreeJS(container) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 5000);
    const renderer = new THREE.WebGLRenderer({
        antialias: true, // Enable anti-aliasing
        alpha: true // Enable transparency
    });
    const controls = ref(null);
    const graph = new THREE.Group();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    const pointLight = new THREE.PointLight(0xF44336, 0.8);
    const pointLight2 = new THREE.PointLight(0x00ff0a, 0.8);

    const lightsOn = ref(true);

    function initVisualization() {
        camera.position.set(200, 200, 300);
        camera.lookAt(0, 0, 0);

        controls.value = new OrbitControls(camera, renderer.domElement);
        controls.value.enableDamping = true;
        controls.value.dampingFactor = 0.1; // Increased for smoother movement
        controls.value.rotateSpeed = 0.85; // Adjusted for smoother rotation
        controls.value.maxDistance = 4000;
        controls.value.minDistance = 10;

        scene.add(graph);

        // Set up lights
        pointLight.position.set(200, 300, 200);
        pointLight.lookAt(0, 0, 0);
        pointLight2.position.set(450, -350, -200);
        pointLight2.lookAt(0, 0, 0);

        // Add lights to the scene based on initial state
        if (lightsOn.value) {
            scene.add(ambientLight);
            scene.add(pointLight);
            scene.add(pointLight2);
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

    onMounted(() => {
        initVisualization();
        if (container.value) {
            container.value.appendChild(renderer.domElement);
            handleResize();
        }
        startRenderLoop();
        window.addEventListener('resize', handleResize);
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
    };
}