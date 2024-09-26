<script setup>
import {ref, watch} from 'vue';
import {useAstStore} from "@/stores/astStore.js";
import {storeToRefs} from "pinia";


const astStore = useAstStore()

const props = defineProps({
  nodeData: {
    type: Object,
    default: null
  }
});

const infoPanelContent = ref('');

function updateInfoPanel(nodeData) {
  if (nodeData) {
    let content = `
      <h3>${nodeData.type}</h3>
      <p><strong>ID:</strong> ${nodeData.id}</p>
      <p><strong>Location:</strong> Line ${nodeData.loc.start.line}, Column ${nodeData.loc.start.column}</p>
      <p><strong>Scope Level:</strong> ${nodeData.scopeLevel}</p>
    `;

    switch (nodeData.type) {
      case 'FunctionDeclaration':
      case 'FunctionExpression':
        content += `
          <p><strong>Name:</strong> ${nodeData.name}</p>
          <p><strong>Parameters:</strong> ${nodeData.params.join(', ')}</p>
        `;
        break;
      case 'VariableDeclaration':
        content += `
          <p><strong>Kind:</strong> ${nodeData.kind}</p>
          <p><strong>Declarations:</strong></p>
          <ul>
            ${nodeData.declarations.map(d => `<li>${d.name}${d.init ? ` (initialized as ${d.init})` : ''}</li>`).join('')}
          </ul>
        `;
        break;
      case 'CallExpression':
        content += `
          <p><strong>Callee:</strong> ${nodeData.callee}</p>
          <p><strong>Arguments:</strong> ${nodeData.arguments}</p>
        `;
        break;
    }

    content += `
      <p><strong>Children:</strong> ${nodeData.children.length}</p>
      <p><strong>Dependencies:</strong> ${nodeData.dependencies.length}</p>
    `;

    infoPanelContent.value = content;
    astStore.setCurrentNodeData(nodeData)
  } else {
    astStore.setCurrentNodeData(null)
    infoPanelContent.value = '<p style="margin: 0">Hover over a node to see details</p>';
  }
}

// Watch for changes in props.nodeData
watch(() => props.nodeData, updateInfoPanel, { immediate: true });
</script>

<template>
  <div class="info-panel" v-html="infoPanelContent"></div>
</template>

<style scoped>
.info-panel {
  position: absolute;
  top: 0.5rem;
  right: 3.5rem;
  background-color: var(--bg-color);
  opacity: 0.9;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 1rem 1rem;
  max-width: 325px;
  overflow-y: auto;
  max-height: calc(100% - 2rem);
  z-index: 1;
  pointer-events: none;
}

.info-panel h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}
</style>