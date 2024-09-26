<script setup>
import { ref } from 'vue';
import NodeTypeIcon from "@/components/NodeTypeIcon.vue";

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

function toggleSettings() {
  showSettings.value = !showSettings.value;
}

function toggleAvailableNodeType(type) {
  emit('toggleAvailableNodeType', type);
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
</style>