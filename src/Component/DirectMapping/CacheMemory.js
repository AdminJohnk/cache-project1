export default class CacheMemory {
    constructor(numberOfLines, Array, currentIndex) {
        this.numberOfLines = numberOfLines;
        this.Array = Array;
        this.currentIndex = currentIndex;

        // Khai báo 2 phương thức missOrHit và getData.
        this.missOrHit = function (data_compare) {

            if(this.Array[this.currentIndex].tagbit !== data_compare || this.Array[this.currentIndex].valid === 0) {
                return false;
            }
            return true;
        }
        this.getData = function () {
            return this.Array;
        }
    }
}