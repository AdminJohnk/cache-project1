// Tạo ra class CacheMemoryLine kế thừa lớp MemoryLine và bổ sung thêm 2 thuộc tính valid và tagbit
import MemoryLine from './MemoryLine';

export default class CacheMemoryLine extends MemoryLine {
    constructor(index, buffer, valid, tagbit, DirtyBit) {
        super(index, buffer);
        this.valid = valid;
        this.tagbit = tagbit;
        this.DirtyBit = DirtyBit;
    }
}
