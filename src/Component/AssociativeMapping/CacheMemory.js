export default class CacheMemory {
    constructor(numberOfLines, Array, currentIndex) {
        this.numberOfLines = numberOfLines;
        this.Array = Array;
        this.currentIndex = currentIndex;

        // Khai báo 2 phương thức missOrHit và getData.
        this.missOrHit = function (data_compare, set_index) {
            for ( let item of this.Array) {
                if(item.index===set_index && item.tagbit===data_compare) {
                    return true;
                }
            }
            return false;
        }
        this.getData = function () {
            return this.Array;
        }
    }
}