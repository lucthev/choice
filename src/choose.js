'use strict';

var encodePosition = require('./encode'),
    decodePosition = require('./decode'),
    utils = require('./utils')

/**
 * Choice is a module for unobtrusively saving and restoring selections
 * in an element (e.g. a contenteditable editor).
 *
 * @param {Element} elem
 * @param {Boolean} inline
 */
function Choice (elem, inline) {
  if (!(this instanceof Choice))
    return new Choice(elem, inline)

  this.elem = elem
  this.inline = !!inline
}

Choice.prototype.getSelection = function () {
  var sel = window.getSelection(),
      pos

  if (!sel.rangeCount || document.activeElement !== this.elem)
    return false

  if (sel.isCollapsed)
    return encodePosition(this.elem, sel.anchorNode, sel.anchorOffset, this.inline)

  pos = {
    start: encodePosition(this.elem, sel.anchorNode, sel.anchorOffset, this.inline),
    end: encodePosition(this.elem, sel.focusNode, sel.focusOffset, this.inline)
  }

  // We can't simply do !pos.start, because the start/end can be 0.
  if (pos.start === false || pos.end === false)
    return false

  return pos
}

Choice.prototype.restore = function (selection) {
  var errorMsg = 'Invalid selection type provided to Choice#restore',
      sel = window.getSelection(),
      range = document.createRange(),
      start,
      end

  if (!selection && selection !== 0)
    throw new Error(errorMsg)

  if (this.inline && utils.isNum(selection)) {
    start = decodePosition(this.elem, selection)
  } else if (this.inline && utils.isNum(selection.start, selection.end)) {
    start = decodePosition(this.elem, selection.start)
    end = decodePosition(this.elem, selection.end)
  } else if (!this.inline && utils.isArray(selection)) {
    start = decodePosition(this.elem.childNodes[selection[0]], selection[1])
  } else if (!this.inline && utils.isArray(selection.start, selection.end)) {
    start = decodePosition(
      this.elem.childNodes[selection.start[0]],
      selection.start[1]
    )
    end = decodePosition(
      this.elem.childNodes[selection.end[0]],
      selection.end[1]
    )
  } else
    throw new Error(errorMsg)

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

module.exports = Choice
