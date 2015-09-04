import {isElem, toArray} from './utils'

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
  let node = root.firstChild
  let depth = 0

  while (node) {
    if (isElem(node)) {
      if (node.nodeName === 'BR') {
        if (!offset) {
          let parent = node.parentNode
          let children = toArray(parent.childNodes)

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

    if (offset <= node.data.length) {
      return { node, offset }
    }

    offset -= node.data.length

    while (!node.nextSibling) {
      if (!depth) break

      depth -= 1
      node = node.parentNode
    }

    node = node.nextSibling
  }

  // We shouldn't reach here, in theory.
  throw RangeError('Invalid selection indices.')
}

export default decodePosition
