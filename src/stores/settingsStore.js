import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { nodeTemplates } from '../templates/nodeTemplates';

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref(JSON.parse(localStorage.getItem('astVisualizerSettings')) || nodeTemplates.default.nodeTypes);
    const linkColors = ref({
        normal: 0xAAAAAA,
        hover: 0x00FF00,
        selected: 0x00FF00
    });
    const updateTrigger = ref(0);
    const currentTemplate = ref('default');

    const availableTemplates = computed(() => Object.keys(nodeTemplates));

    function saveSettings() {
        localStorage.setItem('astVisualizerSettings', JSON.stringify({
            nodeTypes: settings.value,
            linkColors: linkColors.value
        }));
        updateTrigger.value += 1;
    }

    function resetToDefaults() {
        settings.value = JSON.parse(JSON.stringify(nodeTemplates.default.nodeTypes));
        linkColors.value = {
            normal: 0xAAAAAA,
            hover: 0x00FF00,
            selected: 0x00FF00
        };
        currentTemplate.value = 'default';
        saveSettings();
    }

    function updateNodeTypeSetting(nodeType, property, value) {
        settings.value[nodeType][property] = value;
        saveSettings();
    }

    function updateLinkColor(colorType, value) {
        linkColors.value[colorType] = value;
        saveSettings();
    }

    function applyTemplate(templateName) {
        if (nodeTemplates[templateName]) {
            settings.value = JSON.parse(JSON.stringify(nodeTemplates[templateName].nodeTypes));
            currentTemplate.value = templateName;
            saveSettings();
        }
    }

    return {
        settings,
        linkColors,
        updateTrigger,
        currentTemplate,
        availableTemplates,
        saveSettings,
        resetToDefaults,
        updateNodeTypeSetting,
        updateLinkColor,
        applyTemplate,
    };
});