export class Daimoku {
    id: string;
    memberCode?: string;
    memberName?: string;
    distritoId: string;
    date: Date;
    minutes: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Daimoku) {
        this.id = data.id;
        this.memberCode = data.memberCode;
        this.memberName = data.memberName;
        this.distritoId = data.distritoId;
        this.date = data.date;
        this.minutes = data.minutes;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}