class Selection {
  /**
   * Selection(start[, end]) holds information about a selection.
   *
   * @param {Array} start
   * @param {Array} end
   */
  constructor (start, end = start.slice()) {
    this.start = start
    this.end = end
  }

  /**
   * absoluteStart is a getter that returns the endpoint that is first
   * in document order.
   *
   * @return {Array}
   */
  get absoluteStart () {
    return this.isBackwards ? this.end : this.start
  }

  /**
   * absoluteEnd is a getter that returns the endpoint that is last
   * in document order.
   *
   * @return {Array}
   */
  get absoluteEnd () {
    return this.isBackwards ? this.start : this.end
  }

  /**
   * isCollapsed is a getter that determines if the Selection represents a
   * collapsed selection.
   *
   * @return {Boolean}
   */
  get isCollapsed () {
    return this.start[0] === this.end[0] && this.start[1] === this.end[1]
  }

  /**
   * isBackwards is a getter that determines if the Selection represents a
   * backwards selection.
   *
   * @return {Boolean}
   */
  get isBackwards () {
    return this.start[0] > this.end[0] ||
      (this.start[0] === this.end[0] && this.start[1] > this.end[1])
  }

  /**
   * equals(other) determines if two selections are equivalent.
   *
   * @param {Selection} other
   * @return {Boolean}
   */
  equals (other) {
    return (
      other instanceof Selection &&
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
  clone () {
    // To allow subclassing.
    let S = this.constructor
    return new S(this.start.slice(), this.end.slice())
  }
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

export default Selection
