<script setup>
import { ref, watch, computed } from 'vue';
import { useSettingsStore } from '../stores/settingsStore';
import { storeToRefs } from 'pinia';

const settingsStore = useSettingsStore();
const { highlightDepth, modelType } = storeToRefs(settingsStore);

const props = defineProps({
  maxPossibleDepth: {
    type: Number,
    default: 0
  },
  boxVisible: {
    type: Boolean,
    required: true
  }
});

const localHighlightDepth = ref(settingsStore.highlightDepth);
const localNonConnectedOpacity = ref(settingsStore.nonConnectedOpacity);
const highlightDirection = ref('down');

const isMaxDepth = computed(() => {
  return props.maxPossibleDepth > 0 && localHighlightDepth.value >= props.maxPossibleDepth;
});

const modelTypes = ['city', 'tree', 'tree2d'];

const emit = defineEmits([
  'toggleBoundingBox'
]);

function updateHighlightDepth(event) {
  const newDepth = parseInt(event.target.value);
  settingsStore.updateHighlightDepth(newDepth);
}

function updateNonConnectedOpacity(event) {
  const newOpacity = parseFloat(event.target.value);
  settingsStore.updateNonConnectedOpacity(newOpacity);
}

function toggleHighlightDirection() {
  highlightDirection.value = highlightDirection.value === 'down' ? 'up' : 'down';
  settingsStore.updateHighlightDirection(highlightDirection.value);
}

function changeModelType(event) {
  settingsStore.updateModelType(event.target.value);
}

function toggleBoundingBox() {
  emit('toggleBoundingBox');
}

watch(() => settingsStore.highlightDepth, (newDepth) => {
  localHighlightDepth.value = newDepth;
});

watch(() => settingsStore.nonConnectedOpacity, (newOpacity) => {
  localNonConnectedOpacity.value = newOpacity;
});

</script>

<template>
  <div class="visualization-controls">
    <div class="control-group">
      <div class="node-type-option" @click="toggleBoundingBox">
        <label>
          <input type="checkbox" :checked="boxVisible" @change="toggleBoundingBox">
          <span class="toggle-switch"></span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.29 7 12 12 20.71 7" />
            <line x1="12" y1="22" x2="12" y2="12" />
          </svg>
          <span class="node-type-name">Boundary</span>
        </label>
      </div>
    </div>

    <div class="control-group">
      <label for="depth-level">
        Depth Level: {{ isMaxDepth ? '[MAX]' : '' }}
      </label>
      <select
          id="depth-level"
          :value="localHighlightDepth"
          @change="updateHighlightDepth"
      >
        <option v-for="i in (props.maxPossibleDepth > 0 ? props.maxPossibleDepth + 1 : 26)" :key="i-1" :value="i-1">
          {{ i-1 }}
        </option>
      </select>
    </div>
    <div class="control-group">
      <label for="opacity">Non-connected Opacity: {{ localNonConnectedOpacity.toFixed(2) }}</label>
      <input style="margin: 0; width: 95%; cursor: ew-resize;"
          type="range"
          id="opacity"
          v-model="localNonConnectedOpacity"
          min="0"
          max="1"
          step="0.01"
          @input="updateNonConnectedOpacity"
      >
    </div>
    <div class="control-group">
      <label for="model-type">Model:</label>
      <select
          id="model-type"
          :value="modelType"
          @change="changeModelType"
      >
        <option v-for="type in modelTypes" :key="type" :value="type">
          {{ type.charAt(0).toUpperCase() + type.slice(1) }}
        </option>
      </select>
    </div>


<!--    <div class="control-group">-->
<!--      <label for="direction">Highlight Direction:</label>-->
<!--      <button id="direction" @click="toggleHighlightDirection">-->
<!--        {{ highlightDirection === 'down' ? 'Down ▼' : 'Up ▲' }}-->
<!--      </button>-->
<!--    </div>-->
<!--    <div class="control-group">-->
<!--      <label for="animation-duration">Animation Duration: {{ settingsStore.animationDuration.toFixed(2) }}s</label>-->
<!--      <input style="margin: 0; width: 95%; cursor: grab;"-->
<!--          type="range"-->
<!--          id="animation-duration"-->
<!--          v-model="settingsStore.animationDuration"-->
<!--          min="0.1"-->
<!--          max="2"-->
<!--          step="0.1"-->
<!--          @input="settingsStore.updateAnimationDuration(parseFloat($event.target.value))"-->
<!--      >-->
<!--    </div>-->
  </div>
</template>

<style scoped>
.visualization-controls {
  display: grid;
  gap: 0.5rem;
  padding: 0.5rem;
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  z-index: 10;
}

.control-group {
}

button {
  padding: 5px 10px;
  background-color: var(--node-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
}

button:hover {
  background-color: var(--hover-color);
}

label {
  display: block;
  margin-bottom: 5px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
}

select, input[type="range"] {
  width: 100%;
  padding: 5px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--node-bg);
  color: var(--text-color);
  font-family: 'JetBrains Mono', monospace;
}

select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 5px top 50%;
  background-size: 12px auto;
  padding-right: 25px;
}

input[type="range"] {
  -webkit-appearance: none;
  height: 16px;
  background: var(--border-color);
  outline: none;
  opacity: 0.7;
}

input[type="range"]:hover {
  opacity: 1;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary-color);
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: grabbing;
}

.visualization-controls label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.visualization-controls input[type="checkbox"] {
  cursor: pointer;
}

.node-type-option {
  padding: 0.5rem 0rem;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.node-type-option label {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
}

.node-type-option input[type="checkbox"] {
  display: none;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 10px;
  background-color: var(--node-bg);
  border-radius: 2px;
  margin-right: 0.5rem;
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

svg {
  color: var(--text-color);
}
</style>