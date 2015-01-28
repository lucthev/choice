# Choice

A module for unobtrusively saving and restoring selections in `contenteditable` elements.

## Installation

```
$ npm install choice
```

## How it works

Consider the layout of a simple rich text editor; there is a document which contains blocks of text (paragraphs, headings, etc.), and, in these blocks, text with various styles (bold, italic, etc.). In HTML, this might look like:

```html
<!-- The article represent the editor "document" -->
<article contenteditable="true">

    <!-- These are the blocks of text -->
    <p>Some <strong>rich</strong> text.</p>
    <h2>This is a heading</h2>
    <p><em>More</em> text. Ladida.</p>
</article>
```

Choice represents the endpoints of a selection as an integer pair `[childIndex, textIndex]`, where `childIndex` is the index, relative to the “document”, of the block which contains the endpoint, and `textIndex` is the number of characters in the block before the endpoint. If the selection spanned the word “This” in the example above, the selection would be represented as:

```js
{
    start: [1, 0],
    end: [1, 4]
}
```

## API

### new Choice( element [, getChildren ] )

Creates an instance of Choice. The `new` constructor is optional. `element` is the root `contenteditable` element that represent the “document” of the editor.

Although working with child indices may work for simple use cases, like the example above, the shortcomings of that method quickly become evident when your editor produces more complex markup. Consider:

```html
<article contenteditable="true">
    <section>
        <p>Some <strong>rich</strong> text.</p>
        <p>I can edit it.</p>
    </section>
    <section>
        <hr contenteditable="false">
        <h2>This is a new section</h2>
        <p>More text. Ladida.</p>
    </section>
</article>
```

In this case, using child indices wouldn’t work; the “blocks” of text aren’t direct children of the “document”. For these situations, Choice takes a second paramater, `getChildren`, a function that return an array containing the relevant “blocks” of text. For the above example, `getChildren` might look like:

```js
function getChildren() {
    var article = document.querySelector('article'),
        children = article.querySelectorAll('p, h2')

    return Array.prototype.slice.call(children)
}
```

If a `getChildren` function is not given, Choice defaults to using the root element’s child nodes.

### Choice#getSelection( )

Returns an an instance of `Choice.Selection`. This has two properties, `start` and `end`, which contain the two integer pairs representing the start and end points of the selection. See below for more information on `Choice.Selection`.

If the user’s selection is not contained within the root element, `getSelection` returns `null`.

### Choice#restore( savedSelection )

Sets the user’s selection to match that represented by the given instance of `Choice.Selection`.

### Choice.support( )

This method returns true if the APIs Choice relies on exist. See [Browser support](#browser-support) below.

### Selection

`getSelection` returns an instance of `Choice.Selection`. This class has several instance and static methods:

#### Selection#isCollapsed( )

Returns a boolean indicating whether the endpoints of the selection are identical.

#### Selection#isBackwards( )

Returns a boolean indicating whether the selection represents a right-to-left selection.

#### Selection#clone( )

Returns a new selection identical to the selection this method was called on.

#### Selection.equals( other )

Returns a boolean indicating whether or not `other` and the selection this method was called on represent the same selection.

#### Selection.equals( first, second )

This static method is similar to `Selection#equals`, but can be used to determine the equality of two `null` selections.

## Motivation

Choice's main purpose is to unobtrusively save and restore the selection in `contenteditable` regions. This can help “standardize” certain behaviours when working with the contenteditable API. Consider the following markup; it’s faily typical in rich text editing.

```html
<p>Some <b><i>fancy</i></b> text</p>
```

Note that when the caret is placed at the end of ‘fancy’, there are actually three ways it can be placed (`|` represent the caret):

```html
<p>Some <b><i>fancy</i></b>| text</p>
<!-- OR -->
<p>Some <b><i>fancy</i>|</b> text</p>
<!-- OR -->
<p>Some <b><i>fancy|</i></b> text</p>
```

You’ll often have no control over which of these situations occur, which can lead to very inconsistent behaviour; when the caret is at the end of ‘fancy’, will text a user enters be bold, italic and bold, or plain?

Saving and restoring the selection with Choice, however, normalizes this behaviour. In general, a restored selection tries to “lean left.” A couple examples:

```html
<!-- This: -->
<p>Some <b>bold</b>| text</p>
<!-- becomes this: -->
<p>Some <b>bold|</b> text</p>

<!-- and this: -->
<p>Some <b>|bold</b> text</p>
<!-- becomes this: -->
<p>Some |<b>bold</b> text</p>
```

There are some exceptions to this rule (usually involving line breaks, `<br>`s), but they should be intuitive.

__Note__: Choice does __not__ normalize the selection every time it changes; rather, it gives you a mechanism to do it yourself.

A more interesting use case, perhaps, is to manipulate elements without losing a user’s selection. Consider the following situation, in which a user might press a button to make text bold or to change the paragraph to a heading:

```html
<article contenteditable="true">
    <p>I want to make |this block| a heading.</p>
    <p>This stuff is not as important.</p>
</article>
```

Naively swapping the paragraph for a heading would (probably, depending on the browser) lose the selection. To turn the paragraph into a heading without losing the selection, save the selection using `Choice#getSelection`, swap out the paragraph, and restore the selection using `Choice#restore`.

## Caveats

There are some restriction to saving and restoring the selection. Anything that would mess up the integer pairs representing the endpoints of the selection will result in a poorly restored selection. This includes, but may not be limited to, inserting/removing “blocks” or inserting/removing text. If you plan on doing those things, you should update the saved selection manually to account for your changes.

Additionally, Firefox, for whatever reason, allows multiple selections in `contenteditable` regions. Choice has inconsistent behaviour when there are multiple selection regions. My advice? It’s not worth fussing over.

## Browser support

Unfortunately, Choice only works in browsers that implement the native [`Selection#extend`][extend] method. Essentially, that’s all browsers except Internet Explorer (yes, ALL versions).

## License

MIT.

[extend]: https://developer.mozilla.org/en-US/docs/Web/API/Selection.extend
