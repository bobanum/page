# Page - Print with Web

![Page - Print with Web](signature.svg)

## The Page class

Include the Page class in your project.

```javascript
<script type="module">
	import Page from "path/to/Page.js";
	Page.main({
		orientation: "portrait",
		format: "a4",
		margin: ".125in",
		rows: 4,
		columns: 2,
	});
</script>
```
The settings can be set in the `main()` method or using data- attributes in `<body>` or `.flap` elements (see below).

## Properties in attributes

Just use `data-` attribute to change properties of the app.

Place properties inside `<body>` tag for global effect or inside individual `<div class="flap">` tags to manage page individually. 

|Property|Description|
|---|---|
| format | The format of the full page. Can be _"letter"_, "legal", "tabloid", "a3", "a4". Can also be custom sizes with units using this form : "8.5inX11in"
| orientation | The orientation of the full page. Possible values are _"portrait"_ and "landscape". If custom format is given, orientation property is ignored.
| rows | The number of rows for multiple flaps. Default : _2_
| columns | The number of columns for multiple flaps. Default : _2_
| margin | The margin around each flap. Default: _"0.5in"_

## Font Themes

In addition to the default font, you can use a font theme. The font theme is a CSS file that you can include in your project. The font theme will be applied to all the flaps.

### Including and using a font theme

Include the font theme in your project. You can use a CDN or download the file and include it locally.
```html
<link rel="stylesheet" href="path/to/font-theme.css">
```
or
```css
@import "path/to/font-theme.css";
```

The stylesheet creates 3 custom properties associated with the `:root` selector : `--font-body`, `--font-heading` and `--font-subheading`. 

You can use these properties in your CSS rules : 

```css
h1 {
	font-family: var(--font-heading);
}
```

### Font themes available
To see an example of each font theme, just view the `css/font-themes/index.html` file in your browser.

Clicking on the name of the font theme will copy the `@import` to the clipboard.