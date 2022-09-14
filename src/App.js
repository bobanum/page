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
        href = href.split("/").slice(0,-2);
        href.push("css", "style.css");
        href = href.join("/");
        var link = document.head.appendChild(document.createElement("link"));
        link.href = href;
        link.rel = "stylesheet";
        var flaps = document.querySelectorAll(".flap");
        flaps.forEach(flap => {
            var page = document.body.appendChild(document.createElement("div"));
            page.classList.add("page");
            page.style.setProperty("--columns", this.columns);
            page.style.setProperty("--rows", this.rows);
            page.appendChild(this.marks(this.rows, this.columns));
            var nb = this.columns * this.rows - 1;
            page.appendChild(flap);
            for (let i = 0; i < nb; i += 1) {
                page.appendChild(flap.cloneNode(true));
            }
        });
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