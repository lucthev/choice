'use strict'

/**
 * Selection(start [, end]) holds information about a selection.
 *
 * @param {Array} start
 * @param {Array} end
 * @return {Selection}
 */
function Selection (start, end) {
  if (!(this instanceof Selection)) {
    return new Selection(start, end)
  }

  this.start = start
  this.end = end || start.slice()
}

/**
 * absoluteStart() returns the endpoint that is first in document order.
 *
 * @return {Array}
 */
Selection.prototype.absoluteStart = function () {
  return this.isBackwards() ? this.end : this.start
}

/**
 * absoluteStart() returns the endpoint that is first in document order.
 *
 * @return {Array}
 */
Selection.prototype.absoluteEnd = function () {
  return this.isBackwards() ? this.start : this.end
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
  if (!(other instanceof Selection)) {
    return false
  }

  return (
    this.start[0] === other.start[0] &&
    this.start[1] === other.start[1] &&
    this.end[0] === other.end[0] &&
    this.end[1] === other.end[1]
  )
}

/**
 * clone() returns a Selection identical to that it was called on.
 *
 * @return {Selection}
 */
Selection.prototype.clone = function () {
  return new Selection(this.start.slice(), this.end.slice())
}

/**
 * Selection.equals(first, second) is a static method similar to the
 * Selection#equals method, but it can be used to determine the equality
 * of two null selections.
 *
 * @param {Selection} first
 * @param {Selection} second
 * @return {Boolean}
 */
Selection.equals = function (first, second) {
  if (!first || !second) {
    return first === null && second === null
  }

  return first instanceof Selection && first.equals(second)
}

module.exports = Selection
