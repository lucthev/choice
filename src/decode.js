'use strict';

var utils = require('./utils')

/**
 * decodePosition(root, offset) returns the node and the offset within
 * that node that the selection should be placed at, given a root node
 * and the length of the text before the selection.
 *
 * @param {Element} root
 * @param {Int} offset
 * @return {
 *   node: Node,
 *   offset: Int
 * }
 */
function decodePosition (root, offset) {
  var node = root.firstChild,
      depth = 0,
      children,
      parent

  while (node) {

    if (utils.isElem(node)) {

      if (node.nodeName === 'BR') {
        if (!offset) {
          parent = node.parentNode
          children = utils.toArray(parent.childNodes)

          return { node: parent, offset: children.indexOf(node) }
        }

        offset -= 1
      }

      if (!node.firstChild) {

        while (!node.nextSibling) {
          if (!depth) break

          depth -= 1
          node = node.parentNode
        }

        node = node.nextSibling
        continue
      }

      depth += 1
      node = node.firstChild
      continue
    }

    if (offset <= node.data.length)
      return { node: node, offset: offset }

    offset -= node.data.length

    while (!node.nextSibling) {
      if (!depth) break

      depth -= 1
      node = node.parentNode
    }

    node = node.nextSibling
  }

  // We shouldn't reach here, in theory.
  throw new Error('Invalid offset or root node.')
}

module.exports = decodePosition
