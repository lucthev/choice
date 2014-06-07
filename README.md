# Choice

A module for working with selections in `contenteditable` elements.

## Installation

```
$ npm install choice
```

## API

__Note__: Choice, unfortunately, only works in browsers that implement the native [`Selection#extend`](https://developer.mozilla.org/en-US/docs/Web/API/Selection.extend) method. Essentially, that’s all browsers except IE (yes, ALL versions of IE). With that in mind:

### var supported = Choice.support( )

Returns true if all the APIs Choice needs to work correctly exist; false otherwise.

### var selection = new Choice( element [, inline ] )

Creates an instance of Choice. The `new` constructor is optional. `element` is the root `contenteditable` element in which you want to work with selections. `inline` is an optional boolean value that specifies that the contents of `element` will only be inline elements. Defaults to false. For example:

```html
<!-- You would want inline: false -->
<article contenteditable="true">
  <p>Another block element.</p>
</article>

<!-- inline: true would be appropriate -->
<h1 contenteditable="true">
    Only <b>inline</b> things in here.
</h1>
```

### selection.getSelection( )

Returns an object representing the user’s selection.

### selection.restore( savedSelection )

Restores a selection from a previously saved selection.

## Motivation

Choice's main purpose is to unobtrusively save and restore the selection in `contenteditable` regions. This can help “standardize” certain behaviours when working with the contenteditable API. Consider the following markup; it’s faily typical in, for example, rich text editing.

```html
<p>Some <b><i>fancy</i></b> text</p>
```

Note that when the caret is placed at the end of ‘fancy’, there are actually three ways it can be placed:

```html
<p>Some <b><i>fancy</i></b>| text</p>
<!-- OR -->
<p>Some <b><i>fancy</i>|</b> text</p>
<!-- OR -->
<p>Some <b><i>fancy|</i></b> text</p>
```

You’ll often have no control over which of these situations occur, which can lead to very inconsistent behaviour; when a user’s cursor is at the end of ‘fancy’, will text they enter be bold, italic and bold, or plain?

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
    <p>I want to make |this| a heading.</p>
    <p>This stuff is not as important.</p>
</article>
```

Naively swapping the paragraph for a heading would (probably, depending on the browser) lose the position of the caret. To fix this situation, save the selection using `Choice#getSelection`, swap out the paragraph, and restore the selection using `Choice#restore`.

## Caveats

There are some restriction to saving and restoring the selection. A saved selection in Choice usually looks like `[ childIndex, textIndex ]`, where `childIndex` is a the index of the immediate child of the root element in which the selection is in, and `textIndex` is the length of the text before the selection. In the example above, the selection would (assuming the selection is left-to-right) be saved as:

```js
{
    start: [ 0, 15 ],
    end: [ 0, 19 ]
}
```

With that in mind, anything that would mess up those numbers will result in a poorly restored selection. This includes, but may not be limited to, inserting/removing block-level elements or inserting/removing text. If you plan on doing those things, you should update the saved selection manually to account for your changes.

Additionally, Firefox, for whatever reason, allows multiple selections in `contenteditable` regions. Choice will produce inconsistent behaviour when there are multiple selection regions. My advice? It’s not worth fussing over.

## License

MIT.
