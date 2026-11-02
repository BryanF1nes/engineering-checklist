class Item {
    static Status = Object.freeze({
        PENDING: 'PENDING',
        COMPLETED: 'COMPLETED'
    });

    constructor(name) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.status = Item.Status.PENDING;
        this.createdAt = Date.now();
        this.finishedAt = null;
    }

    updateName(name) {
        this.name = name;

        return;
    }

    updateStatus() {
        this.status = this.status === Item.Status.PENDING
            ? Item.Status.COMPLETED
            : Item.Status.PENDING;

        if (this.status === Item.Status.COMPLETED) {
            this.finishedAt = Date.now();
        } else {
            this.finishedAt = null;
        }

        return this.status;
    }
}

export default Item;
