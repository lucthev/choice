import encodePosition from './encode'
import decodePosition from './decode'
import Selection from './selection'
import toArray from './utils'

const USE_EXTEND = typeof window.getSelection().extend === 'function'

/**
 * Choice is a module for unobtrusively saving and restoring selections
 * in a contenteditable element.
 */
class Choice {
  /*
   * @param {Element} rootElem
   * @param {Function} getChildren
   */
  constructor (rootElem, getChildren = () => toArray(rootElem.childNodes)) {
    // Because of some Firefox bugs.
    if (!rootElem.contentEditable) {
      throw TypeError('Choice requires a contentEditable element.')
    }

    this.elem = rootElem
    this._getChildren = getChildren
  }

  /**
   * getSelection() returns an instance of Choice.Selection with
   * information about the start and end points of the selection.
   *
   * @return {Choice.Selection}
   */
  getSelection () {
    let sel = window.getSelection()
    if (!sel.rangeCount || document.activeElement !== this.elem) {
      return null
    }

    let children = this._getChildren()
    let start = encodePosition(children, sel.anchorNode, sel.anchorOffset)
    let end = null

    if (sel.isCollapsed) {
      end = start
    } else if (start) {
      end = encodePosition(children, sel.focusNode, sel.focusOffset)
    }

    return start && end ? new Selection(start, end) : null
  }

  /**
   * restore(selection) restores a selection from an instance of
   * Choice.Selection.
   *
   * @param {Choice.Selection} selection
   */
  restore (selection) {
    let sel = window.getSelection()

    if (!(selection instanceof Selection)) {
      throw TypeError(`${selection} is not a valid selection.`)
    }

    let children = this._getChildren()
    let start, end

    if (selection.isCollapsed) {
      start = decodePosition(children[selection.end[0]], selection.end[1])
    } else {
      start = decodePosition(children[selection.start[0]], selection.start[1])
      end = decodePosition(children[selection.end[0]], selection.end[1])
    }

    this.elem.focus()

    let range = document.createRange()
    if (USE_EXTEND) {
      range.setStart(start.node, start.offset)
      range.setEnd(start.node, start.offset)

      sel.removeAllRanges()
      sel.addRange(range)

      if (end) {
        sel.extend(end.node, end.offset)
      }
    } else {
      end = end || start
      if (selection.isBackwards) {
        [start, end] = [end, start]
      }

      range.setStart(start.node, start.offset)
      range.setEnd(end.node, end.offset)
      sel.removeAllRanges()
      sel.addRange(range)
    }
  }
}

// Provide the Selection constructor.
Choice.Selection = Selection
Choice.Choice = Choice

export default Choice
