'use strict';

var utils = require('./utils')

/**
 * isLastChild(root, node) determines if the Node node is the last
 * child of root. Not in the Node.lastChild sense; rather, if 'node'
 * was the <br>, and 'root' the <p> in the following markup:
 *   <p>Some <em>stuff<br></em></p>
 * isLastChild(root, node) would be true.
 *
 * @param {Element} root
 * @param {Node} node
 * @return {Boolean}
 */
function isLastChild (root, node) {

  while (node && node !== root) {
    if (node.nextSibling)
      return false

    node = node.parentNode
  }

  return true
}

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
 * encodePosition(children, node, offset) encodes the position
 * of the selection, based on the current node and offset. Returns
 * an integer pair.
 *
 * @param {Array[Element]} children
 * @param {Node} node
 * @param {Int} offset
 * @return {Array}
 */
function encodePosition (children, node, offset) {
  var lastBR = false,
      childIndex,
      textIndex,
      child

  while (node) {
    if (utils.isText(node) || node.nodeName === 'BR') {
      break
    } else if (!node.isContentEditable) {
      node = node.nextSibling
    } else if (offset < node.childNodes.length) {
      node = node.childNodes[offset]
      offset = 0
    } else if (!node.childNodes.length) {
      offset = 0
      break
    } else {
      node = node.lastChild

      if (utils.isText(node))
        offset = node.data.length
      else if (node.nodeName === 'BR') {
        offset = 1
        lastBR = true
      } else
        offset = node.childNodes.length
    }
  }

  child = node
  while (child.parentNode && !utils.isBlock(child))
    child = child.parentNode

  childIndex = children.indexOf(child)

  // If the selection is not in the root's tree, do nothing.
  if (childIndex < 0) return false

  // See https://github.com/lucthev/choice/issues/1
  if (lastBR && isLastChild(child, node))
    offset -= 1

  textIndex = textBefore(child, node) + offset

  return [childIndex, textIndex]
}

module.exports = encodePosition
