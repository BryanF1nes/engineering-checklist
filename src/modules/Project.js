import { Item } from '../modules/Item.js';

class Project {
    list = [];

    static Status = Object.freeze({
        ONGOING: 'ON-GOING',
        REVIEWING: 'UNDER REVIEW',
        COMPLETED: 'COMPLETED'
    });

    static Stage = Object.freeze({
        "10": 10,
        "30": 30,
        "60": 60,
        "90": 90,
        BID: 'Bid',
        CONSTRUCTION: 'CONSTRUCTION'
    })

    constructor(name) {
        this.name = name;
        this.status = Project.Status.ONGOING;
        this.stage = Project.Stage[10];
        this.createdAt = Date.now();
        this.finishedAt = null;
    }

    createItem(name) {
        const item = new Item(name);
        this.list.push(item);

        return item;
    }

    deleteItem(id) {
        this.list = this.list.filter(item => item.id !== id);
    }

    renameProject(name) {
        this.name = name;
    }

    updateStatus(newStatus) {
        if (!Object.values(Project.Status).includes(newStatus)) {
            throw new Error(`Invalid status: ${newStatus}`);
        }

        this.status = newStatus;

        if (newStatus === Project.Status.COMPLETED) {
            this.finishedAt = Date.now();
        } else {
            this.finishedAt = null;
        }
    }

    updateStage(newStage) {
        if (!Object.values(Project.Stage).includes(newStage)) {
            throw new Error(`Invalid stage: ${newStage}`);
        }

        this.stage = newStage;
    }
}

export default Project;
