<script setup>
import {computed, nextTick, onMounted, onUnmounted, ref, shallowRef, watch} from 'vue'
import { useAstStore } from '../stores/astStore';
import { storeToRefs } from "pinia";
import { analyzeCode } from '../utils/astAnalyzer';
import { useColumnResize } from '../composables/useColumnResize';
import CodeEditor from './CodeEditor.vue';
import VisualizationPanel from './VisualizationPanel.vue';
import InfoPanel from './InfoPanel.vue';
import NodeTypeList from './NodeTypeList.vue';
import SettingsPanel from './SettingsPanel.vue';
import { useSettingsStore } from '../stores/settingsStore';

const settingsStore = useSettingsStore()
const astStore = useAstStore()
const { availableNodeTypes, visibleNodeTypes, currentAstNodeTypes } = storeToRefs(astStore)

const codeInput = ref('')
const hoveredNodeData = ref(null)
const visualizationPanelRef = ref();

const nodeTypeOptions = computed(() => {
  return Array.from(currentAstNodeTypes.value).filter(type => availableNodeTypes.value.has(type));
});


const { columnWidths, startDrag } = useColumnResize({ codeEditor: 25, visualization: 55, nodeList: 20}, handleResizeColumn);

function handleResizeColumn() {
  if (visualizationPanelRef.value) {
    visualizationPanelRef.value.handleThreeResize();
  }
}

function updateInfoPanel(nodeData) {
  hoveredNodeData.value = nodeData;
}

function handleCodeChange(newCode) {
  codeInput.value = newCode;
  const analysisResult = analyzeCode(newCode, astStore);
  astStore.setNodes(analysisResult.nodes);
  astStore.setLinks(analysisResult.links);
}

function handleToggleNodeType(type) {
  astStore.toggleVisibleNodeType(type);
}

function handleToggleAvailableNodeType(type) {
  astStore.toggleAvailableNodeType(type);
}

watch(visibleNodeTypes, () => {}, { deep: true })


onMounted(() => {
  // settingsStore.resetToDefaults();
  astStore.triggerVisualizationUpdate();
})
// Utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
</script>

<template>
  <div class="ast-visualizer">
    <div class="column code-editor" :style="{ width: `${columnWidths.codeEditor}%` }">
      <CodeEditor v-model="codeInput" @update:modelValue="handleCodeChange" />
    </div>
    <div class="splitter" @mousedown="startDrag($event, 'code')">

    </div>
    <div class="column visualization" :style="{ width: `${columnWidths.visualization}%` }">
      <VisualizationPanel
          ref="visualizationPanelRef"
          :nodes="astStore.nodes"
          :links="astStore.links"
          :visibleNodeTypes="visibleNodeTypes"
          @updateInfoPanel="updateInfoPanel"
      />
      <InfoPanel :nodeData="hoveredNodeData" />
      <SettingsPanel
          :availableNodeTypes="availableNodeTypes"
          :allNodeTypes="astStore.ALL_NODE_TYPES"
          @toggleAvailableNodeType="handleToggleAvailableNodeType"
      />
    </div>
    <div class="splitter" @mousedown="startDrag($event, 'viz')">

    </div>
    <div class="column node-list" :style="{ width: `${columnWidths.nodeList}%` }">
      <NodeTypeList
          :nodeTypes="nodeTypeOptions"
          :visibleNodeTypes="visibleNodeTypes"
          @toggleNodeType="handleToggleNodeType"
      />
    </div>
  </div>
</template>


<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap');



body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'JetBrains Mono', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.ast-visualizer {
  font-family: 'JetBrains Mono', sans-serif;
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.column {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.visualization {
  position: relative;
}



.node-list {
  background-color: var(--bg-color);
  display: flex;
  flex-direction: column;
}

.splitter {
  width: 4px;
  background-color: var(--border-color);
  cursor: col-resize;
  flex-shrink: 0;
}

.splitter svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  fill: var(--text-color);
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.splitter:hover svg {
  opacity: 1;
}

.canvas-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.info-panel {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: var(--bg-color);
  opacity: 0.9;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 1rem 1rem;
  max-width: 300px;
  overflow-y: auto;
  max-height: calc(100% - 2rem);
  z-index: 1;
  pointer-events: none;
}

.info-panel h3{
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.node-type-list {
  font-family: 'JetBrains Mono', monospace;
  overflow-y: auto;
  flex-grow: 1;
}

.node-type-option {
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.node-type-option label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.node-type-option input[type="checkbox"] {
  display: none;
}

.node-type-toggle input[type="checkbox"] {
  display: none;
}



.node-type-icon {
  margin-left: 0.5rem;
  fill: currentColor;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 10px;
  background-color: var(--node-bg);
  border-radius: 2px;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  width: 9px;
  height: 9px;
  border-radius: 25%;
  background-color: var(--text-color);
  top: 1px;
  left: 1px;
}

.node-type-option input[type="checkbox"]:checked + .toggle-switch {
  background-color: var(--primary-color);
}

.node-type-option input[type="checkbox"]:checked + .toggle-switch::after {
  transform: translateX(10px);
}

.toggle-switch-settings {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 10px;
  background-color: var(--node-bg);
  border-radius: 2px;
}

.toggle-switch-settings::after {
  content: '';
  position: absolute;
  width: 9px;
  height: 9px;
  border-radius: 25%;
  background-color: var(--text-color);
  top: 1px;
  left: 1px;
}

.node-type-toggle input[type="checkbox"]:checked + .toggle-switch-settings{
  background-color: var(--primary-color);
}

.node-type-toggle input[type="checkbox"]:checked + .toggle-switch-settings::after {
  transform: translateX(10px);
}

.node-type-name {
  margin-left: 0.5rem;
  font-size: 0.9rem;
}

/* Ensure Codemirror takes full height of its container */
:deep(.cm-editor) {
  height: 100%;
}

:deep(.cm-scroller) {
  overflow: auto;
}

.settings-container {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 1000;
}


.settings-panel {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: var(--settings-bg-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 1rem;
  min-width: 200px;
}

.settings-panel h3 {
  margin: 0
}

.setting-item {
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}

.setting-item label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.setting-item input[type="checkbox"] {
  margin-right: 0.5rem;
}

.node-type-toggles {
  max-height: 85vh;
  overflow-y: auto;
  margin-top: 10px;
}

.node-type-toggle {
  margin-bottom: 5px;
}

.node-type-toggle label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.node-type-toggle input[type="checkbox"] {
  margin-right: 5px;
}


.cm-editor {
  height: 100%;
  border: 1px solid var(--bg-color);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
}

.cm-scroller {
  overflow: auto;
  font-family: 'JetBrains Mono', monospace !important;
  background: var(--bg-color);
}


.cm-gutters {
  background-color: var(--settings-bg-color) !important;
  //color: #6c6c6c;
  border-right: 1px solid var(--border-color);
}
.cm-activeLineGutter {
  background-color: #f3eb95;
}

::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

::-webkit-scrollbar-track {
  border-radius: 2px;
  background-color: var(--settings-bg-color);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
}

::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: var(--node-bg);
}

:deep(#stats) {
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  #container {
    flex-direction: column;
  }

  #input-container, #visualization {
    width: 100%;
    height: 50%;
  }
}
</style>