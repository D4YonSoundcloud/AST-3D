import { ViewPlugin, EditorView } from '@codemirror/view'

/**
 * Creates a CodeMirror plugin that scrolls to a specific line
 * @param {function} getLine - A function that returns the current line to scroll to
 * @returns {Extension} CodeMirror extension
 */
export function scrollPlugin(getLine) {
    return ViewPlugin.fromClass(class {
        constructor(view) {
            this.view = view
            this.scrollToLine()
        }

        update(update) {
            if (update.docChanged || update.viewportChanged) {
                this.scrollToLine()
            }
        }

        scrollToLine() {
            const line = getLine()
            console.log(line)
            if (line !== null) {
                const pos = this.view.state.doc.line(line).from
                this.view.dispatch({
                    effects: EditorView.scrollIntoView(pos, { y: 'center' })
                })
            }
        }
    })
}