<script setup>
import {ref, onMounted, onUnmounted, watch, nextTick} from 'vue';
import * as THREE from 'three';
import { useThreeJS } from '../composables/useThreeJS';
import { useNodeInteractions } from '../composables/useNodeInteractions';
import { useAstVisualization } from '../composables/useAstVisualization';
import { useBoundingBox } from '../composables/useBoundingBox';
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
const initialData = ref(null);

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
  initVisualization,
  lightsOn,
  isShiftPressed,
  isDataReady,
} = useThreeJS(canvasContainer, initialData);

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
  recalculateAllNodePositions,
  isTransitioning,
} = useAstVisualization(scene, graph);

const {
  visible: boxVisible,
  updateBoundingBox,
  toggleVisibility: toggleBoundingBox
} = useBoundingBox(scene, {
  color: 0x7c4dff
});

defineExpose({
  handleThreeResize: () => {
    handleResize();
  }
});

function handleWheel(event) {
  if (canvasContainer.value && canvasContainer.value.contains(event.target) && isShiftPressed.value) {
    event.preventDefault();
    const delta = Math.sign(event.deltaY);
    const newDepth = Math.max(0, Math.min(maxPossibleDepth.value, settingsStore.highlightDepth + delta));
    settingsStore.updateHighlightDepth(newDepth);
    updateHighlight();
  }
}

function setupControlsEventListeners() {
  if (controls.value) {
    controls.value.addEventListener('start', onCameraControlsStart);
    controls.value.addEventListener('end', onCameraControlsEnd);
  }
}

function cleanupControlsEventListeners() {
  if (controls.value) {
    controls.value.removeEventListener('start', onCameraControlsStart);
    controls.value.removeEventListener('end', onCameraControlsEnd);
  }
}

function updateInfoPanel(nodeData) {
  if (!isCameraAnimating.value) {
    emit('updateInfoPanel', nodeData);
  }
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

watch(() => settingsStore.highlightDirection, () => {
  if (selectedNode.value) {
    onNodeLeftClick(graph.children.find(child => child.userData.id === selectedNode.value));
  }
});

watch(controls, (newControls) => {
  if (newControls) {
    setupControlsEventListeners();
  }
});

watch(
    () => settingsStore.settings,
    (newSettings, oldSettings) => {
      // Check if nodeTypes have changed
      if (JSON.stringify(newSettings.nodeTypes) !== JSON.stringify(oldSettings.nodeTypes)) {
        Object.keys(newSettings.nodeTypes).forEach(nodeType => {
          updateNodeSettings(nodeType);
        });
      }
      // Always update highlights, as other settings might have changed
      updateHighlight();
    },
    { deep: true }
);

watch(() => settingsStore.linkColors, (newColors, oldColors) => {
  if (JSON.stringify(newColors) !== JSON.stringify(oldColors)) {
    updateHighlight();
  }
}, { deep: true });

watch(() => settingsStore.modelType, async () => {
  console.log('Model type changed, re-rendering visualization');
  await recalculateAllNodePositions();
  updateVisibility(props.visibleNodeTypes);
  initVisualization();
  updateHighlight();

  updateBoundingBox(graph);
});

watch(() => props.nodes, (newNodes) => {
  console.log('about to call the watch for prop nodes.', props.links, props.visibleNodeTypes);
  initialData.value = newNodes; // This will trigger the watcher in useThreeJS
  updateVisualization(props.nodes, props.links);
  updateVisibility(props.visibleNodeTypes);

  updateBoundingBox(graph);
}, { deep: true });

watch(() => props.visibleNodeTypes, () => {
  console.log('updating visibility from watch', props.visibleNodeTypes)
  updateVisibility(props.visibleNodeTypes);
  updateBoundingBox(graph);
}, { deep: true });


onMounted(() => {
  if (canvasContainer.value) {
    canvasContainer.value.appendChild(renderer.domElement);
    handleResize();
  }
  canvasContainer.value.addEventListener('mousemove', onMouseMove);
  canvasContainer.value.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('wheel', handleWheel, { passive: false });

  console.log('Mounted visualization panel');
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


</script>

<template>
  <div ref="canvasContainer" class="canvas-container">
    <div v-if="isTransitioning" class="recalculating-overlay">
      Loading
    </div>
    <VisualizationControls :maxPossibleDepth="maxPossibleDepth" :boxVisible="boxVisible" @toggleBoundingBox="toggleBoundingBox"/>
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

.recalculating-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  z-index: 1000;
}
</style>