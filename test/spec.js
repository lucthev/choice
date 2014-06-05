/* global describe, it, expect, Choose, beforeEach, afterEach, xit */

'use strict';

/**
 * selects a Range, optionally backwards.
 *
 * @param {Range} range
 * @param {Boolean} backwards
 */
function selectRange (range, backwards) {
  var sel = window.getSelection(),
      endRange

  sel.removeAllRanges()

  if (typeof sel.extend === 'function') {
    endRange = range.cloneRange()
    endRange.collapse(!backwards)
    sel.addRange(endRange)

    if (backwards)
      sel.extend(range.startContainer, range.startOffset)
    else
      sel.extend(range.endContainer, range.endOffset)
  } else sel.addRange(range)
}

/**
 * placeCursor(elem, html) sets the innerHTML of elem to be html;
 * optionally places the cursor after '|'s.
 * Example:
 *   placeCursor(someElem, '<p>Mil|k & H|oney</p>')
 *
 * The innerHTML of someElem will be <p>Mil|k & H|oney</p>, and the
 * selection will be around 'k & H'. Optionally make the selection
 * right-to-left is backwars is truthy.
 *
 * @param {Element} elem
 * @param {String} html
 * @param {Boolean} backwards
 */
function placeCursor (elem, html, backwards) {
  var range = document.createRange(),
      markers,
      parent,
      i

  if (/\|/.test(html)) {
    elem.focus()

    elem.innerHTML = html.replace(/\|/g, '<span class="marker"></span>')

    markers = elem.querySelectorAll('.marker')

    range.setStartBefore(markers[0])

    if (markers.length === 1)
      range.setEndAfter(markers[0])
    else
      range.setEndAfter(markers[1])

    for (i = 0; i < markers.length; i += 1) {
      parent = markers[i].parentNode

      parent.removeChild(markers[i])

      parent.normalize()
    }

    selectRange(range, backwards)
  } else elem.innerHTML = html
}

describe('Choose', function () {

  describe('#getSelection (rich mode)', function () {

    beforeEach(function () {
      this.elem = document.createElement('article')

      document.body.appendChild(this.elem)

      this.Choose = new Choose(this.elem)
    })

    afterEach(function () {
      document.body.removeChild(this.elem)
    })

    it('returns a tuple (two-element array) when the selection is collapsed.', function () {
      placeCursor(this.elem, '<p>Photo|graph</p>')

      expect(this.Choose.getSelection()).toEqual([0, 5])
    })

    it('collapsed selection (2).', function () {
      placeCursor(this.elem, '<p>|Things</p>')

      expect(this.Choose.getSelection()).toEqual([0, 0])
    })

    it('collapsed selection (3).', function () {
      placeCursor(this.elem, '<p>Things</p><h2>Words|</h2>')

      expect(this.Choose.getSelection()).toEqual([1, 5])
    })

    it('collapsed selection (4).', function () {
      placeCursor(this.elem, '<p>One <span></span>two |three</p>')

      expect(this.Choose.getSelection()).toEqual([0, 8])
    })

    it('collapsed selection (5).', function () {
      placeCursor(this.elem, '<p>One <span></span>two |three</p>')

      expect(this.Choose.getSelection()).toEqual([0, 8])
    })

    it('collapsed selection (6).', function () {
      placeCursor(this.elem, '<h1>Title</h1><p>Once <strong>upon| a</strong> time')

      expect(this.Choose.getSelection()).toEqual([1, 9])
    })

    it('should treat <br>s as newlines (collapsed selection).', function () {
      placeCursor(this.elem, '<p>Birds in<br>|the sky</p>')

      expect(this.Choose.getSelection()).toEqual([0, 9])
    })

    it('<br>s, collapsed selection (2).', function () {
      placeCursor(this.elem, '<p>Birds in|<br>the sky</p>')

      expect(this.Choose.getSelection()).toEqual([0, 8])
    })

    it('<br>s, collapsed selection (3).', function () {
      placeCursor(this.elem,
        '<h1>A title</h1>' +
        '<h2>A subtitle</h2>' +
        '<p><em>Birds</em> in<br>the<span></span> sky|</p>')

      expect(this.Choose.getSelection()).toEqual([2, 16])
    })

    it('should return the start and end points when selection is not collapsed.', function () {
      placeCursor(this.elem, '<p>|One</p><p>Two|</p>')

      expect(this.Choose.getSelection())
        .toEqual({
          start: [0, 0],
          end: [1, 3]
        })
    })

    it('not collapsed (2).', function () {

      // Make the same selection, but backwards.
      placeCursor(this.elem, '<p>|One</p><p>Two|</p>', true)

      expect(this.Choose.getSelection())
        .toEqual({
          end: [0, 0],
          start: [1, 3]
        })
    })

    it('not collapsed (3).', function () {
      placeCursor(this.elem, '<h2>A ti|tle</h2><p>Ho<br>|hum</p>', true)

      expect(this.Choose.getSelection())
        .toEqual({
          start: [1, 3],
          end: [0, 4]
        })
    })

    it('not collapsed (4).', function () {
      placeCursor(this.elem, '<h1>Things</h1><p>Words|<br>|Stuff</p><p>More</p>')

      expect(this.Choose.getSelection())
        .toEqual({
          start: [1, 5],
          end: [1, 6]
        })

      placeCursor(this.elem, '<h1>Things</h1><p>Words|<br>|Stuff</p><p>More</p>', true)

      expect(this.Choose.getSelection())
        .toEqual({
          start: [1, 6],
          end: [1, 5]
        })
    })

    xit('should account for edge cases.', function () {
      placeCursor(this.elem, '<p>One <strong><em>two<br>|</em></strong> three|</p>', true)

      expect(this.Choose.getSelection())
        .toEqual({
          start: [0, 14],
          end: [0, 8]
        })
    })

    it('edge cases (2).', function () {

      // This kind of behaviour can occur in Firefox.
      placeCursor(this.elem, '|<p>One</p>')

      expect(this.Choose.getSelection())
        .toEqual([0, 0])
    })

    it('edge cases (3).', function () {

      // This kind of behaviour can occur in Firefox.
      placeCursor(this.elem, '<p>One</p><p>Two</p>|')

      expect(this.Choose.getSelection())
        .toEqual([1, 3])
    })

    it('edge cases (4).', function () {
      placeCursor(this.elem, '<p>A <strong><em>b|</em></strong> c</p>')

      expect(this.Choose.getSelection())
        .toEqual([0, 3])

      placeCursor(this.elem, '<p>A <strong><em>b</em>|</strong> c</p>')

      expect(this.Choose.getSelection())
        .toEqual([0, 3])

      placeCursor(this.elem, '<p>A <strong><em>b</em></strong>| c</p>')

      expect(this.Choose.getSelection())
        .toEqual([0, 3])
    })

    it('should return false when the cursor is not in the selection.', function () {

      // Note no selection:
      placeCursor(this.elem, '<p>Stuff</p>')

      expect(this.Choose.getSelection())
        .toBe(false)
    })

    it('return false (2).', function () {
      placeCursor(this.elem, '<p>Things</p>')

      var input = document.createElement('input')
      input.type = 'text'

      document.body.appendChild(input)
      input.focus()

      expect(document.activeElement).toEqual(input)

      expect(this.Choose.getSelection())
        .toEqual(false)

      document.body.removeChild(input)
    })

    it('return false (3).', function () {
      placeCursor(this.elem, '<p>Things</p>')

      var input = document.createElement('div')
      input.setAttribute('contenteditable', true)
      document.body.appendChild(input)

      // Checking about non-collapsed selections this time.
      placeCursor(input, '<p>W|he|e</p>')

      expect(document.activeElement).toEqual(input)

      expect(this.Choose.getSelection())
        .toEqual(false)

      document.body.removeChild(input)
    })
  })
})
