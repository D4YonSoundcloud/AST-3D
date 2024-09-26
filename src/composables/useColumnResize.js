import { ref, onMounted, onUnmounted } from 'vue';

export function useColumnResize(initialWidths, onResize) {
    const columnWidths = ref(initialWidths);

    const dragState = ref({
        isDragging: false,
        startX: 0,
        columnToResize: '',
    });

    function startDrag(event, column) {
        dragState.value = {
            isDragging: true,
            startX: event.clientX,
            columnToResize: column,
        };
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }

    function drag(event) {
        if (!dragState.value.isDragging) return;

        const deltaX = event.clientX - dragState.value.startX;
        const totalWidth = window.innerWidth;
        const deltaPercentage = (deltaX / totalWidth) * 100;

        if (dragState.value.columnToResize === 'code') {
            columnWidths.value.codeEditor = Math.max(10, Math.min(60, columnWidths.value.codeEditor + deltaPercentage));
            columnWidths.value.visualization = Math.max(20, Math.min(80, 100 - columnWidths.value.codeEditor - columnWidths.value.nodeList));
        } else if (dragState.value.columnToResize === 'viz') {
            columnWidths.value.visualization = Math.max(20, Math.min(80, columnWidths.value.visualization + deltaPercentage));
            columnWidths.value.nodeList = Math.max(10, Math.min(60, 100 - columnWidths.value.codeEditor - columnWidths.value.visualization));
        }

        dragState.value.startX = event.clientX;
        onResize();
    }

    function stopDrag() {
        dragState.value.isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }

    function handleWindowResize() {
        // Ensure column widths always sum to 100%
        const total = columnWidths.value.codeEditor + columnWidths.value.visualization + columnWidths.value.nodeList;
        if (total !== 100) {
            const adjustmentFactor = 100 / total;
            columnWidths.value.codeEditor *= adjustmentFactor;
            columnWidths.value.visualization *= adjustmentFactor;
            columnWidths.value.nodeList *= adjustmentFactor;
        }
        onResize();
    }

    onMounted(() => {
        window.addEventListener('resize', handleWindowResize);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', handleWindowResize);
    });

    return {
        columnWidths,
        startDrag,
    };
}