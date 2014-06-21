'use strict';

/**
 * Selection(start [, end]) holds information about a selection.
 */
function Selection (start, end) {
  this.start = start
  this.end = end || start
}

/**
 * isCollapsed determines if the Selection represents a collapsed
 * selection.
 *
 * @return {Boolean}
 */
Selection.prototype.isCollapsed = function () {
  return this.start[0] === this.end[0] && this.start[1] === this.end[1]
}

module.exports = Selection
