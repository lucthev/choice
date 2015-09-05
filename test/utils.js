/*eslint no-unused-vars: 0 */
'use strict'

/**
 * selects a Range, optionally backwards.
 *
 * @param {Range} range
 * @param {Boolean} backwards
 */
function selectRange (range, backwards) {
  var sel = window.getSelection()
  var endRange

  sel.removeAllRanges()

  if (typeof sel.extend === 'function') {
    endRange = range.cloneRange()
    endRange.collapse(!backwards)
    sel.addRange(endRange)

    if (backwards) {
      sel.extend(range.startContainer, range.startOffset)
    } else {
      sel.extend(range.endContainer, range.endOffset)
    }
  } else {
    sel.addRange(range)
  }
}

/**
 * placeCursor(elem, html) sets the innerHTML of elem to be html
 * optionally places the cursor after '|'s.
 * Example:
 *   placeCursor(someElem, '<p>Mil|k & H|oney</p>')
 *
 * The innerHTML of someElem will be <p>Mil|k & H|oney</p>, and the
 * selection will be around 'k & H'. Optionally make the selection
 * right-to-left if backwards is truthy.
 *
 * @param {Element} elem
 * @param {String} html
 * @param {Boolean} backwards
 */
function placeCursor (elem, html, backwards) {
  var range = document.createRange()
  var markers

  if (/\|/.test(html)) {
    elem.focus()
    elem.innerHTML = html.replace(/\|/g, '<span class="marker"></span>')

    markers = elem.querySelectorAll('.marker')
    range.setStartBefore(markers[0])

    if (markers.length === 1) {
      range.setEndAfter(markers[0])
    } else {
      range.setEndAfter(markers[1])
    }

    ;[].forEach.call(markers, function (marker) {
      var parent = marker.parentNode
      parent.removeChild(marker)
      parent.normalize()
    })

    selectRange(range, backwards)
  } else {
    elem.innerHTML = html
  }
}

function flattenLists (elem) {
  var elements = ['p', 'h1', 'h2', 'li']

  return [].slice.call(document.querySelectorAll(elements.join()))
}
