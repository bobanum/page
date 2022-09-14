export default class App {
    static main() {
        var { href } = new URL(import.meta.url);
        href = href.split("/").slice(0,-2);
        href.push("css", "style.css");
        href = href.join("/");
        var link = document.head.appendChild(document.createElement("link"));
        link.href = href;
        link.rel = "stylesheet";
        var volets = document.querySelectorAll(".volet");
        volets.forEach(volet => {
            var page = document.body.appendChild(document.createElement("div"));
            page.classList.add("page");
            page.style.setProperty("--colonnes", this.colonnes);
            page.style.setProperty("--rangees", this.rangees);
            page.appendChild(this.marques(this.rangees, this.colonnes));
            var nb = this.colonnes * this.rangees - 1;
            page.appendChild(volet);
            for (let i = 0; i < nb; i += 1) {
                page.appendChild(volet.cloneNode(true));
            }
        });
    }
    static marques(rangees, colonnes) {
        var resultat = document.createElement("div");
        resultat.classList.add("marques");
        var divRangees = resultat.appendChild(document.createElement("div"));
        divRangees.classList.add("colonnes");
        for (let c = 1; c < colonnes; c += 1) {
            var groupe = divRangees.appendChild(document.createElement("div"));
            for (let r = 1; r < rangees; r += 1) {
                groupe.appendChild(document.createElement("div"));
            }
        }
        var divColonnes = resultat.appendChild(document.createElement("div"));
        divColonnes.classList.add("rangees");
        for (let r = 1; r < rangees; r += 1) {
            var groupe = divColonnes.appendChild(document.createElement("div"));
            for (let c = 1; c < colonnes; c += 1) {
                groupe.appendChild(document.createElement("div"));
            }
        }
        return resultat;
    }
    static init() {
        this.orientation = "portrait";
        this.format = "lettre";
        this.colonnes = 1;
        this.rangees = 2;
        return new Promise(resolve => {
            window.addEventListener("load", e => {
                resolve();
            });
        });
    }
}