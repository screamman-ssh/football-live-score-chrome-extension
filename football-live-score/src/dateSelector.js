export class dateSelector {
    constructor() {
        this.currentDate = new Date();
        this.date = new Date();
    }
    //setDate -> auto set correct month and year
    nextDate() {
        this.date.setDate(this.date.getDate() + 1);
    }
    backDate() {
        this.date.setDate(this.date.getDate() - 1);
    }
    getDateDif() {
        return this.currentDate.getDate() - this.date.getDate()
    }
    getCurrentDate() {
        this.currentDate = new Date();
        return this.currentDate;
    }
    getDate() {
        return this.date;
    }
    getDateISO() {
        return this.date.toLocaleDateString("en-CA");
    }
    getDateStr() {
        var targetDate = this.date.toLocaleDateString("en-CA");
        var date = this.currentDate.toLocaleDateString("en-CA");
        //check if date is today
        var strDate = (date == targetDate) ? "Today" : (this.date.toString().split(" ").slice(0, 3)).toString().replaceAll(",", " ");
        return strDate;
    }
}