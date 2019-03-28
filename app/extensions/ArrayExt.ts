export {};

declare global {
    interface Array<T> {
        sortByFieldAsc(sortField: string): this;
        sortByFieldDesc(sortField: string): this;
    }
}

Array.prototype.sortByFieldAsc = function(sortField: string) {
    return this.sort((a, b) => {
        if (a[sortField] > b[sortField]) return 1;
        if (a[sortField] <  b[sortField]) return -1;
        return 0;
    });
};

Array.prototype.sortByFieldDesc = function(sortField: string) {
    return this.sort((a, b) => {
        if (a[sortField] < b[sortField]) return 1;
        if (a[sortField] >  b[sortField]) return -1;
        return 0;
    });
};
