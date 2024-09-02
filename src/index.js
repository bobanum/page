/**
 * Represents a page class for generating printable pages with specific settings.
 */
export default class Page extends HTMLElement {
    static tagName = "print-page";
    static observedAttributes = ["rows", "cols", "orientation", "format", "margin", "marks"];
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        this.shadowRoot.appendChild(this.dom.link());
        this.shadowRoot.appendChild(this.dom.page());
        this.shadowRoot.appendChild(this.dom.marks());
    }

    apply() {
        if (this.domain === null) {
            return;
        }
        this.page = this.dom.page();
        this.page.appendChild(this.parts(this.domain, this.rows * this.columns));
    }
    url(...files) {
        return this.constructor.url(...files);
    }
    static url(...files) {
        var { href: result } = new URL(this.meta.url);
        result = result.split("/").slice(0, -2);
        result.push(...files);
        result = result.join("/");
        return result;
    }
    dom = {
        link: () => {
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = this.url("css", "style.css");

            return link;
        },
        page: () => {
            var page = document.createElement("div");
            page.classList.add("page--page");
            page.appendChild(this.dom.slot(this.cols * this.rows));
            this.formatPage(page);
            return page;
        },
        slot: (n = 1) => {
            const slot = document.createElement("slot");

            // Listen for slot content changes
            if (n > 1) {
                slot.addEventListener('slotchange', () => {
                    const duplicateContainer = document.createElement('div');
                    duplicateContainer.classList.add('slot');
                    const nodes = slot.assignedNodes({ flatten: true });
                    nodes.forEach(node => {
                        duplicateContainer.appendChild(node.cloneNode(true));
                    });
                    slot.parentNode.querySelectorAll('.slot').forEach(container => {
                        container.remove();
                    });
                    for (let i = 1; i < n; i += 1) {
                        slot.parentNode.insertBefore(duplicateContainer.cloneNode(true), slot.nextSibling);
                    }
                });
            }
            return slot;
        },


        /**
         * Creates and returns a set of parts for a page.
         * @param {Element} part - The part element to duplicate.
         * @param {number} nb - The number of parts to create.
         * @returns {Element} - The container element with parts.
         */
        parts: (part, nb) => {
            var result = document.createElement("div");
            result.classList.add("page--parts");
            result.appendChild(part);
            for (let i = 1; i < nb; i += 1) {
                result.appendChild(part.cloneNode(true));
            }
            return result;
        },
        /**
         * Generates and returns a set of page marks.
         * @returns {Element} - The container element with page marks.
         */
        marks: () => {
            const { rows, cols, marks } = this;
            if (marks === "none" || rows * cols < 2) {
                return document.createTextNode("");
            }

            var result = document.createElement("div");
            result.classList.add("marks");
            for (let prop in marks) {
                result.style.setProperty(`--marks-${prop}`, marks[prop]);
            }
            // this.propsToCss('marks', result);
            var divRows = result.appendChild(document.createElement("div"));
            for (let c = 1; c < cols; c += 1) {
                let group = divRows.appendChild(document.createElement("div"));
                for (let r = 1; r < rows; r += 1) {
                    group.appendChild(document.createElement("div"));
                }
            }
            var divColumns = result.appendChild(document.createElement("div"));
            for (let r = 1; r < rows; r += 1) {
                let group = divColumns.appendChild(document.createElement("div"));
                for (let c = 1; c < cols; c += 1) {
                    group.appendChild(document.createElement("div"));
                }
            }
            return result;
        }
    };
    /**
     * Gets the number of columns on the page.
     * @returns {number} - The number of columns.
     */
    get cols() {
        if (this.hasAttribute("cols")) {
            return parseInt(this.getAttribute("cols")) || 1;
        }
        return 1;
    }
    /**
     * Gets the number of rows on the page.
     * @returns {number} - The number of rows.
     */
    get rows() {
        if (this.hasAttribute("rows")) {
            return parseInt(this.getAttribute("rows")) || 1;
        }
        return 1;
    }
    get margin() {
        return this.getAttribute("margin") || "0";
    }
    get format() {
        return this.getAttribute("format")?.toLowerCase() || "letter";
    }
    get orientation() {
        if (this.hasAttribute("orientation")) {
            return this.getAttribute("orientation").toLowerCase() || "portrait";
        }
        if (this.hasAttribute("format")) {
            const size = this.getSize();
            if (size.width > size.height) return "landscape";
            return "portrait";
        }
        return undefined;
    }
    get marks() {
        const result = {
            width: 1,
            length: 24,
            style: "solid",
            color: "hsla(0, 0%, 0%, 10%)"
        };
        if (!this.hasAttribute("marks")) {
            return result;
        }
        const marks = this.getAttribute("marks").toLowerCase().trim();
        if (marks === "none") {
            return "none";
        }
        
        const parts = marks.split(/\s+/);
        const sizes = parts.filter(p => p.match(/^[\d+-.]+[a-z]*$/));
        
        if (sizes.length > 0) {
            result.length = this.toPoints(sizes[1]) || result.length;
        }
        if (sizes.length > 1) {
            result.width = this.toPoints(sizes[0]) || result.width;
        }
        const style = parts.find(p => p.match(/solid|dashed|dotted/));
        if (style) {
            result.style = style;
        }
        const color = parts.find(p => p.match(/^#[0-9a-f]{3,8}|[a-z]+\(.+\)$/));
        if (color) {
            result.color = color;
        }
        
        return result;
    }
    formatPage(page) {
        var size = this.getSize();
        if (this.orientation) {
            page.style.setProperty("page", this.orientation);
        }
        this.style.setProperty("--width", size.width + "pt");
        this.style.setProperty("--height", size.height + "pt");
        this.style.setProperty("--margin", this.margin);
        this.style.setProperty("--cols", this.cols);
        this.style.setProperty("--rows", this.rows);
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
    getSize() {
        var width = 0, height = 0;
        switch (this.format) {
            case "letter":
                width = this.toPoints(8.5, "in");
                height = this.toPoints(11, "in");
                break;
            case "legal":
                width = this.toPoints(8.5, "in");
                height = this.toPoints(14, "in");
                break;
            case "ledger":
            case "tabloid":
                width = this.toPoints(11, "in");
                height = this.toPoints(17, "in");
                break;
            case "a3":
                width = this.toPoints(297, "mm");
                height = this.toPoints(420, "mm");
                break;
            case "a4":
                width = this.toPoints(210, "mm");
                height = this.toPoints(297, "mm");
                break;
            default:
                let [w, wu, h, hu] = /([0-9.]+)([a-z]+)X([0-9.]+)([a-z]+)/i.exec(this.format).slice(1);
                width = this.toPoints(w, wu);
                height = this.toPoints(h, hu);
        }
        if (this.hasAttribute("orientation")) {
            if (this.orientation === "landscape" && width < height || this.orientation === "portrait" && width > height) {
                [width, height] = [height, width];
            }
        }
        return { width: width, height: height };
    }
    /**
     * Converts a value from a specified unit to points (pt).
     * @param {number} val - The value to convert.
     * @param {string} unit - The unit of the value (e.g., "in", "mm").
     * @returns {number} - The converted value in points (pt).
     */
    toPoints(val, unit) {
        if (typeof val === "string") {
            unit = val.match(/[a-z]*$/i)[0];
            val = parseFloat(val);
        }
        
        unit = unit?.toLowerCase() || "pt";
        
        const PTS = { pt: 1, in: 72, pc: 12, px: .75, mm: 2.83465, cm: 28.3465, dm: 283.465, m: 2834.65 };
        // TODO Manage %, ch and ex units
        // get body computed font size
        PTS.em = parseFloat(getComputedStyle(document.body).fontSize) * PTS.px;
        val = parseFloat(val);
        if (PTS[unit] === undefined) {
            throw `Unrecognized length unit '${unit}'`;
        }
        return val * PTS[unit];
    }
    static init(meta) {
        this.meta = meta;
        customElements.define(this.tagName, this);
    }
};

// Initialize the Page class.
Page.init(import.meta);
