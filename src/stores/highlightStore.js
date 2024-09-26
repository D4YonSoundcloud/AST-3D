import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHighlightStore = defineStore('highlight', () => {
    const highlightColor = ref('#FFA500') // Default orange color
    const highlightedNodeIds = ref(new Set())
    const highlightedLines = ref(new Set())

    function setHighlightColor(color) {
        highlightColor.value = color
    }

    function addHighlightedNodeId(nodeId) {
        highlightedNodeIds.value.add(nodeId)
    }

    function removeHighlightedNodeId(nodeId) {
        highlightedNodeIds.value.delete(nodeId)
    }

    function clearHighlightedNodeIds() {
        highlightedNodeIds.value.clear()
    }

    function setHighlightedLines(lines) {
        highlightedLines.value = new Set(lines)
    }

    function clearHighlightedLines() {
        highlightedLines.value.clear()
    }

    return {
        highlightColor,
        highlightedNodeIds,
        highlightedLines,
        setHighlightColor,
        addHighlightedNodeId,
        removeHighlightedNodeId,
        clearHighlightedNodeIds,
        setHighlightedLines,
        clearHighlightedLines
    }
})