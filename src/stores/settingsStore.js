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
    const highlightDepth = ref(1);
    const nonConnectedOpacity = ref(0.2);
    const updateTrigger = ref(0);
    const currentTemplate = ref('default');

    const availableTemplates = computed(() => Object.keys(nodeTemplates));


    function saveSettings() {
        localStorage.setItem('astVisualizerSettings', JSON.stringify({
            nodeTypes: settings.value,
            linkColors: linkColors.value,
            highlightDepth: highlightDepth.value,
            nonConnectedOpacity: nonConnectedOpacity.value
        }));
        updateTrigger.value += 1;
    }

    function loadSettings() {
        const savedSettings = JSON.parse(localStorage.getItem('astVisualizerSettings'));
        if (savedSettings) {
            return savedSettings.nodeTypes || nodeTemplates.default.nodeTypes;
        }
        return nodeTemplates.default.nodeTypes;
    }



    function resetToDefaults() {
        settings.value = JSON.parse(JSON.stringify(nodeTemplates.default.nodeTypes));
        linkColors.value = {
            normal: 0xAAAAAA,
            hover: 0x00FF00,
            selected: 0x00FF00
        };
        highlightDepth.value = 1;
        nonConnectedOpacity.value = 0.2;
        currentTemplate.value = 'default';
        saveSettings();
    }

    function updateAnimationDuration(duration) {
        animationDuration.value = duration;
        saveSettings();
    }

    function updateNodeTypeSetting(nodeType, property, value) {
        if (!settings.value[nodeType]) {
            settings.value[nodeType] = { ...nodeTemplates.default.nodeTypes[nodeType] };
        }
        settings.value[nodeType][property] = value;
        saveSettings();
    }

    function updateLinkColor(colorType, value) {
        linkColors.value[colorType] = value;
        saveSettings();
    }

    function updateHighlightDepth(depth) {
        highlightDepth.value = depth;
        saveSettings();
    }

    function updateNonConnectedOpacity(opacity) {
        nonConnectedOpacity.value = opacity;
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
        highlightDepth,
        nonConnectedOpacity,
        updateTrigger,
        currentTemplate,
        availableTemplates,
        saveSettings,
        resetToDefaults,
        updateNodeTypeSetting,
        updateLinkColor,
        updateHighlightDepth,
        updateNonConnectedOpacity,
        applyTemplate,
    };
});