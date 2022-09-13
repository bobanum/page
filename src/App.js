export default class App {
    static main() {
        alert("111");
    }
    static init() {
        this.orientation = "portrait";
        this.format = "lettre";
        this.colonnes = 2;
        this.rangees = 2;
        return new Promise(resolve => {
            window.addEventListener("load", e => {
                resolve();
            });
        });
    }
}