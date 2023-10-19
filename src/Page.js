/**
 * Represents a page class for generating printable pages with specific settings.
 */
export default class Page {
    /**
     * The orientation of the page (e.g., "portrait").
     * @type {string}
     */
    static orientation = "portrait";
    /**
     * The format of the page (e.g., "letter").
     * @type {string}
     */
    static format = "letter";
    /**
     * The number of columns on the page.
     * @type {number}
     */
    static _columns = 1;
    /**
     * The number of rows on the page.
     * @type {number}
     */
    static _rows = 1;
    /**
     * The margin of the page (e.g., "0.5in").
     * @type {string}
     */
    static margin = "0.5in";
    /**
     * Initializes the Page class with the provided properties and generates pages.
     * @param {Object} props - Properties to set for the Page class.
     */
    static main(props = {}) {
        for (let p in props) {
            this[p] = props[p];
        }
        this.addStylesheet();
        this.addFontTheme();
        console.log(this);
        var flaps = document.querySelectorAll(".flap");
        if (flaps.length > 0) {
            flaps.forEach(flap => {
                var props = Object.create(this);
                this.parseData(props, flap);
                var page = document.createElement("div");
                page.classList.add("page");
                this.formatPage(page, props);
                page.appendChild(this.marks(props.rows, props.columns));
                page.appendChild(this.flaps(flap, props.rows * props.columns));
                document.body.appendChild(page);
            });
            return;
        }
        var pages = document.querySelectorAll(".page");
        if (pages.length > 0) {
            pages.forEach(page => {
                var props = Object.create(this);
                this.parseData(props, page);
                this.formatPage(page);
            });
            return;
        }
    }
    /**
     * Creates and returns a set of flaps for a page.
     * @param {Element} flap - The flap element to duplicate.
     * @param {number} nb - The number of flaps to create.
     * @returns {Element} - The container element with flaps.
     */
    static flaps(flap, nb) {
        var result = document.createElement("div");
        result.classList.add("flaps");
        result.appendChild(flap);
        for (let i = 1; i < nb; i += 1) {
            result.appendChild(flap.cloneNode(true));
        }
        return result;
    }
    /**
     * Parses data attributes of an element and stores them in an object.
     * @param {Element} element - The element with data attributes to parse.
     * @param {Object} obj - An object to store the parsed data attributes.
     * @returns {Object} - The object with parsed data attributes.
     */
    static parseData(obj, ...elements) {
        elements.forEach(element => {
            for (const prop in element.dataset) {
                if (Object.hasOwnProperty.call(element.dataset, prop)) {
                    obj[prop] = element.dataset[prop];
                }
            }
        });
        return obj;
    }
    /**
     * Gets the number of columns on the page.
     * @returns {number} - The number of columns.
     */
    static get columns() {
        return this._columns;
    }
    /**
     * Sets the number of columns on the page.
     * @param {number} val - The number of columns to set.
     */
    static set columns(val) {
        this._columns = parseInt(val);
    }
    /**
     * Gets the number of rows on the page.
     * @returns {number} - The number of rows.
     */
    static get rows() {
        return this._rows;
    }
    /**
     * Sets the number of rows on the page.
     * @param {number} val - The number of rows to set.
     */
    static set rows(val) {
        this._rows = parseInt(val);
    }
    /**
     * Formats a page element with the specified properties.
     * @param {Element} page - The page element to format.
     * @param {Object} props - The properties for formatting the page.
     */
    static formatPage(page, props = null) {
        if (props === null) {
            props = Object.create(this);
            this.parseData(page, props);
        }
        var size = this.getSize(props);
        if (props.orientation) {
            page.style.setProperty("page", props.orientation);
        }
        page.style.setProperty("--width", size.width + "pt");
        page.style.setProperty("--height", size.height + "pt");
        page.style.setProperty("--margin", props.margin || this.margin);
        page.style.setProperty("--columns", props.columns || this.columns || 1);
        page.style.setProperty("--rows", props.rows || this.rows || 1);
    }
    /**
     * Adds a stylesheet to the document for styling pages.
     * @param {boolean} [insert=true] - Whether to insert the stylesheet into the document.
     * @returns {HTMLLinkElement} - The created stylesheet link element.
     */
    static addStylesheet(insert = true) {
        var link = document.createElement("link");
        link.href = this.url("css", "style.css");
        link.rel = "stylesheet";
        if (insert) {
            document.head.insertBefore(link, document.head.firstChild);
        }
        return link;
    }
    static url(...files) {
        var { href: result } = new URL(import.meta.url);
        result = result.split("/").slice(0, -2);
        result.push(...files);
        result = result.join("/");
        return result;
    }
    /**
     * Adds a stylesheet to the document for styling pages.
     * @param {boolean} [insert=true] - Whether to insert the stylesheet into the document.
     * @returns {HTMLLinkElement} - The created stylesheet link element.
     */
    static addFontTheme(theme, insert = true) {
        theme = theme || this.theme;
        if (!theme) return;
        var link = document.createElement("link");
        link.href = this.url("css", "font-themes", theme + ".css");
        link.rel = "stylesheet";
        if (insert) {
            document.head.insertBefore(link, document.head.firstChild);
        }
        return link;
    }
    /**
     * Calculates and returns the size of the page in points.
     * @param {Object} [obj=this] - The object with format and orientation information.
     * @returns {{width: number, height: number}} - The size of the page in points.
     */

    static getSize(obj = this) {
        var width = 0, height = 0;
        switch (obj.format.toLowerCase()) {
            case "letter":
                width = this.toPts(8.5, "in");
                height = this.toPts(11, "in");
                break;
            case "legal":
                width = this.toPts(8.5, "in");
                height = this.toPts(14, "in");
                break;
            case "ledger":
            case "tabloid":
                width = this.toPts(11, "in");
                height = this.toPts(17, "in");
                break;
            case "a3":
                width = this.toPts(297, "mm");
                height = this.toPts(420, "mm");
                break;
            case "a4":
                width = this.toPts(210, "mm");
                height = this.toPts(297, "mm");
                break;
            default:
                let [w, wu, h, hu] = /([0-9.]+)([a-z]+)X([0-9.]+)([a-z]+)/i.exec(obj.format).slice(1);
                console.log(obj.format);
                width = this.toPts(w, wu);
                height = this.toPts(h, hu);
                obj.orientation = "";
        }
        console.log(obj);
        if ((obj.orientation === "portrait" && width > height) || (obj.orientation === "landscape" && width < height)) {
            [width, height] = [height, width];
        }
        return { width: width, height: height };
    }
    /**
     * Converts a value from a specified unit to points (pt).
     * @param {number} val - The value to convert.
     * @param {string} unit - The unit of the value (e.g., "in", "mm").
     * @returns {number} - The converted value in points (pt).
     */
    static toPts(val, unit) {
        const PTS = { pt: 1, in: 72, pc: 12, px: .75, mm: 2.83465, cm: 28.3465, dm: 283.465, m: 2834.65 };
        val = parseFloat(val);
        unit = unit.toLowerCase();
        if (PTS[unit] === undefined) {
            throw `Unrecognized length unit '${unit}'`;
        }
        return val * PTS[unit];
    }
    /**
     * Generates and returns a set of page marks.
     * @param {number} rows - The number of rows.
     * @param {number} columns - The number of columns.
     * @returns {Element} - The container element with page marks.
     */
    static marks(rows, columns) {
        var resultat = document.createElement("div");
        resultat.classList.add("marks");
        var divRows = resultat.appendChild(document.createElement("div"));
        divRows.classList.add("columns");
        for (let c = 1; c < columns; c += 1) {
            let group = divRows.appendChild(document.createElement("div"));
            for (let r = 1; r < rows; r += 1) {
                group.appendChild(document.createElement("div"));
            }
        }
        var divColumns = resultat.appendChild(document.createElement("div"));
        divColumns.classList.add("rows");
        for (let r = 1; r < rows; r += 1) {
            let group = divColumns.appendChild(document.createElement("div"));
            for (let c = 1; c < columns; c += 1) {
                group.appendChild(document.createElement("div"));
            }
        }
        return resultat;
    }
    /**
     * Initializes the Page class by parsing data attributes of the body element.
     */
    static init() {
        this.parseData(this, document.body);
    }
}


// Initialize the Page class.
Page.init();