<script setup>
import {ref, onMounted, onUnmounted, watch, nextTick} from 'vue';
import * as THREE from 'three';
import { useThreeJS } from '../composables/useThreeJS';
import { useNodeInteractions } from '../composables/useNodeInteractions';
import { useAstVisualization } from '../composables/useAstVisualization';

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
} = useThreeJS(canvasContainer);

const {
  hoveredNode,
  selectedNode,
  onMouseMove,
  updateCamera
} = useNodeInteractions(scene, camera, controls, graph, updateInfoPanel, renderer);

const {
  updateVisualization,
  updateVisibility,
} = useAstVisualization(scene, graph);

defineExpose({
  handleThreeResize: () => {
    handleResize();
  }
});

function updateInfoPanel(nodeData) {
  emit('updateInfoPanel', nodeData);
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
  controls.update();

  nextTick(() => {
    updateCamera(camera, controls);
  });
}

onMounted(() => {
  if (canvasContainer.value) {
    canvasContainer.value.appendChild(renderer.domElement);
    handleResize();
    startRenderLoop();
  }
  canvasContainer.value.addEventListener('mousemove', onMouseMove);
  updatePanelVisualization()
});

onUnmounted(() => {
  stopRenderLoop();
  canvasContainer.value.removeEventListener('mousemove', onMouseMove);
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
  <div ref="canvasContainer" class="canvas-container"></div>
</template>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}
</style>