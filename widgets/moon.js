export class Widget {
    constructor(){
        this.subscriptions = ["position"];
    }
    load() {
    }
    async position(position) {
        if(!(position instanceof Error)) {
            const time = Time.getTime();
        }
    }
}