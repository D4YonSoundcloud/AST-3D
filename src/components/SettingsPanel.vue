<script setup>
import {computed, ref, watch} from 'vue';
import { useSettingsStore } from '../stores/settingsStore';
import { useAstStore } from '../stores/astStore';
import NodeTypeIcon from "@/components/NodeTypeIcon.vue";

const settingsStore = useSettingsStore();
const astStore = useAstStore();


const props = defineProps({
  availableNodeTypes: {
    type: Set,
    required: true
  },
  allNodeTypes: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['toggleAvailableNodeType']);

const showSettings = ref(false);
const editingNodeType = ref(null);

const nodeTypes = computed(() => Object.keys(settingsStore.settings));
const geometryOptions = computed(() => ['sphere', 'cube', 'tetrahedron', 'octahedron', 'icosahedron']);


function startEditingNodeType(nodeType) {
  editingNodeType.value = nodeType;
}

function updateNodeTypeSetting(nodeType, property, value) {
  settingsStore.updateNodeTypeSetting(nodeType, property, value);
  astStore.triggerVisualizationUpdate();
}

function updateLinkColor(colorType, value) {
  settingsStore.updateLinkColor(colorType, parseInt(value.slice(1), 16));
  astStore.triggerVisualizationUpdate();
}

function resetToDefaults() {
  settingsStore.resetToDefaults();
  astStore.triggerVisualizationUpdate();
}

function toggleSettings() {
  showSettings.value = !showSettings.value;
}

function toggleAvailableNodeType(type) {
  emit('toggleAvailableNodeType', type);
}

function updateHighlightDepth(event) {
  const depth = parseInt(event.target.value);
  settingsStore.updateHighlightDepth(depth);
  astStore.triggerVisualizationUpdate();
}

function applyTemplate(templateName) {
  if (templateName) {
    settingsStore.applyTemplate(templateName);
    astStore.triggerVisualizationUpdate();
  }
}


</script>

<template>
  <div class="settings-container">
    <button @click="toggleSettings" class="settings-icon" :class="{ 'active': showSettings }">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        <path d="M10.5 13.5L7 17"/>
        <path d="M8.5 8.5L5 12"/>
      </svg>
    </button>
    <div v-if="showSettings" class="settings-panel">
      <h3>Settings</h3>
      <div class="node-type-settings">
        <button @click="resetToDefaults" class="reset-button">Reset to Defaults</button>
        <select v-model="settingsStore.currentTemplate" @change="applyTemplate(settingsStore.currentTemplate)" class="template-select">
          <option v-for="template in settingsStore.availableTemplates" :key="template" :value="template">
            {{ template }}
          </option>
        </select>
        <div v-for="nodeType in nodeTypes" :key="nodeType" class="node-type-setting">
          <div class="node-type-header" @click="startEditingNodeType(nodeType)">
            <NodeTypeIcon :type="nodeType"></NodeTypeIcon>
            <span>{{ nodeType }}</span>
          </div>
          <div v-if="editingNodeType === nodeType" class="node-type-editor">
            <div class="color-picker">
              <label>Color:</label>
              <input type="color"
                     :value="'#' + settingsStore.settings[nodeType].color.toString(16).padStart(6, '0')"
                     @input="updateNodeTypeSetting(nodeType, 'color', parseInt($event.target.value.slice(1), 16))">
            </div>
            <div class="shape-selector">
              <label>Shape:</label>
              <select :value="settingsStore.settings[nodeType].shape"
                      @change="updateNodeTypeSetting(nodeType, 'shape', $event.target.value)">
                <option v-for="option in geometryOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="link-color-settings">
        <h4>Link Colors</h4>
        <div class="color-picker">
          <label>Normal:</label>
          <input type="color"
                 :value="'#' + settingsStore.linkColors.normal.toString(16).padStart(6, '0')"
                 @input="updateLinkColor('normal', $event.target.value)">
        </div>
        <div class="color-picker">
          <label>Hover:</label>
          <input type="color"
                 :value="'#' + settingsStore.linkColors.hover.toString(16).padStart(6, '0')"
                 @input="updateLinkColor('hover', $event.target.value)">
        </div>
        <div class="color-picker">
          <label>Selected:</label>
          <input type="color"
                 :value="'#' + settingsStore.linkColors.selected.toString(16).padStart(6, '0')"
                 @input="updateLinkColor('selected', $event.target.value)">
        </div>
      </div>
      <h4>Available Node Types</h4>
      <div class="node-type-toggles">
        <div v-for="type in allNodeTypes" :key="type" class="node-type-toggle" @click="toggleAvailableNodeType(type)">
          <label @click="toggleAvailableNodeType(type)">
            <input type="checkbox"
                   :checked="availableNodeTypes.has(type)"
                   @keydown.enter="toggleAvailableNodeType(type)"
                   @change="toggleAvailableNodeType(type)">
            <span class="toggle-switch-settings"></span>
            <NodeTypeIcon :type="type"></NodeTypeIcon>
            <span class="node-type-name">{{ type }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.highlight-depth-setting {
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: var(--node-bg);
  border-radius: 4px;
}

.highlight-depth-setting h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.highlight-depth-setting input {
  width: 50px;
  padding: 0.25rem;
  margin-right: 0.5rem;
}

.depth-description {
  font-size: 0.9rem;
  color: var(--text-color);
}

.link-color-settings {
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: var(--node-bg);
  border-radius: 4px;
}

.link-color-settings h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.settings-actions {
  display: flex;
  align-items: center;
}

.settings-container {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 1000;
}

.settings-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 10%;
}

.settings-icon svg {
  width: 22px;
  height: 22px;
  color: var(--text-color);
}

.settings-icon:hover, .settings-icon.active {
  background-color: rgba(255, 255, 255, 0.1);
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

.settings-panel h3, .settings-panel h4 {
  margin: 0 0 1rem 0;
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
  display: none;
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

.node-type-toggle input[type="checkbox"]:checked + .toggle-switch-settings {
  background-color: var(--primary-color);
}

.node-type-toggle input[type="checkbox"]:checked + .toggle-switch-settings::after {
  transform: translateX(10px);
}

.node-type-name {
  margin-left: 0.5rem;
  font-size: 0.9rem;
}

.node-type-settings {
  max-height: 70vh;
  overflow-y: auto;
  margin-bottom: 0.5rem;
}

.node-type-setting {
  margin-bottom: 10px;
}

.node-type-header {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.node-type-editor {
  margin-top: 10px;
  padding: 10px;
  background-color: var(--settings-bg-color);
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.color-picker,
.shape-selector {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.color-picker label,
.shape-selector label {
  flex: 0 0 60px; /* Adjust this width as needed */
  margin-right: 10px;
  font-size: 0.8rem;
}

input[type="color"] {
  -webkit-appearance: none;
  flex: 1;
  height: 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: transparent;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
  box-shadow: 0 0 0 1px var(--border-color);
}

select {
  font-family: "JetBrains Mono";
  flex: 1;
  padding: 5px 25px 5px 10px; /* Increased right padding for the arrow */
  font-size: 0.8rem;
  color: var(--text-color);
  background-color: var(--node-bg);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 5px top 50%;
  background-size: 12px auto;
}

select:hover,
select:focus {
  border-color: var(--primary-color);
}

select option {
  background-color: var(--node-bg);
  color: var(--text-color);
}

/* Adjust the existing styles for consistency */
.settings-panel {
  background-color: var(--settings-bg-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 1rem;
  min-width: 250px;
  max-width: 300px;
}

.node-type-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
}

.node-type-header:hover {
  background-color: var(--hover-color);
}

.node-type-header span {
  margin-left: 10px;
  font-size: 0.9rem;
}

.reset-button {
  margin-left: 2.5%;
  width: 95%;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border: 1px solid var(--primary-color);
  background-color: var(--settings-bg-color);
  color: var(--text-color);
  font-family: "JetBrains Mono", sans-serif;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.reset-button:hover {
  border: 1px solid var(--primary-color);
  background-color: var(--border-color);
}

.template-select {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  background-color: var(--node-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
}
</style>