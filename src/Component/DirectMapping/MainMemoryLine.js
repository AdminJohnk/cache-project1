// Tạo ra class MainMemoryLine kế thừa lớp MemoryLine
import MemoryLine from './MemoryLine';

export default class MainMemoryLine extends MemoryLine {
    constructor(index, buffer) {
        super(index, buffer);
    }
}
