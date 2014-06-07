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
      this.elem.setAttribute('contenteditable', true)

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

      // This test is failing; it has something to do with the space before 'three'.
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

      placeCursor(this.elem, '<p>One</p><p>Two</p>|')

      expect(this.Choose.getSelection())
        .toEqual([1, 3])
    })

    it('edge cases (3).', function () {
      placeCursor(this.elem, '|<p>One</p><p>Two</p>|', true)

      expect(this.Choose.getSelection())
        .toEqual({
          start: [1, 3],
          end: [0, 0]
        })
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

    // Failing in Firefox
    it('should return false when the cursor is not in the selection.', function () {
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

  describe('#getSelection (inline mode)', function () {

    beforeEach(function () {
      this.elem = document.createElement('p')
      this.elem.setAttribute('contenteditable', true)

      document.body.appendChild(this.elem)

      // Inline mode:
      this.Choose = new Choose(this.elem, true)
    })

    afterEach(function () {
      document.body.removeChild(this.elem)
    })

    it('returns an integer when the selection is collapsed.', function () {
      placeCursor(this.elem, 'One |two')

      expect(this.Choose.getSelection())
        .toEqual(4)
    })

    it('collapsed selection (2).', function () {
      placeCursor(this.elem, '|One two')

      expect(this.Choose.getSelection())
        .toEqual(0)
    })

    it('collapsed selection (3).', function () {
      placeCursor(this.elem, 'Dream within a dream|')

      expect(this.Choose.getSelection())
        .toEqual(20)
    })

    it('collapsed selection (4).', function () {
      placeCursor(this.elem, 'Black <em>o|ut</em> days')

      expect(this.Choose.getSelection())
        .toEqual(7)
    })

    it('collapsed selection (5).', function () {
      placeCursor(this.elem, 'Man<span></span>ea|ter')

      expect(this.Choose.getSelection())
        .toEqual(5)

      placeCursor(this.elem, 'Man<span></span>|eater')

      expect(this.Choose.getSelection())
        .toEqual(3)

      placeCursor(this.elem, 'Man|<span></span>eater')

      expect(this.Choose.getSelection())
        .toEqual(3)
    })

    it('should treat <br>s as newlines.', function () {
      placeCursor(this.elem, 'Black<br>water|')

      expect(this.Choose.getSelection())
        .toEqual(11)
    })

    it('<br> newlines (2).', function () {
      placeCursor(this.elem, 'Black<br>|water')

      expect(this.Choose.getSelection())
        .toEqual(6)

      placeCursor(this.elem, 'Black|<br>water')

      expect(this.Choose.getSelection())
        .toEqual(5)
    })

    it('<br> newlines (3).', function () {
      placeCursor(this.elem, 'Black water|<br>')

      expect(this.Choose.getSelection())
        .toEqual(11)

      // For some reason, two <br>s are required to make a newline.
      placeCursor(this.elem, 'Black water<br>|<br>')

      expect(this.Choose.getSelection())
        .toEqual(12)
    })

    it('<br> newlines (4).', function () {
      placeCursor(this.elem, '|<br>Black water')

      expect(this.Choose.getSelection())
        .toEqual(0)

      placeCursor(this.elem, '<br>|Black water')

      expect(this.Choose.getSelection())
        .toEqual(1)
    })

    it('returns an object when the selection is not collapsed.', function () {
      placeCursor(this.elem, '|One|')

      expect(this.Choose.getSelection())
        .toEqual({
          start: 0,
          end: 3
        })

      placeCursor(this.elem, '|One|', true)

      expect(this.Choose.getSelection())
        .toEqual({
          end: 0,
          start: 3
        })
    })

    it('not collapsed (2).', function () {
      placeCursor(this.elem, '<bold>|We</bold> Swa|rm')

      expect(this.Choose.getSelection())
        .toEqual({
          start: 0,
          end: 6
        })

      placeCursor(this.elem, '<bold>|We</bold> Swa|rm', true)

      expect(this.Choose.getSelection())
        .toEqual({
          end: 0,
          start: 6
        })
    })

    it('not collapsed (3).', function () {
      placeCursor(this.elem, 'Mouthful |<em><b>of|</b></em> diamonds')

      expect(this.Choose.getSelection())
        .toEqual({
          start: 9,
          end: 11
        })

      placeCursor(this.elem, 'Mouthful <em>|<b>of</b></em>| diamonds')

      expect(this.Choose.getSelection())
        .toEqual({
          start: 9,
          end: 11
        })
    })
  })

  describe('#restore (rich mode)', function () {

    beforeEach(function () {
      this.elem = document.createElement('article')
      this.elem.setAttribute('contenteditable', true)

      document.body.appendChild(this.elem)

      this.Choose = new Choose(this.elem)
    })

    afterEach(function () {
      document.body.removeChild(this.elem)
    })

    it('should restore the selection.', function () {
      placeCursor(this.elem, '<p>|One</p>')

      // Just save and restore.
      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild.firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(0)
    })

    it('should restore the selection (2).', function () {
      placeCursor(this.elem, '<p>One|</p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild.firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(3)
    })

    it('should restore the selection (3).', function () {
      placeCursor(this.elem, '<p>One <b>tw|o</b> three</p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild.childNodes[1].firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(2)
    })

    it('should restore the selection (4).', function () {
      placeCursor(this.elem, '<p>One |<em>two</em> three</p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild.firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(4)
    })

    it('should restore the selection (5).', function () {
      placeCursor(this.elem, '<p>One <strong>two</strong>| three</p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),

          // We actually expect the cursor to be IN the <strong>
          target = this.elem.firstChild.childNodes[1].firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(3)
    })

    it('should restore the selection (6).', function () {
      placeCursor(this.elem, '<p>One <strong>two</strong> three|</p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild.childNodes[2]

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(6)
    })

    it('should restore the selection (7).', function () {
      placeCursor(this.elem, '<p>The |<span></span>Big Short</p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild.firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(4)
    })

    it('should restore the selection (8).', function () {

      // The cursor cannot be placed in collapsed elements, so no
      // need to check that case.
      placeCursor(this.elem, '<p>The <span></span>|Big Short</p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),

          // The selection should get bumped back to the first text node.
          target = this.elem.firstChild.firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(4)
    })

    it('should restore the selection (9).', function () {
      placeCursor(this.elem, '<p>The <span></span>Big |Short</p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild.childNodes[2]

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(4)
    })

    it('should restore the selection (9).', function () {
      placeCursor(this.elem, '<p>The |<em><strong>Big</strong></em> Short</p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild.childNodes[0]

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(4)
    })

    it('should restore the selection (10).', function () {
      placeCursor(this.elem, '<p>The <em>|<strong>Big</strong></em> Short</p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild.childNodes[0]

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(4)
    })

    it('should restore the selection (11).', function () {
      placeCursor(this.elem, '<p>The <em><strong>|Big</strong></em> Short</p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild.childNodes[0]

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(4)
    })

    it('should restore the selection (12).', function () {
      placeCursor(this.elem, '<p>The <em><strong id="s">Big|</strong></em> Short</p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = document.querySelector('#s').firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(3)
    })

    it('should restore the selection (13).', function () {
      placeCursor(this.elem, '<p>The <em><strong id="s">Big</strong>|</em> Short</p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = document.querySelector('#s').firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(3)
    })

    it('should restore the selection (14).', function () {
      placeCursor(this.elem, '<p>The <em><strong id="s">Big</strong></em>| Short</p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = document.querySelector('#s').firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(3)
    })

    it('should restore the selection (15).', function () {
      placeCursor(this.elem, '<p>|<br></p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(0)
    })

    it('should restore the selection (16).', function () {
      placeCursor(this.elem, '<p>Line One<br>|<br></p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(2)
    })

    it('should restore the selection (17).', function () {
      placeCursor(this.elem, '<p>Line One<br>|Line Two</p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild.childNodes[2]

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(0)
    })

    it('should restore the selection (18).', function () {
      placeCursor(this.elem,
        '<h2>Jacob Streilein</h2>' +
        '<p>There\'s a <em id="e">man in|<br></em>the woods.</p>'
      )

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = document.querySelector('#e').firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(6)
    })

    it('should restore the selection (19).', function () {
      placeCursor(this.elem,
        '<h2>Jacob Streilein</h2>' +
        '<p>There\'s a <em id="e">man in<br>|</em>the woods.</p>'
      )

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),

          // We expect the cursor to be at the beginning of 'the woods'
          target = document.querySelector('#e').nextSibling

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(0)
    })

    it('should restore the selection (20).', function () {
      placeCursor(this.elem,
        '<h2>Jacob Streilein</h2>' +
        '<p>There\'s a <em id="e">man in<br></em>|the woods.</p>'
      )

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = document.querySelector('#e').nextSibling

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(0)
    })

    it('should restore the selection (21).', function () {
      placeCursor(this.elem, '<p>One</p><p>Two|<br><br></p><p>Three</p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.childNodes[1].firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(3)
    })

    it('should restore the selection (22).', function () {
      placeCursor(this.elem, '|<p>A</p><p>B</p>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild.firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(0)
    })

    /**
     * Non-collapsed selections, now. Just a few tricky cases.
     */

    it('should restore non-collapsed selections.', function () {
      placeCursor(this.elem, '|<p>One</p><p>Two</p><p>Three</p>|')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          start = this.elem.firstChild.firstChild,
          end = this.elem.lastChild.firstChild

      expect(sel.isCollapsed).toBe(false)
      expect(sel.anchorNode).toEqual(start)
      expect(sel.anchorOffset).toEqual(0)
      expect(sel.focusNode).toEqual(end)
      expect(sel.focusOffset).toEqual(5)
    })

    it('should restore non-collapsed selections (2).', function () {
      placeCursor(this.elem, '<h2>|<br>|<br></h2>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          start = this.elem.firstChild,
          end = this.elem.firstChild

      expect(sel.isCollapsed).toBe(false)
      expect(sel.anchorNode).toEqual(start)
      expect(sel.anchorOffset).toEqual(0)
      expect(sel.focusNode).toEqual(end)
      expect(sel.focusOffset).toEqual(1)
    })

    it('should restore non-collapsed selections (3).', function () {
      placeCursor(this.elem,
        '<h2>Thi|ngs</h2>' +
        '<p><code>Words</code></p>' +
        '<ul><li id="li">List <em>|item</em></li></ul>', true)

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          start = document.querySelector('#li').firstChild,
          end = this.elem.firstChild.firstChild

      expect(sel.isCollapsed).toBe(false)
      expect(sel.anchorNode).toEqual(start)
      expect(sel.anchorOffset).toEqual(5)
      expect(sel.focusNode).toEqual(end)
      expect(sel.focusOffset).toEqual(3)
    })
  })

  describe('#restore (inline mode)', function () {

    beforeEach(function () {
      this.elem = document.createElement('h2')
      this.elem.setAttribute('contenteditable', true)

      document.body.appendChild(this.elem)

      // Inline mode:
      this.Choose = new Choose(this.elem, true)
    })

    afterEach(function () {
      document.body.removeChild(this.elem)
    })

    // Repeating ALL the tests, but in inline mode. It may be overkill,
    // but better safe than sorry.
    it('should restore the selection.', function () {
      placeCursor(this.elem, '|One')

      // Just save and restore.
      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(0)
    })

    it('should restore the selection (2).', function () {
      placeCursor(this.elem, 'One|')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(3)
    })

    it('should restore the selection (3).', function () {
      placeCursor(this.elem, 'One <b>tw|o</b> three')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.childNodes[1].firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(2)
    })

    it('should restore the selection (4).', function () {
      placeCursor(this.elem, 'One |<em>two</em> three')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(4)
    })

    it('should restore the selection (5).', function () {
      placeCursor(this.elem, 'One <strong>two</strong>| three')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),

          // We actually expect the cursor to be IN the <strong>
          target = this.elem.childNodes[1].firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(3)
    })

    it('should restore the selection (6).', function () {
      placeCursor(this.elem, 'One <strong>two</strong> three|')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.childNodes[2]

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(6)
    })

    it('should restore the selection (7).', function () {
      placeCursor(this.elem, 'The |<span></span>Big Short')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(4)
    })

    it('should restore the selection (8).', function () {

      // The cursor cannot be placed in collapsed elements, so no
      // need to check that case.
      placeCursor(this.elem, 'The <span></span>|Big Short')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),

          // The selection should get bumped back to the first text node.
          target = this.elem.firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(4)
    })

    it('should restore the selection (9).', function () {
      placeCursor(this.elem, 'The <span></span>Big |Short')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.childNodes[2]

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(4)
    })

    it('should restore the selection (9).', function () {
      placeCursor(this.elem, 'The |<em><strong>Big</strong></em> Short')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.childNodes[0]

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(4)
    })

    it('should restore the selection (10).', function () {
      placeCursor(this.elem, 'The <em>|<strong>Big</strong></em> Short')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.childNodes[0]

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(4)
    })

    it('should restore the selection (11).', function () {
      placeCursor(this.elem, 'The <em><strong>|Big</strong></em> Short')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(4)
    })

    it('should restore the selection (12).', function () {
      placeCursor(this.elem, 'The <em><strong id="s">Big|</strong></em> Short')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = document.querySelector('#s').firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(3)
    })

    it('should restore the selection (13).', function () {
      placeCursor(this.elem, 'The <em><strong id="s">Big</strong>|</em> Short')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = document.querySelector('#s').firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(3)
    })

    it('should restore the selection (14).', function () {
      placeCursor(this.elem, 'The <em><strong id="s">Big</strong></em>| Short')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = document.querySelector('#s').firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(3)
    })

    it('should restore the selection (15).', function () {
      placeCursor(this.elem, '|<br>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(0)
    })

    it('should restore the selection (16).', function () {
      placeCursor(this.elem, 'Line One<br>|<br>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(2)
    })

    it('should restore the selection (17).', function () {
      placeCursor(this.elem, 'Line One<br>|Line Two')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.childNodes[2]

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(0)
    })

    it('should restore the selection (18).', function () {
      placeCursor(this.elem, 'There\'s a <em id="e">man in|<br></em>the woods.')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = document.querySelector('#e').firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(6)
    })

    it('should restore the selection (19).', function () {
      placeCursor(this.elem, 'There\'s a <em id="e">man in<br>|</em>the woods.')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),

          // We expect the cursor to be at the beginning of 'the woods'
          target = document.querySelector('#e').nextSibling

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(0)
    })

    it('should restore the selection (20).', function () {
      placeCursor(this.elem, 'There\'s a <em id="e">man in<br></em>|the woods.')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = document.querySelector('#e').nextSibling

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(0)
    })

    it('should restore the selection (21).', function () {
      placeCursor(this.elem, 'Two|<br><br>Three')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          target = this.elem.firstChild

      expect(sel.isCollapsed).toBe(true)
      expect(sel.anchorNode).toEqual(target)
      expect(sel.anchorOffset).toEqual(3)
    })

    /**
     * Non-collapsed selections.
     */

    it('should restore non-collapsed selections.', function () {
      placeCursor(this.elem, '|<br>|<br>')

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          start = this.elem,
          end = this.elem

      expect(sel.isCollapsed).toBe(false)
      expect(sel.anchorNode).toEqual(start)
      expect(sel.anchorOffset).toEqual(0)
      expect(sel.focusNode).toEqual(end)
      expect(sel.focusOffset).toEqual(1)
    })

    it('should restore non-collapsed selections (2).', function () {
      placeCursor(this.elem,
        '<span></span><code id="c"><strong id="li">va|r</strong> x = <em>new</em> Choi|ce</code>', true)

      this.Choose.restore(this.Choose.getSelection())

      var sel = window.getSelection(),
          end = document.querySelector('#li').firstChild,
          start = document.querySelector('#c').lastChild

      expect(sel.isCollapsed).toBe(false)
      expect(sel.anchorNode).toEqual(start)
      expect(sel.anchorOffset).toEqual(5)
      expect(sel.focusNode).toEqual(end)
      expect(sel.focusOffset).toEqual(2)
    })
  })
})
