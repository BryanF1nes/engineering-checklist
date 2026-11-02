import Item from '../modules/Item.js';

class Project {
    list = [];

    static Status = Object.freeze({
        ONGOING: 'On-Going',
        REVIEWING: 'Under Review',
        COMPLETED: 'Completed'
    });

    static Stage = Object.freeze({
        TEN: 10,
        THIRTY: 30,
        SIXTY: 60,
        NINETY: 90,
        BID: 'Bid',
        CONSTRUCTION: 'Construction'
    })

    constructor(name) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.status = Project.Status.ONGOING;
        this.stage = Project.Stage.TEN;
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
