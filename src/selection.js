'use strict';

/**
 * Selection(start [, end]) holds information about a selection.
 */
function Selection (start, end) {
  this.start = start
  this.end = end || start
}

/**
 * isCollapsed() determines if the Selection represents a collapsed
 * selection.
 *
 * @return {Boolean}
 */
Selection.prototype.isCollapsed = function () {
  return this.start[0] === this.end[0] && this.start[1] === this.end[1]
}

/**
 * isBackwards() determines if the Selection represents a backwards
 * selection.
 *
 * @return {Boolean}
 */
Selection.prototype.isBackwards = function () {
  return this.start[0] > this.end[0] ||
    (this.start[0] === this.end[0] && this.start[1] > this.end[1])
}

/**
 * equals(other) determines if two selections are equivalent.
 *
 * @param {Selection} other
 * @return {Boolean}
 */
Selection.prototype.equals = function (other) {
  if (!(other instanceof Selection))
    return false

  return this.start[0] === other.start[0] &&
         this.start[1] === other.start[1] &&
         this.end[0] === other.end[0] &&
         this.end[1] === other.end[1]
}

module.exports = Selection
