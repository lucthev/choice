'use strict'

var encodePosition = require('./encode')
var decodePosition = require('./decode')
var Selection = require('./selection')
var utils = require('./utils')

/**
 * Choice is a module for unobtrusively saving and restoring selections
 * in a contenteditable element.
 *
 * @param {Element} rootElem
 * @param {Function} getChildren
 */
function Choice (rootElem, getChildren) {
  if (!(this instanceof Choice)) {
    return new Choice(rootElem, getChildren)
  }

  // Because of some Firefox bugs.
  if (!rootElem.contentEditable) {
    throw new TypeError('Choice requires a contentEditable element.')
  }

  if (!getChildren) {
    getChildren = function () {
      return utils.toArray(rootElem.childNodes)
    }
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
Choice.prototype.getSelection = function () {
  var sel = window.getSelection()
  var children
  var start
  var end

  if (!sel.rangeCount || document.activeElement !== this.elem) {
    return null
  }

  children = this._getChildren()

  start = encodePosition(children, sel.anchorNode, sel.anchorOffset)

  if (sel.isCollapsed) {
    end = start
  } else if (start) {
    end = encodePosition(children, sel.focusNode, sel.focusOffset)
  }

  if (!start || !end) {
    return null
  }

  return new Selection(start, end)
}

/**
 * restore(selection) restores a selection from an instance of
 * Choice.Selection.
 *
 * @param {Choice.Selection} selection
 */
Choice.prototype.restore = function (selection) {
  var sel = window.getSelection()
  var range = document.createRange()
  var children
  var start
  var end

  if (!(selection instanceof Selection)) {
    throw TypeError('"' + selection + '" is not a valid selection.')
  }

  children = this._getChildren()

  if (selection.isCollapsed()) {
    start = decodePosition(children[selection.end[0]], selection.end[1])
  } else {
    start = decodePosition(children[selection.start[0]], selection.start[1])
    end = decodePosition(children[selection.end[0]], selection.end[1])
  }

  this.elem.focus()

  range.setStart(start.node, start.offset)
  range.setEnd(start.node, start.offset)

  sel.removeAllRanges()
  sel.addRange(range)

  if (end) {
    sel.extend(end.node, end.offset)
  }
}

/**
 * Choice.support() determines if the APIs Choice relies on are
 * present, namely the native Selection#extend()
 *
 * @return {Boolean}
 */
Choice.support = function () {
  var sel = window.getSelection()

  return document.createRange && typeof sel.extend === 'function'
}

// Provide the Selection constructor.
Choice.Selection = Selection

module.exports = Choice
