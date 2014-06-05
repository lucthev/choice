'use strict';

var encodePosition = require('./encode')

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

  if (!sel.rangeCount) return false

  if (sel.isCollapsed)
    return encodePosition(this.elem, sel.anchorNode, sel.anchorOffset)

  pos = {
    start: encodePosition(this.elem, sel.anchorNode, sel.anchorOffset),
    end: encodePosition(this.elem, sel.focusNode, sel.focusOffset)
  }

  if (!pos.start || !pos.end)
    return false

  return pos
}

module.exports = Choice
