<script setup>
import {ref, onMounted, watch, nextTick, computed} from 'vue';
import { EditorState, EditorSelection } from '@codemirror/state';
import { keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab, undo, redo } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, basicSetup  } from "codemirror";
import { foldGutter, foldKeymap, foldAll, unfoldAll } from '@codemirror/language';
import {defaultHighlightStyle, HighlightStyle, syntaxHighlighting} from "@codemirror/language";
import { syntaxTree } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { useAstStore } from '../stores/astStore';

// import { monokai } from "@uiw/codemirror-theme-monokai";
// import { solarizedLight, solarizedDark  } from "@uiw/codemirror-theme-solarized";
// import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
// import { materialDark } from '@uiw/codemirror-theme-material';
// import { nord } from "@uiw/codemirror-theme-nord";

const astStore = useAstStore();

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const editorRef = ref(null);
let editorView = null;
const isFolded = ref(false);
const cursorPosition = ref({ line: 1, column: 1 });
const currentLanguage = ref('javascript');

// const themes = {
//   'One Dark': oneDark,
//   'Nord': nord,
//   'Solarized Light': solarizedLight,
//   'Material Dark': materialDark,
//   'GitHub Light': githubLight,
//   'GitHub Dark': githubDark,
//   'Monokai': monokai
// };

const currentTheme = ref('One Dark');

// const themeExtension = computed(() => themes[currentTheme.value]);

function cursorPositionExtension() {
  return EditorView.updateListener.of((update) => {
    if (update.selectionSet || update.docChanged) {
      const pos = update.state.selection.main.head;
      const line = update.state.doc.lineAt(pos);
      cursorPosition.value = { line: line.number, column: pos - line.from + 1 };
    }
  });
}

function createEditor() {

  const startState = EditorState.create({
    doc: props.modelValue,
    extensions: [
      javascript(),
      oneDark,
      lineNumbers(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      history(),
      foldGutter(),
      cursorPositionExtension(),
      EditorState.allowMultipleSelections.of(true),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        ...foldKeymap,
        indentWithTab
      ]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          emit('update:modelValue', update.state.doc.toString());
        }
      }),
      EditorView.theme({
        "&": {
          height: "calc(100% - 80px)",
          fontSize: "14px"
        },
        ".cm-gutters": {
          backgroundColor: "var(--node-bg)",
          color: "#6c6c6c",
          border: "none",
          borderRight: "1px solid var(--border-color)",
        },
        ".cm-activeLineGutter": {
          backgroundColor: "var(--hover-color)",
        },
        ".cm-activeLine": {
          backgroundColor: "var(--hover-color)",
        },
        ".cm-foldGutter": {
          width: "14px",
        },
        ".cm-foldGutter .cm-gutterElement": {
          padding: "0 2px",
          cursor: "pointer",
        },
        // Add explicit syntax highlighting styles
      }),
    ],
  });

  nextTick(() => {
    editorView = new EditorView({
      state: startState,
      parent: editorRef.value,
    });
  });


}

// function changeTheme(newTheme) {
//   currentTheme.value = newTheme;
//   editorView.dispatch({
//     effects: EditorView.reconfigure.of(themeExtension.value)
//   });
// }

function updateContent(newValue) {
  if (editorView && newValue !== editorView.state.doc.toString()) {
    editorView.dispatch({
      changes: { from: 0, to: editorView.state.doc.length, insert: newValue }
    });
  }
}

function handleUndo() {
  undo(editorView);
}

function handleRedo() {
  redo(editorView);
}

function handleFoldToggle() {
  if (isFolded.value) {
    unfoldAll(editorView);
  } else {
    foldAll(editorView);
  }
  isFolded.value = !isFolded.value;
}

function handleClear() {
  editorView.dispatch({
    changes: { from: 0, to: editorView.state.doc.length, insert: '' }
  });
}

/**
 * Highlights the code corresponding to the selected AST node and scrolls to show context
 * @param {Object} node - The selected AST node
 */
function highlightNode(node) {
  if (!node || !editorView) return;

  let start, end;

   if (node.type === 'BlockStatement' && node.loc) {
    // For BlockStatement, find the position of the opening and closing braces
    const docText = editorView.state.doc.toString();
    const openBracePos = docText.indexOf('{', editorView.state.doc.line(node.loc.start.line).from + node.loc.start.column - 1);
    const closeBracePos = docText.lastIndexOf('}', editorView.state.doc.line(node.loc.end.line).from + node.loc.end.column - 1);

    if (openBracePos !== -1 && closeBracePos !== -1) {
      // Highlight the content inside the braces
      start = openBracePos + 1;
      end = closeBracePos;
    }
  } else if (node.loc) {
    // For other node types, use the existing logic
    const startLine = editorView.state.doc.line(node.loc.start.line);
    const endLine = editorView.state.doc.line(node.loc.end.line);
    if (!startLine || !endLine) return;
    start = startLine.from + node.loc.start.column - 1;
    end = endLine.from + node.loc.end.column - 1;
  }

  if (start !== undefined && end !== undefined) {
    // Ensure start and end are within valid range
    start = Math.max(0, Math.min(start, editorView.state.doc.length));
    end = Math.max(start, Math.min(end, editorView.state.doc.length));

    const selection = EditorSelection.create([EditorSelection.range(start, end)]);

    // Calculate the line number for the start of the highlight
    const startLine = editorView.state.doc.lineAt(start).number;

    // Calculate the line that should be at the top of the view (10 lines above, but not less than line 1)
    const topLine = Math.max(1, startLine - 10);

    editorView.dispatch({
      selection,
      effects: EditorView.scrollIntoView(selection.main, {
        y: 'start',
        yMargin: 0,
        targetLine: topLine
      })
    })

    ensureEditorFocus()
  }
}

function ensureEditorFocus() {
  if (editorView) {
    editorView.focus();
  }
}

function forceEditorUpdate() {
  if (editorView) {
    editorView.requestMeasure();
  }
}

watch(() => props.modelValue, updateContent);

watch(() => astStore.currentNodeData, (newNode) => {
  if (newNode && editorView) {
    highlightNode(newNode);
  } else if (editorView) {
    // Clear selection if no node is selected
    editorView.dispatch({selection: EditorSelection.cursor(0)});
  }
  nextTick(() => {
    if (editorView) {
      editorView.requestMeasure();
    }
  });
}, { deep: true });

onMounted(() => {
  nextTick(() => {
    createEditor();
    forceEditorUpdate();
  });
});
</script>

<template>
  <div class="code-editor-container">
    <div class="toolbar">
      <button @click="handleUndo" title="Undo">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 7v6h6"></path>
          <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"></path>
        </svg>
      </button>
      <button @click="handleRedo" title="Redo">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 7v6h-6"></path>
          <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"></path>
        </svg>
      </button>
      <button @click="handleFoldToggle" :title="isFolded ? 'Unfold All' : 'Fold All'">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ 'rotated': isFolded }">
          <path d="M12 22v-6"></path>
          <path d="M12 8V2"></path>
          <path d="M4 12H2"></path>
          <path d="M10 12H8"></path>
          <path d="M16 12h-2"></path>
          <path d="M22 12h-2"></path>
        </svg>
      </button>
      <button @click="handleClear" title="Clear">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      </button>
    </div>
    <div ref="editorRef" class="code-editor"></div>
    <div class="status-bar">
      <span>Ln {{ cursorPosition.line }}, Col {{ cursorPosition.column }}</span>
      <span>{{ currentLanguage }}</span>
    </div>
  </div>
</template>

<style scoped>
.code-editor-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  justify-content: start;
  gap: 10px;
  padding: 0.25rem 1rem;
  background-color: var(--settings-bg-color);
  border-bottom: 1px solid var(--settings-bg-color);
}

.toolbar button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  background-color: var(--settings-bg-color);
  border: 1px solid var(--settings-bg-color);
  color: var(--text-color);
  border-radius: 4px;
  cursor: pointer;
}

.toolbar button:hover {
  border: 1px solid var(--primary-color);
  background-color: var(--border-color);
}

.toolbar button svg {
}

.toolbar button svg.rotated {
  transform: rotate(90deg);
}

.code-editor {
  flex-grow: 1;
  overflow: auto;
  cursor: text;
}

:deep(.cm-editor) {
  height: 100%;
  color: inherit; /* Use the default color */
}

:deep(.cm-scroller) {
  font-family: 'JetBrains Mono', monospace !important;
  background: var(--bg-color);
}

:deep(.cm-content) {
  color: var(--text-color); /* Set the base text color */
}

/* Remove any potential override of syntax highlighting */
:deep(.cm-line) {
  color: inherit;
}

:deep(.cm-scroller) {
  overflow: auto;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  background-color: var(--bg-color);
  border-top: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-color);
}
</style>