<script setup>
import { computed } from 'vue';
import NodeTypeIcon from "@/components/NodeTypeIcon.vue";
import { getNodeDescription } from '../assets/astNodeConfig';

const props = defineProps({
  nodeTypes: {
    type: Array,
    required: true
  },
  visibleNodeTypes: {
    type: Set,
    required: true
  }
});

const emit = defineEmits(['toggleNodeType']);

const nodeTypeOptions = computed(() => {
  return props.nodeTypes.map(type => ({
    type,
    description: getNodeDescription(type)
  }));
});

function handleToggleNodeType(type) {
  emit('toggleNodeType', type);
}
</script>

<template>
  <div class="node-list">
    <h3>
      <svg class="node-type-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
        <circle cx="7" cy="7" r="3" fill="currentColor"/>
        <circle cx="17" cy="7" r="3" fill="currentColor"/>
        <circle cx="12" cy="17" r="4" fill="currentColor"/>
        <line x1="17" y1="7" x2="12" y2="17" stroke="currentColor" stroke-width="2"/>
      </svg>
      Toggle</h3>
    <div class="node-type-list">
      <div v-for="option in nodeTypeOptions" :key="option.type" class="node-type-option" @click="handleToggleNodeType(option.type)">
        <label :title="option.description" @click="handleToggleNodeType(option.type)">
          <input type="checkbox"
                 :checked="visibleNodeTypes.has(option.type)"
                 @change="handleToggleNodeType(option.type)"
                 @keydown.enter="handleToggleNodeType(option.type)">
          <span class="toggle-switch"></span>
          <NodeTypeIcon :type="option.type"></NodeTypeIcon>
          <span class="node-type-name">{{ option.type }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.node-list {
  background-color: var(--bg-color);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.node-list h3 {
  padding: 0.5rem 1rem;
  font-family: 'JetBrains Mono', monospace;
  margin: 0;
  background: var(--settings-bg-color);
}

.node-type-list {
  padding-top: 0.5rem;
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

.node-type-option:hover {
  background: var(--hover-color);
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

.node-type-name {
  margin-left: 0.5rem;
  font-size: 0.9rem;
}

h3 .node-type-icon {
  transform: rotateX(180deg);
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 0.5rem;
  margin-left: 0
}

h3 {
  display: flex;
  align-items: center;
}
</style>