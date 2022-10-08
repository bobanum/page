export default class App {
    static parseData(element, obj = {}) {
        for (const prop in element.dataset) {
            if (Object.hasOwnProperty.call(element.dataset, prop)) {
                obj[prop] = element.dataset[prop];
            }
        }
        return obj;
    }
    static get columns() {
        return this._columns;
    }
    static set columns(val) {
        this._columns = parseInt(val);
    }
    static get rows() {
        return this._rows;
    }
    static set rows(val) {
        this._rows = parseInt(val);
    }
    static main() {
        var { href } = new URL(import.meta.url);
        href = href.split("/").slice(0, -2);
        href.push("css", "style.css");
        href = href.join("/");
        var link = document.head.insertBefore(document.createElement("link"), document.head.firstChild);
        link.href = href;
        link.rel = "stylesheet";
        var flaps = document.querySelectorAll(".flap");
        flaps.forEach(flap => {
            var props = Object.create(this);
            this.parseData(flap, props);
            console.log(this, props);
            var page = document.body.appendChild(document.createElement("div"));
            page.classList.add("page");
            var format = this.getFormat(props);
            page.style.setProperty("--width", format.width + "pt");
            page.style.setProperty("--height", format.height + "pt");
            page.style.setProperty("--margin", props.margin);
            page.style.setProperty("--columns", props.columns);
            page.style.setProperty("--rows", props.rows);
            page.appendChild(this.marks(props.rows, props.columns));
            var nb = props.columns * props.rows - 1;
            page.appendChild(flap);
            for (let i = 0; i < nb; i += 1) {
                page.appendChild(flap.cloneNode(true));
            }
        });
    }
    static getFormat(obj = this) {
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
        if ((obj.orientation === "portrait" && width > height) || (obj.orientation === "landscape" && width < height)) {
            [width, height] = [height, width];
        }
        return {width: width, height: height};
    }
    static toPts(val, unit) {
        const PTS = { pt: 1, in: 72, pc: 12, px: .75, mm: 2.83465, cm: 28.3465, dm: 283.465, m: 2834.65 };
        val = parseFloat(val);
        unit = unit.toLowerCase();
        if (PTS[unit] === undefined) {
            throw `Unrecognized length unit '${unit}'`;
        }
        return val * PTS[unit];
    }
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
    static init() {
        this.orientation = "portrait";
        this.format = "letter";
        this._columns = 1;
        this._rows = 1;
        this.margin = "0.5in";
        return new Promise(resolve => {
            window.addEventListener("load", e => {
                this.parseData(document.body, this);
                this.main();
                resolve();
            });
        });
    }
}
App.init();