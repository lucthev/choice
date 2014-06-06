'use strict';

var utils = require('./utils')

/**
 * textBefore(root, node) gets the length of the text before the
 * given node relative to the element 'root'.
 *
 * @param {Element} root
 * @param {Node} node
 * @return {Int}
 */
function textBefore (root, node) {
  var length = 0

  while (node && node !== root) {

    if (!node.previousSibling) {
      node = node.parentNode
      continue
    }

    node = node.previousSibling

    while (utils.isElem(node) && node.lastChild) {
      node = node.lastChild
    }

    if (utils.isText(node))
      length += node.data.length
    else if (node.nodeName === 'BR') {
      // <br>s count as a newline character.

      length += 1
    }
  }

  return length
}

/**
 * encodePosition(root, node, offset, inline) encodes the position
 * of the selection within root, based on the current node and
 * offset. If inline is truthy, encodes it a little differently.
 *
 * @param {Element} root
 * @param {Node} node
 * @param {Int} offset
 * @param {Boolean} inline
 * @return {Int || Array}
 */
function encodePosition (root, node, offset, inline) {
  var child,
      children,
      textIndex,
      childIndex

  while (node) {
    if (utils.isText(node) || node.nodeName === 'BR')
      break
    else if (offset < node.childNodes.length) {
      node = node.childNodes[offset]
      offset = 0
    } else if (!node.childNodes.length) {
      offset = 0
      break
    } else {
      node = node.lastChild

      if (utils.isText(node))
        offset = node.data.length
      else if (node.nodeName === 'BR')
        offset = 1
      else
        offset = node.childNodes.length
    }
  }

  // Get immediate child of root in which node is in.
  if (!inline) {
    child = node
    children = utils.toArray(root.childNodes)

    while (child.parentNode && child.parentNode !== root)
      child = child.parentNode

    childIndex = children.indexOf(child)

    // If the selection is not in the root's tree, do nothing.
    if (childIndex < 0) return false

  } else child = root

  textIndex = textBefore(child, node) + offset

  return inline ? textIndex : [childIndex, textIndex]
}

module.exports = encodePosition
