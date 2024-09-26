import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAstStore } from '../stores/astStore';
import { getNodeDescription } from '../assets/astNodeConfig';

export function useNodeTypes() {
    const astStore = useAstStore();
    const { availableNodeTypes, visibleNodeTypes, currentAstNodeTypes } = storeToRefs(astStore);

    const availableNodeTypesArray = computed(() => Array.from(availableNodeTypes.value));

    const visibleNodeTypesArray = computed(() => {
        return Array.from(currentAstNodeTypes.value).filter(type => availableNodeTypes.value.has(type));
    });

    const nodeTypeOptions = computed(() => {
        return visibleNodeTypesArray.value.map(type => ({
            type,
            description: getNodeDescription(type)
        }));
    });

    function toggleAvailableNodeType(type) {
        astStore.toggleAvailableNodeType(type);
    }

    function toggleVisibleNodeType(type) {
        astStore.toggleVisibleNodeType(type);
    }

    return {
        availableNodeTypesArray,
        visibleNodeTypesArray,
        nodeTypeOptions,
        toggleAvailableNodeType,
        toggleVisibleNodeType
    };
}