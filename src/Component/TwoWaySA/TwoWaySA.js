import React, { Component } from 'react'
import MainMemoryLine from './MainMemoryLine'
import MainMemory from './MainMemory'
import CacheMemoryLine from './CacheMemoryLine'
import CacheMemory from './CacheMemory'
import PAaddress_TwoWay from './PAaddress_TwoWay'
import styled from 'styled-components';
// import './TwoWaySA.css'

function getID(id) {
   return document.getElementById(id)
}
function log2(n) {
   return Math.log(n) / Math.log(2)
}
// Hàm kiểm tra là số nguyên dương
function isInteger(n) {
   return n % 1 === 0 && n > 0
}

const StyleTotal = styled.div`
.maincontent {
    margin-top: 10px;
    padding: 0;
    
}
.maincontent .Policies_title{
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 3px;
}
.maincontent .Policies_radio{
    flex-direction: row;
}
.name_element {
    margin-top: 9px;
    margin-bottom: 0;
    font-size: 15px;
}
.inputtext .form-control:focus {
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.08rem rgb(13 110 253 / 25%);
    /* background-color: #ff5c8dc7; */
}
.instruction__select:focus {
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.08rem rgb(13 110 253 / 25%);
}
.maincontent .aline {
    margin-top: 10px;
    margin-bottom: 10px;
}
.aline__button button {
    width: 152px;
}
.instruction__title {
    font-size: 18px;
}
.instruction__inputtext {
    width: 100%;
}
.information_text {
    text-align: center;
    width: 100%;
    height: 98px;
    overflow: auto;
}
#information_Configure {
    text-align: center;
    width: 100%;
    height: 98px;
    overflow: auto;
}
.form-control {
    height: 33px;
    font-size: 15px;
}
.aline__button button {
    height: 38px;
}
hr {
    margin: 0.7rem 0;
    background-color: black;
    height: 2px !important;
}
.statistics {
    font-size: 13px;
}
.btn-check:focus + .btn-primary,
.btn-primary:focus {
    box-shadow: none !important;
    background-color: #0d6efd !important;
    border-color: #0d6efd !important;
}
.maxcol {
    padding: 0 15px 0 35px;
}
.maxcol__caculator {
    margin-top: 20px;
}
.instruction_breakdown .caption {
    width: 90%;
    text-align: center;
    margin: 0 auto;
    padding-bottom: 10px;
}
.instruction_breakdown .caption .tr_of_thead td {
    padding: 0;
    width: 33.33%;
}
.instruction_breakdown .caption .tr_of_tbody td {
    padding: 0;
    width: 33.33%;
}
.instruction_breakdown .caption thead {
    font-weight: 700;
}
.memoryTable {
    height: 100px;
    border: 1px solid #000;
    overflow: auto;
    display: inline-block;
    white-space: nowrap;
    width: 100%;
}
.instruction_breakdown_title,
.memory_block_title,
.cache_table_title {
    font-size: 25px;
    margin-bottom: 10px;
}
.cache_table .drawtable {
    width: 90%;
    margin: auto;
    border: 1px solid #aaa;
    table-layout: fixed;
    border-collapse: collapse;
}
.cache_table .drawtable td,
.cache_table .drawtable th {
    border: 1px solid #ddd;
    text-align: left;
    padding: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.drawtable thead {
    background-color: #aaa;
}
.memoryTable .drawtable {
    width: 100%;
    font-size: 15px;
    text-align: center;
}
.current_row_close::after {
    content: "✘";
    position: absolute;
    left: 15px;
    color: red;
    top: -1px;
}
.current_row_tick::after {
    content: "✓";
    position: absolute;
    left: 15px;
    color: #009624;
    top: -1px;
    font-weight: 900;
}
.Miss_After::after {
    content: 'Miss';
    color: red;
    position: absolute;
    left: -56px;
    top: -1px;
    font-weight: 700;
    font-size: 19px;
}
.Hit_After::after {
    content: 'Hit';
    color: red;
    position: absolute;
    left: -56px;
    top: -1px;
    font-weight: 700;
    font-size: 19px;
    /* color: transparent; */
}

`;

export default class TwoWaySA extends Component {
   state = {
      cache_size: 0,
      memory_size: 0,
      offset_bits: 0,
   }

   // Trạng thái các nút
   submit_part1 = 'chuanhan';
   submit_part2 = 'chuanhan';
   random_button = 'chuanhan';

   mainMemory;
   cacheMemory;

   PA_address;
   tag_bit;
   set_index;
   soLanNext;
   Miss_or_Hit;
   policy;

   miss = 0;
   hit = 0;

   createMainMemory = () => {
      let soDong = this.state.memory_size / Math.pow(2, this.state.offset_bits);
      let soCot = Math.pow(2, this.state.offset_bits);

      let array = []; // Mảng chứa các dòng
      // Tạo các dòng trong main memory
      for (let i = 0; i < soDong; i++) {
         let buffer = []; // nội dung của 1 dòng là 1 mảng n phần tử
         for (let j = 0; j < soCot; j++) {
            // ramdom anychar cho một ký tự bất kỳ trong khoản a-z A-Z 0-9
            let anychar;
            do {
               anychar = String.fromCharCode(Math.floor(Math.random() * 62) + 65);
            } while (anychar === ' ' || anychar === '\n' || anychar === '\t');

            buffer.push(`B. ${i} - ${anychar}`);
         }
         let mainMemoryLine = new MainMemoryLine(i, buffer);
         array.push(mainMemoryLine);
      }
      this.mainMemory = new MainMemory(soDong, array, 0, soCot);
      // console.log(this.mainMemory);
   }
   createCacheMemory = () => {
      // Tạo cache memory
      let soDong = this.state.cache_size / Math.pow(2, this.state.offset_bits);
      let array = []; // Mảng chứa các dòng
      let index = -1;
      for (let i = 0; i < soDong; i++) {
         if (i % 2 === 0) {
            index++;
         }
         let stt;
         if (i % 2 === 0) {
            stt = 0;
         } else {
            stt = 1;
         }
         let cacheMemoryLine = new CacheMemoryLine(index, 0, 0, '-', 0, stt);
         array.push(cacheMemoryLine);
      }
      this.cacheMemory = new CacheMemory(soDong, array, 0);
   }
   lamRong = () => {
      if (!isInteger(this.state.cache_size) || !isInteger(this.state.memory_size) || !isInteger(this.state.offset_bits)) {
         return <tr className='tr_of_tbody'>
            <td id="tagbit">&nbsp;</td>
            <td id="indexbit">&nbsp;</td>
            <td id="offsetbit">&nbsp;</td>
         </tr>
      }
      else {
         return <tr className='tr_of_tbody'>
            <td id="tagbit">{this.tag_bit} bit</td>
            <td id="indexbit">{this.set_index} bit</td>
            <td id="offsetbit">{this.state.offset_bits} bit</td>
         </tr>
      }
   }
   render_memory_block = () => {
      let soDong = this.mainMemory.numberOfBlock;
      let soCot = this.mainMemory.byteOfBlock;

      if (!isInteger(soDong) || !isInteger(soCot)) {
         return <tr></tr>
      }
      if (soDong === 0) {
         return <tr></tr>
      }

      let arr = [];
      for (let i = 0; i < soDong; i++) {
         let arr1 = [];
         for (let j = 0; j < soCot; j++) {
            arr1.push(<td id={'memory_block_col' + j}>{this.mainMemory.Array[i].buffer[j]}</td>);
         }
         arr.push(<tr className='memory_block_row' id={'memory_block_row' + i}> {arr1} </tr>);
      }
      // console.log(this.mainMemory.Array[0]);
      return arr;
   }
   render_cache_table = () => {
      let soDong = this.cacheMemory.numberOfLines;

      if (!isInteger(soDong)) {
         return <tr></tr>
      }
      if (soDong === 0) {
         return <tr></tr>
      }

      let arr = [];
      for (let i = 0; i < soDong; i++) {
         let arr1 = [];
         arr1.push(<td id='Index' className={"text-center position-relative"}>{this.cacheMemory.Array[i].index}</td>);
         arr1.push(<td id='Valid' className={"text-center position-relative"}>{this.cacheMemory.Array[i].valid}</td>);
         arr1.push(<td id='Tag' className={"text-center position-relative"}>{this.cacheMemory.Array[i].tagbit}</td>);
         arr1.push(<td id='Data' className={"text-center position-relative"}>{this.cacheMemory.Array[i].buffer}</td>);
         arr1.push(<td id='Dirty' className={"text-center position-relative"}>{this.cacheMemory.Array[i].DirtyBit}</td>);
         arr.push(<tr id={Number(this.cacheMemory.Array[i].stt)} className={'class_cache_table_' + this.cacheMemory.Array[i].index}> {arr1} </tr>);

      }
      return arr;
   }
   checkValidInput = (Cache_size, Memory_size, Offset_bits) => {
      // Nếu cache size không phải là bội số của 2
      let x = log2(Cache_size);
      let y = log2(Memory_size);

      if (!isInteger(x) || !isInteger(y)) {
         alert('Cache, Memory and Offset must be in power of two');
         return false;
      }

      // Nếu giá trị đầu vào không hợp lệ
      let PAaddress = log2(Memory_size);
      let Tag_bits = PAaddress - Offset_bits;
      if (!isInteger(Offset_bits) || !isInteger(Tag_bits)) {
         alert('Invalid value');
         return false;
      }
      return true;
   }
   configSubmit1 = () => {
      // Lấy 3 biến về
      let Cache_size = parseInt(getID('cache_size').value);
      let Memory_size = parseInt(getID('memory_size').value);
      let Offset_bits = parseInt(getID('offset_bits').value);

      // Kiểm tra giá trị đầu vào
      if (!this.checkValidInput(Cache_size, Memory_size, Offset_bits)) {
         return;
      }
      if(Number(Memory_size)>4096){
         alert('Memory size must be less than 4096');
         return;
      }

      let PAaddress = log2(Memory_size);
      let BlockOfSet = Math.pow(2, Offset_bits);
      let SetIndex = log2(Cache_size / BlockOfSet / 2);
      let Tagbit = PAaddress - Offset_bits - SetIndex;

      // Disable các input
      this.submit_part1 = 'danhan';
      getID('submit_part1').disabled = true;
      getID('cache_size').readOnly = true;
      getID('memory_size').readOnly = true;
      getID('offset_bits').readOnly = true;

      getID('policy_FIFO').disabled = true;
      getID('policy_LRU').disabled = true;
      getID('policy_Random').disabled = true;

      // Chọn policy
      if (getID('policy_FIFO').checked) {
         this.policy = 'FIFO';
      } else if (getID('policy_LRU').checked) {
         this.policy = 'LRU';
      } else if (getID('policy_Random').checked) {
         this.policy = 'Random';
      }

      this.setState({
         cache_size: Cache_size,
         memory_size: Memory_size,
         offset_bits: Offset_bits,
      })

      getID('information_text').innerHTML =
         `Offset = ${Offset_bits} bits<br />
        Set Index = log<sub>2</sub>(${Cache_size}/${BlockOfSet}/2) = ${SetIndex} bits<br />
        Physical Address = log<sub>2</sub>(${Memory_size}) = ${PAaddress} bits<br />
        Tag = ${PAaddress} bits - ${Offset_bits} bits - ${SetIndex} bits = ${Tagbit} bits<br />
        Block = ${Tagbit} bits + ${SetIndex} bits = ${Tagbit + SetIndex} bits<br /><br />

        Please submit Instruction.`
   }
   configSubmit2 = () => {
      // Khi đã chưa nhấn submit1 thì không cho random hoặc input rỗng thì cũng ko chạy
      if (this.submit_part1 === 'chuanhan') {
         return;
      }

      // Lấy số nhị phân cần so sánh chiều dài
      let binary_number = getID('instruction__input').value.toString();
      binary_number = Number('0x' + binary_number).toString(2);
      // Lấy chiều dài
      let length = log2(this.state.memory_size);

      if (getID('instruction__input').value === '' || binary_number.length > length) {
         alert('Instruction is not valid. Please try again');
         return;
      }

      this.submit_part2 = 'danhan';
      getID('submit_part2').disabled = true;

      // Lấy dữ liệu số đang xét chuyển thành nhị phân
      this.data_current = getID('instruction__input').value;
      let binary = Number('0x' + this.data_current).toString(2);

      // Khởi tạo đối tượng _PAaddress với các thuộc tính tương ứng
      let _PAaddress = log2(this.state.memory_size);
      // Nếu độ dài không bằng thì thêm các số 0 vào trước binary cho đến khi bằng độ dài _PAaddress
      if (binary.length < _PAaddress) {
         let temp = '';
         for (let i = 0; i < _PAaddress - binary.length; i++) {
            temp += '0';
         }
         binary = temp + binary;
      }

      this.PA_address = new PAaddress_TwoWay(binary.slice(0, this.tag_bit), binary.slice(this.tag_bit, this.tag_bit + this.set_index), binary.slice(this.tag_bit + this.set_index, binary.length));

      // Thể hiện lên màn hình
      getID('caption__tag').innerHTML = this.PA_address.tag;
      getID('caption__index').innerHTML = this.PA_address.index;
      getID('caption__ofsset').innerHTML = this.PA_address.offset;

      getID('caption__tag').style.backgroundColor = '#29b5f6a8';
      getID('caption__index').style.backgroundColor = '#29b5f6a8';
      getID('caption__ofsset').style.backgroundColor = '#29b5f6a8';

      // Information
      getID('information_text').style.backgroundColor = '#29b5f6a8';
      getID('information_text').innerHTML = 'The instruction has been converted from hex to binary and allocated to tag, index, and offset respectively';
   }
   random_Detail = (start, end, number) => {
      let data = '';
      for (let i = 0; i < 10; i++) {
         let hexa = (Math.floor(Math.random() * (end + 0x1 - start)) + start).toString(16);
         data += hexa + ',';
      }
      data = data.slice(0, data.length - 1);

      let take;
      take = data.slice(0, number);
      data = data.slice(number + 1, data.length);
      getID('instruction__input').value = take;
      getID('instruction__data').value = data;
   }
   randomData = () => {
      // Khi đã chưa nhấn submit1 thì không cho random
      // Khi đã nhấn submit2 thì không cho random 
      if (this.submit_part1 === 'chuanhan') {
         return;
      }
      let PAaddress = log2(this.state.memory_size);

      // Các trường hợp
      if (PAaddress === 3) {
         this.random_Detail(0x1, 0x7, 1);
      }
      else if (PAaddress === 4) {
         this.random_Detail(0x8, 0xf, 1);
      }
      else if (PAaddress === 5) {
         this.random_Detail(0x10, 0x1f, 2);
      }
      else if (PAaddress === 6) {
         this.random_Detail(0x20, 0x3f, 2);
      }
      else if (PAaddress === 7) {
         this.random_Detail(0x40, 0x7f, 2);
      }
      else if (PAaddress === 8) {
         this.random_Detail(0x80, 0xff, 2);
      }
      else if (PAaddress === 9) {
         this.random_Detail(0x100, 0x1ff, 3);
      }
      else if (PAaddress === 10) {
         this.random_Detail(0x200, 0x3ff, 3);
      }
      else if (PAaddress === 11) {
         this.random_Detail(0x400, 0x7ff, 3);
      }
      else if (PAaddress === 12) {
         this.random_Detail(0x800, 0xfff, 3);
      }
   }
   configNext = () => {
      if (this.submit_part2 === 'chuanhan') {
         alert('Please submit Instruction.');
         return;
      }
      // Lấy dòng trùng với cache index đang chọn trên giao diện
      let data_ = this.PA_address.index;
      data_ = parseInt(data_, 2);
      let current_set = document.getElementsByClassName('class_cache_table_' + data_);


      if (this.soLanNext === 0) {
         // Set màu cho Instruction Breakdown
         getID('caption__index').style.backgroundColor = '#ff5c8dc7';
         getID('caption__tag').style.backgroundColor = 'transparent';
         getID('caption__ofsset').style.backgroundColor = 'transparent';

         // Information
         getID('information_text').innerHTML = 'Index requested will be searched in cache as highlighted in pink';
         getID('information_text').style.backgroundColor = '#ff5c8dc7';

         // Set màu cho Cache Table
         for (let item of current_set) {
            for (let i = 0; i < 5; i++) {
               item.getElementsByTagName('td')[i].style.backgroundColor = '#ff5c8dc7';
            }
         }

         this.soLanNext++;
         return;
      }
      if (this.soLanNext === 1) {
         for (let item of current_set) {
            item.getElementsByTagName('td')[2].style.backgroundColor = '#29b5f6a8'
         }
         getID('caption__tag').style.backgroundColor = '#29b5f6a8';
         // Information
         getID('information_text').innerHTML = 'Index requested will be searched in whole cache';

         this.soLanNext++;
         return;
      }
      if (this.soLanNext === 2) {
         getID('caption__tag').style.backgroundColor = '#29b5f6a8';
         let current_row = false;
         let tagColumn;
         for (let item of current_set) {
            tagColumn = item.getElementsByTagName('td')[2];
            if (tagColumn.innerHTML === this.PA_address.tag) {
               current_row = item;
               tagColumn.classList.add('current_row_tick');
            } else {
               tagColumn.classList.add('current_row_close');
            }
         }
         // Bị Miss
         if (!current_row) {
            // Information
            this.Miss_or_Hit = 'Miss';
            getID('information_text').style.backgroundColor = '#ff5c8dc7';
            getID('information_text').innerHTML = `No cache contains ${this.PA_address.tag} as value in this set, therefore cache MISS is obtained.`;
         }
         // Bị Hit
         else {
            // Information
            this.Miss_or_Hit = 'Hit';
            getID('information_text').style.backgroundColor = '#29b5f6a8';
            getID('information_text').innerHTML = 'Valid tag is found in this set.';
         }

         this.soLanNext++;
         return;
      }
      if (this.soLanNext === 3) {
         // Đổi màu cột tagcolumn và gỡ các tick và close
         for (var item of current_set) {
            for (let i = 0; i < 5; i++) {
               let x = item.getElementsByTagName('td')[i];
               x.style.backgroundColor = 'transparent';
               if (i === 2) {
                  x.classList.remove('current_row_tick');
                  x.classList.remove('current_row_close');
               }
            }
         }

         let id = parseInt(this.PA_address.tag + this.PA_address.index, 2);
         id = 'memory_block_row' + id;
         setTimeout(() => {
            getID(id).scrollIntoView();
         }, 2);
         getID(id).style.backgroundColor = '#29b5f6a8';
         getID('caption__tag').style.backgroundColor = '#29b5f6a8';
         getID('caption__index').style.backgroundColor = 'transparent';
         getID('information_text').style.backgroundColor = '#29b5f6a8';

         if (this.Miss_or_Hit === 'Miss') {
            // Information
            getID('information_text').innerHTML = 'The new cache data is imported to cache.';

            // Thay đổi theo chính sách
            if (this.policy === 'FIFO') {
               // Lấy dữ liệu trong bộ nhớ chính ra
               let id = parseInt(this.PA_address.tag + this.PA_address.index, 2);
               let buffer = this.mainMemory.Array.find(item => item.index === id).buffer;
               let data = '';
               for (var item of buffer) {
                  // Lấy ký tự cuối cùng của item công vạo data
                  data += item[item.length - 1];
               }

               // Set cho giao diện
               // Kiểm tra xem Miss có full dòng ko
               // false = full, true = có -
               let check1 = false;
               for (var item of current_set) {
                  let tagColumn = item.getElementsByTagName('td')[2];
                  // Vẫn có dòng còn trống
                  if (tagColumn.innerHTML === '-') {
                     check1 = true;
                     tagColumn.innerHTML = this.PA_address.tag;
                     item.style.backgroundColor = '#29b5f6a8';
                     item.getElementsByTagName('td')[1].innerHTML = '1';
                     item.getElementsByTagName('td')[3].innerHTML = data;
                     break;
                  }
               }
               // Toàn bộ đều full và ko có dòng nào giống tagbit
               if (!check1) {
                  let item;
                  for (var i of current_set) {
                     if (i.id === '0') {
                        item = i;
                        break;
                     }
                  }
                  item.getElementsByTagName('td')[2].innerHTML = this.PA_address.tag;
                  item.style.backgroundColor = '#29b5f6a8';
                  item.getElementsByTagName('td')[1].innerHTML = '1';
                  item.getElementsByTagName('td')[3].innerHTML = data;


                  for (var i of current_set) {
                     if (i.id === '1') {
                        i.id = '0';
                     } else {
                        i.id = '1';
                     }
                  }
               }


               // Set cho cacheMemory
               let check2 = false;
               for (var item of this.cacheMemory.Array) {
                  if (item.index === data_) {
                     if (item.tagbit === '-') {
                        check2 = true;
                        item.tagbit = this.PA_address.tag;
                        item.valid = 1;
                        item.buffer = data;
                        break;
                     }
                  }
               }
               if (!check2) {
                  let item;
                  for (var i of this.cacheMemory.Array) {
                     if (i.index === data_) {
                        if (i.stt === 0) {
                           item = i;
                           break;
                        }
                     }
                  }
                  item.tagbit = this.PA_address.tag;
                  item.valid = 1;
                  item.buffer = data;

                  for (var i of this.cacheMemory.Array) {
                     if (i.index === data_) {
                        if (i.stt === 1) {
                           i.stt = 0;
                        } else {
                           i.stt = 1;
                        }
                     }
                  }
               }
            }

         }
         if (this.Miss_or_Hit === 'Hit') {
            // Information
            getID('information_text').innerHTML = 'Cache Hit.';
         }
         for (var item of current_set) {
            if (item.getElementsByTagName('td')[2].innerHTML === this.PA_address.tag) {
               item.style.backgroundColor = '#29b5f6a8';
               break;
            }
         }


         this.soLanNext++;
         return;
      }
      if (this.soLanNext === 4) {
         let id = parseInt(this.PA_address.tag + this.PA_address.index, 2);
         id = 'memory_block_row' + id;
         getID(id).style.backgroundColor = 'transparent';

         getID('caption__tag').style.backgroundColor = 'transparent';
         // Information
         getID('information_text').style.backgroundColor = 'transparent';
         getID('information_text').innerHTML = 'The cycle has been completed.Please submit another instructions';

         for (var item of current_set) {
            let tagColumn = item.getElementsByTagName('td')[2];
            if (tagColumn.innerHTML === this.PA_address.tag) {
               item.style.backgroundColor = 'transparent';
               break;
            }
         }

         // Xóa current_input và đẩy lên 1 input mới
         let data_string = getID('instruction__data');
         let input_string = getID('instruction__input');

         let previous_input = input_string.value;

         // next_current_input lấy từ data_string.value đến khi nào gặp dấu , thì dừng
         let vt = -1;
         for (let i = 0; i < data_string.value.length; i++) {
            if (data_string.value[i] === ',') {
               vt = i;
               break;
            }
         }
         if (vt === -1) {
            input_string.value = data_string.value;
            data_string.value = '';
         } else {
            input_string.value = data_string.value.slice(0, vt);
            data_string.value = data_string.value.slice(vt + 1);

         }

         input_string.focus();

         this.submit_part2 = 'chuanhan';
         getID('submit_part2').disabled = false;

         // Tính toán tỷ lệ miss hit
         if (this.Miss_or_Hit === 'Miss') {
            this.miss++;
         } else {
            this.hit++;
         }

         let miss_rate = this.miss / (this.miss + this.hit) * 100;

         getID('missRateLabel').innerHTML = Math.round(miss_rate) + '%';
         getID('hitRateLabel').innerHTML = (100 - Math.round(miss_rate)) + '%';

         let x;
         if (this.Miss_or_Hit === 'Miss') {
            x = 'Miss';
         } else {
            x = 'Hit';
         }

         getID('Status_Miss_hit').innerHTML += `<li>Load ${previous_input.toString().toUpperCase()} [${x}]</li>`;

         // Tô màu tỷ lệ miss/hit
         let color = document.getElementsByClassName('statistics')[0];
         color.style.backgroundColor = '#FDD835';

         // Information
         getID('information_text').innerHTML = 'The cycle has been completed.Please submit another instructions';
         getID('information_text').style.backgroundColor = 'transparent';

         this.Miss_or_Hit = 'Hit';
         this.soLanNext = 0;
         return;
      }

   }
   configForward = () => {
      if (this.submit_part2 === 'chuanhan') {
         alert('Please submit Instruction.');
         return;
      }
      // Lấy dòng trùng với cache index đang chọn trên giao diện
      let data_ = this.PA_address.index;
      data_ = parseInt(data_, 2);
      let current_set = document.getElementsByClassName('class_cache_table_' + data_);

      getID('caption__tag').style.backgroundColor = 'transparent';
      getID('caption__index').style.backgroundColor = 'transparent';
      getID('caption__ofsset').style.backgroundColor = 'transparent';

      // Information
      getID('information_text').style.backgroundColor = 'transparent';
      getID('information_text').innerHTML = 'The cycle has been completed.Please submit another instructions';

      // Set màu cho Cache Table
      for (let item of current_set) {
         for (let i = 0; i < 5; i++) {
            item.getElementsByTagName('td')[i].style.backgroundColor = 'transparent';
            item.getElementsByTagName('td')[2].classList.remove('current_row_tick');
            item.getElementsByTagName('td')[2].classList.remove('current_row_close');
         }
         item.style.backgroundColor = 'transparent';
      }

      // Đổi màu Memory Block
      let id = parseInt(this.PA_address.tag + this.PA_address.index, 2);
      id = 'memory_block_row' + id;
      getID(id).style.backgroundColor = 'transparent';
      setTimeout(() => {
         getID(id).scrollIntoView();
      }, 2);


      // Kiểm tra miss or hit
      let check = this.cacheMemory.missOrHit(this.PA_address.tag, data_);
      if (!check) {
         this.Miss_or_Hit = 'Miss';
         if (this.policy === 'FIFO') {
            // Lấy dữ liệu trong bộ nhớ chính ra
            let id = parseInt(this.PA_address.tag + this.PA_address.index, 2);
            let buffer = this.mainMemory.Array.find(item => item.index === id).buffer;
            let data = '';
            for (var item of buffer) {
               // Lấy ký tự cuối cùng của item công vạo data
               data += item[item.length - 1];
            }

            // Set cho giao diện
            // Kiểm tra xem Miss có full dòng ko
            // false = full, true = có -
            let check1 = false;
            for (var item of current_set) {
               let tagColumn = item.getElementsByTagName('td')[2];
               // Vẫn có dòng còn trống
               if (tagColumn.innerHTML === '-') {
                  check1 = true;
                  tagColumn.innerHTML = this.PA_address.tag;
                  item.style.backgroundColor = 'transparent';
                  item.getElementsByTagName('td')[1].innerHTML = '1';
                  item.getElementsByTagName('td')[3].innerHTML = data;
                  break;
               }
            }
            // Toàn bộ đều full và ko có dòng nào giống tagbit
            if (!check1) {
               let item;
               for (var i of current_set) {
                  if (i.id === '0') {
                     item = i;
                     break;
                  }
               }
               item.getElementsByTagName('td')[2].innerHTML = this.PA_address.tag;
               item.style.backgroundColor = 'transparent';
               item.getElementsByTagName('td')[1].innerHTML = '1';
               item.getElementsByTagName('td')[3].innerHTML = data;


               for (var i of current_set) {
                  if (i.id === '1') {
                     i.id = '0';
                  } else {
                     i.id = '1';
                  }
               }
            }
            // Set cho cacheMemory
            let check2 = false;
            for (var item of this.cacheMemory.Array) {
               if (item.index === data_) {
                  if (item.tagbit === '-') {
                     check2 = true;
                     item.tagbit = this.PA_address.tag;
                     item.valid = 1;
                     item.buffer = data;
                     break;
                  }
               }
            }
            if (!check2) {
               let item;
               for (var i of this.cacheMemory.Array) {
                  if (i.index === data_) {
                     if (i.stt === 0) {
                        item = i;
                        break;
                     }
                  }
               }
               item.tagbit = this.PA_address.tag;
               item.valid = 1;
               item.buffer = data;

               for (var i of this.cacheMemory.Array) {
                  if (i.index === data_) {
                     if (i.stt === 1) {
                        i.stt = 0;
                     } else {
                        i.stt = 1;
                     }
                  }
               }
            }
         }
      } else {
         this.Miss_or_Hit = 'Hit';
         // Information
         getID('information_text').innerHTML = 'Cache Hit.';
      }


      // Xóa current_input và đẩy lên 1 input mới
      let data_string = getID('instruction__data');
      let input_string = getID('instruction__input');

      let previous_input = input_string.value;

      // next_current_input lấy từ data_string.value đến khi nào gặp dấu , thì dừng
      let vt = -1;
      for (let i = 0; i < data_string.value.length; i++) {
         if (data_string.value[i] === ',') {
            vt = i;
            break;
         }
      }
      if (vt === -1) {
         input_string.value = data_string.value;
         data_string.value = '';
      } else {
         input_string.value = data_string.value.slice(0, vt);
         data_string.value = data_string.value.slice(vt + 1);

      }

      input_string.focus();

      this.submit_part2 = 'chuanhan';
      getID('submit_part2').disabled = false;

      // Tính toán tỷ lệ miss hit
      if (this.Miss_or_Hit === 'Miss') {
         this.miss++;
      } else {
         this.hit++;
      }

      let miss_rate = this.miss / (this.miss + this.hit) * 100;

      getID('missRateLabel').innerHTML = Math.round(miss_rate) + '%';
      getID('hitRateLabel').innerHTML = (100 - Math.round(miss_rate)) + '%';

      let x;
      if (this.Miss_or_Hit === 'Miss') {
         x = 'Miss';
      } else {
         x = 'Hit';
      }

      getID('Status_Miss_hit').innerHTML += `<li>Load ${previous_input.toString().toUpperCase()} [${x}]</li>`;

      // Tô màu tỷ lệ miss/hit
      let color = document.getElementsByClassName('statistics')[0];
      color.style.backgroundColor = '#FDD835';

      // Information
      getID('information_text').innerHTML = 'The cycle has been completed.Please submit another instructions';
      getID('information_text').style.backgroundColor = 'transparent';

      this.Miss_or_Hit = 'Hit';
      this.soLanNext = 0;
      return;

   }

   render() {
      let PA = log2(this.state.memory_size);
      this.set_index = log2(this.state.cache_size / Math.pow(2, this.state.offset_bits) / 2);
      this.tag_bit = PA - this.state.offset_bits - this.set_index;

      this.createMainMemory();
      this.createCacheMemory();

      this.soLanNext = 0;
      this.Miss_or_Hit = 'Hit';

      return (
         <StyleTotal className='container-fluid'>
            <div className='row maincontent container-fluid'>
               <div className='col-3 mincol'>
                  <div className='replacement_Policies'>
                     <div className='Policies_title'>
                        Replacement Policies
                     </div>
                     <div className='Policies_radio row'>
                        <label className='col-4'>
                           <input id='policy_FIFO' type="radio" name="ReplacementPolicy" onchange="adjustLRU()" value="FIFO" defaultChecked='true' /> FIFO
                        </label>
                        <label className='col-4'>
                           <input id='policy_LRU' type="radio" name="ReplacementPolicy" onchange="adjustLRU()" value="LRU" /> LRU
                        </label>
                        <label className='col-4'>
                           <input id='policy_Random' type="radio" name="ReplacementPolicy" onchange="adjustLRU()" value="Random" /> Random
                        </label>
                     </div>
                  </div>
                  <hr />
                  <div className='input'>
                     <div className='row aline'>
                        <div className='col-6'>
                           <p className='name_element'>Cache Size</p>
                        </div>
                        <div className='col-6 inputtext'>
                           <input id="cache_size" type="text" className="form-control" placeholder="bytes" defaultValue={16} />

                        </div>
                     </div>
                     <div className='row aline'>
                        <div className='col-6'>
                           <p className='name_element'>Memory Size</p>
                        </div>
                        <div className='col-6 inputtext'>
                           <input id='memory_size' type="text" className="form-control" placeholder="bytes" defaultValue="2048" />
                        </div>
                     </div>
                     <div className='row aline'>
                        <div className='col-6'>
                           <p className='name_element'>Offset Bits</p>
                        </div>
                        <div className='col-6 inputtext'>
                           <input id='offset_bits' type="text" className="form-control" placeholder="bits" defaultValue="2" />
                        </div>
                     </div>
                     <div className='row aline__button'>
                        <div className='col-6'>
                           <button type="button" className="btn btn-primary" onClick={() => {
                              window.location.reload();
                           }}>Reset</button>
                        </div>
                        <div className='col-6'>
                           <button id='submit_part1' type="button" className="btn btn-primary" onClick={() => {
                              this.configSubmit1();
                           }}>Submit</button>
                        </div>
                     </div>
                     <hr />
                  </div>

                  <div className='instruction'>
                     <h3 className='instruction__title'>Instruction</h3>
                     <div className='row'>
                        <div className='col-6 instruction__col6'>
                           <select className="form-select instruction__select" aria-label="Default select example" style={{ fontSize: "15px" }}>
                              <option value={1}>Load</option>
                              <option value={2}>Store</option>
                           </select>
                        </div>
                        <div className='col-6'>
                           <div className='col-6 instruction__inputtext inputtext'>
                              <input id='instruction__input' type="text" className="form-control" />
                           </div>
                        </div>
                     </div>
                     <div className='instruction__inputtext inputtext mt-2'>
                        <input id='instruction__data' type="text" className="form-control" placeholder="List of next 10 Instructions" />
                     </div>
                     <div className='row aline__button mt-2'>
                        <div className='col-6'>
                           <button id='random_Button' type="button" className="btn btn-primary" onClick={this.randomData}>Gen. Random</button>
                        </div>
                        <div className='col-6'>
                           <button id='submit_part2' type="button" className="btn btn-primary" onClick={() => {
                              this.configSubmit2();
                           }} >Submit</button>
                        </div>
                     </div>
                     <hr />
                  </div>
                  <div className='information'>
                     <h3 className='instruction__title'>Information</h3>
                     <div id="information_text" className="col-sm-12 col-md-12 information_text">
                        Please Configure Cache Settings.
                     </div>
                     <div className='row aline__button mt-2'>
                        <div className='col-6'>
                           <button id='next_button' type="button" className="btn btn-primary" onClick={() => {
                              this.configNext();
                           }}>Next</button>
                        </div>
                        <div className='col-6'>
                           <button id='fast_button' type="button" className="btn btn-primary" onClick={() => {
                              this.configForward();
                           }}>Fast Forward</button>
                        </div>
                     </div>
                     <hr />
                  </div>
                  <div className='statistics'>
                     <div>
                        <b> Statistics </b> <br />
                        <label className="col-xs-12 col-sm-6 ">Hit Rate  &nbsp; &nbsp;: </label>
                        <label className="col-xs-12 col-sm-6" id="hitRateLabel">&nbsp;</label>
                        <label className="col-xs-6 col-sm-6"> Miss Rate : </label>
                        <label className="col-xs-6 col-sm-6" id="missRateLabel">&nbsp;</label>
                        <b>	List of Previous Instructions :</b>
                        <label className="col-xs-12 col-sm-12 " id="listOfInstructionsLabel">
                           <ul id='Status_Miss_hit'></ul>
                        </label>
                     </div>

                  </div>
               </div>
               <div className='col-9 maxcol'>
                  <div className='header'>
                     <h3 style={{ textAlign: "center" }}><i class="fa fa-sliders-h"></i>
                        <font face="titleFont"> 2-WAY SET ASSOCIATIVE CACHE </font>
                     </h3>
                  </div>
                  <div className='row maxcol__caculator'>
                     <div className='col-5 instruction_breakdown'>
                        <h3 className='instruction_breakdown_title'>
                           <i class="fa fa-sign-in-alt"></i> Instruction Breakdown
                        </h3>
                        <table id="caption" className="caption table table-bordered border-primary">
                           <thead>
                              <tr id='caption__trhead' className='tr_of_thead'>
                                 <td id='caption__tag'>TAGBIT</td>
                                 <td id='caption__index'>INDEX</td>
                                 <td id='caption__ofsset'>OFFSET</td>
                              </tr>
                           </thead>
                           <tbody>
                              {this.lamRong()}
                           </tbody>
                        </table>
                     </div>
                     <div className='col-7 memory_block'>
                        <h3 className='memory_block_title'>
                           <i class="fa fa-th-large"></i> Memory Block
                        </h3>
                        <div id="memoryTable" class="memoryTable">
                           <table className='drawtable'>
                              <tbody>
                                 {this.render_memory_block()}
                              </tbody>
                           </table>
                        </div>
                     </div>
                     <div className='cache_table mt-3'>
                        <h3 className='cache_table_title'>
                           <i class="fa fa-table"></i> Cache Table
                        </h3>
                        <table class="drawtable table text-center" id="cachetable">
                           <thead>
                              <tr className='tr_of_thead'>
                                 <th className='text-center' style={{ width: '15%' }}> Index </th>
                                 <th className='text-center' style={{ width: '15%' }}> Valid </th>
                                 <th className='text-center' style={{ width: '15%' }}> Tag </th>
                                 <th className='text-center' style={{ width: '40%' }}> Data (Hex) </th>
                                 <th className='text-center' style={{ width: '15%' }}> Dirty Bit </th>
                              </tr>
                           </thead>
                           <tbody>
                              {this.render_cache_table()}
                           </tbody>

                        </table>
                     </div>
                  </div>
               </div>
            </div>
         </StyleTotal>
      )
   }
}
