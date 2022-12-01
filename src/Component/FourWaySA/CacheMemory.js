export default class CacheMemory {
    constructor(numberOfLines, Array, currentIndex) {
        this.numberOfLines = numberOfLines;
        this.Array = Array;
        this.currentIndex = currentIndex;

        // Khai báo phương thức missOrHit
        this.missOrHit = function (data_compare, set_index) {
            for ( let item of this.Array) {
                if(item.index===set_index && item.tagbit===data_compare) {
                    return true;
                }
            }
            return false;
        }
    }
}