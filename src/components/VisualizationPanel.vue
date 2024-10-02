<script setup>
import {ref, onMounted, onUnmounted, watch, nextTick} from 'vue';
import * as THREE from 'three';
import { useThreeJS } from '../composables/useThreeJS';
import { useNodeInteractions } from '../composables/useNodeInteractions';
import { useAstVisualization } from '../composables/useAstVisualization';
import { useAstStore } from '../stores/astStore';
import { useSettingsStore } from '../stores/settingsStore';
import VisualizationControls from './VisualizationControls.vue';

const astStore = useAstStore();
const settingsStore = useSettingsStore();

const props = defineProps({
  nodes: {
    type: Array,
    required: true
  },
  links: {
    type: Array,
    required: true
  },
  visibleNodeTypes: {
    type: Set,
    required: true
  }
});

const emit = defineEmits(['updateInfoPanel']);

const canvasContainer = ref();

const {
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
} = useThreeJS(canvasContainer);

const {
  hoveredNode,
  selectedNode,
  maxPossibleDepth,
  onMouseMove,
  onNodeLeftClick,
  onNodeRightClick,
  updateHighlight,
  updateCamera,
  onCameraControlsStart,
  onCameraControlsEnd,
  isCameraAnimating,
  cursorType,
} = useNodeInteractions(scene, camera, controls, graph, updateInfoPanel, renderer);


const {
  updateVisualization,
  updateVisibility,
  updateNodeSettings,
  centerVisualization,
} = useAstVisualization(scene, graph);

defineExpose({
  handleThreeResize: () => {
    handleResize();
  }
});

function handleWheel(event) {
  if (canvasContainer.value && canvasContainer.value.contains(event.target) && isShiftPressed.value) {
    event.preventDefault();
    const delta = Math.sign(event.deltaY);
    const newDepth = Math.max(0, Math.min(5, settingsStore.highlightDepth - delta));
    settingsStore.updateHighlightDepth(newDepth);
    updateHighlight();
    centerVisualization();
  }
}

function updateInfoPanel(nodeData) {
  if (!isCameraAnimating.value) {
    emit('updateInfoPanel', nodeData);
  }
}
function updatePanelVisualization() {
  updateVisualization(props.nodes, props.links);
  updateVisibility(props.visibleNodeTypes);

  const box = new THREE.Box3().setFromObject(graph);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

  console.log(center)

  camera.position.set(center.x, center.y, center.z + 1000);
  camera.lookAt(center);

  controls.target.copy(center);

  camera.near = cameraZ / 100;
  camera.far = cameraZ * 100;
  camera.updateProjectionMatrix();

  controls.maxDistance = cameraZ * 10;
  controls.value.enableKeys = false;
  controls.value.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN
  };
  controls.value.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  };
  controls.update();

  nextTick(() => {
    updateCamera(camera, controls);
  });
}

function onMouseDown(event) {
  if (event.button === 0) { // Left mouse button
    canvasContainer.value.style.cursor = 'grabbing';
  }
}

function onMouseUp(event) {
  if (event.button === 0) { // Left mouse button
    canvasContainer.value.style.cursor = cursorType.value;
  }
}

function updateCursor() {
  if (canvasContainer.value) {
    canvasContainer.value.style.cursor = cursorType.value;
  }
}



watch(cursorType, updateCursor);

watch(() => settingsStore.updateTrigger, () => {
  Object.keys(settingsStore.settings).forEach(nodeType => {
    updateNodeSettings(nodeType);
    updateHighlight();
    centerVisualization();
  });
});

watch(() => settingsStore.linkColors, (newColors, oldColors) => {
  if (JSON.stringify(newColors) !== JSON.stringify(oldColors)) {
    updateHighlight();
    centerVisualization();
  }
}, { deep: true });

onMounted(() => {
  if (canvasContainer.value) {
    canvasContainer.value.appendChild(renderer.domElement);
    handleResize();
    startRenderLoop();
  }
  canvasContainer.value.addEventListener('mousemove', onMouseMove);

  controls.value.addEventListener('start', onCameraControlsStart);
  controls.value.addEventListener('end', onCameraControlsEnd);

  canvasContainer.value.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);

  window.addEventListener('wheel', handleWheel, { passive: false });

  updatePanelVisualization()
});

onUnmounted(() => {
  stopRenderLoop();
  canvasContainer.value.removeEventListener('mousemove', onMouseMove);

  controls.value.removeEventListener('start', onCameraControlsStart);
  controls.value.removeEventListener('end', onCameraControlsEnd);

  canvasContainer.value.removeEventListener('mousedown', onMouseDown);
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('wheel', handleWheel);
});

watch(() => props.nodes, (newNodes) => {
  updateVisualization(newNodes, props.links);
  updateVisibility(props.visibleNodeTypes);
  updateCamera(camera, controls);
}, { deep: true });

watch(() => props.visibleNodeTypes, () => {
  updateVisibility(props.visibleNodeTypes);
}, { deep: true });
</script>

<template>
  <div ref="canvasContainer" class="canvas-container">
    <VisualizationControls :maxPossibleDepth="maxPossibleDepth"/>
  </div>
</template>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
  background: var(--visual-bg-color);
}
</style>