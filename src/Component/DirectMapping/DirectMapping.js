import React, { Component } from 'react'
import PAaddress_Direct from './PAaddress_Direct'
import MainMemoryLine from './MainMemoryLine'
import MainMemory from './MainMemory'
import CacheMemoryLine from './CacheMemoryLine'
import CacheMemory from './CacheMemory'
import styled from 'styled-components';
// import './DirectMapping.css'

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
    width: 70px;
}
.instruction_breakdown .caption .tr_of_tbody td {
    padding: 0;
}
.instruction_breakdown .caption thead {
    font-weight: 700;
}
.memoryTable {
    height: 300px;
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



export default class DirectMapping extends Component {

   state = {
      cache_size: 0,
      memory_size: 0,
      offset_bits: 0,
   }


   data_current;
   PA_address;

   mainMemory;
   cacheMemory;

   miss = 0;
   hit = 0;

   // Trạng thái các nút
   submit_part1 = 'chuanhan';
   submit_part2 = 'chuanhan';
   random_button = 'chuanhan';

   lamRong = () => {
      let cache_index = log2(this.state.cache_size / Math.pow(2, this.state.offset_bits));
      let _PAaddress = log2(this.state.memory_size);
      let Tag_bits = _PAaddress - cache_index - this.state.offset_bits;

      if (!isInteger(Tag_bits) || !isInteger(cache_index) || !isInteger(this.state.offset_bits)) {
         return <tr className='tr_of_tbody'>
            <td id="tagbit">&nbsp;</td>
            <td id="indexbit">&nbsp;</td>
            <td id="offsetbit">&nbsp;</td>
         </tr>
      }
      else {
         return <tr className='tr_of_tbody'>
            <td id="tagbit">{Tag_bits} bit</td>
            <td id="indexbit">{cache_index} bit</td>
            <td id="offsetbit">{this.state.offset_bits} bit</td>
         </tr>
      }
   }
   render_memory_block = () => {
      // let soDong = this.state.memory_size / Math.pow(2, this.state.offset_bits);
      // let soCot = Math.pow(2, this.state.offset_bits);

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
         arr1.push(<td id={'memory_block_row_number' + i}>{i}</td>);
         for (let j = 0; j < soCot; j++) {
            arr1.push(<td id={'memory_block_col' + j}>{this.mainMemory.Array[i].buffer[j]}</td>);
         }
         arr.push(<tr id={'memory_block_row' + i}> {arr1} </tr>);
      }

      return arr;
   }
   render_cache_table = () => {
      // let soDong = this.state.cache_size / Math.pow(2, this.state.offset_bits);

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
         arr.push(<tr id={Number(i).toString(2)}> {arr1} </tr>);

      }
      return arr;
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
   createMainMemory = () => {
      // Tạo main memory
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

            let hex = anychar.charCodeAt(0).toString(16).toUpperCase();
            buffer.push(`0x${hex}`);
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
      // let soCot = Math.pow(2, this.state.offset_bits);
      let array = []; // Mảng chứa các dòng
      for (let i = 0; i < soDong; i++) {
         let cacheMemoryLine = new CacheMemoryLine(i, 0, 0, '-', 0);
         array.push(cacheMemoryLine);
      }
      this.cacheMemory = new CacheMemory(soDong, array, 0);
      // console.log(this.cacheMemory);
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
      let cache_index = log2(Cache_size / Math.pow(2, Offset_bits));
      let PAaddress = log2(Memory_size);
      let Tag_bits = PAaddress - cache_index - Offset_bits;
      if (!isInteger(cache_index) || !isInteger(Tag_bits) || !isInteger(PAaddress)) {
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
      if (Number(Memory_size) > 4096) {
         alert('Memory size must be less than 4096');
         return;
      }

      let cache_index1 = log2(Cache_size / Math.pow(2, Offset_bits));
      let PAaddress1 = log2(Memory_size);
      let Tag_bits1 = PAaddress1 - cache_index1 - Offset_bits;

      // Disable các input
      this.submit_part1 = 'danhan';
      getID('submit_part1').disabled = true;
      getID('cache_size').readOnly = true;
      getID('memory_size').readOnly = true;
      getID('offset_bits').readOnly = true;

      this.setState({
         cache_size: Cache_size,
         memory_size: Memory_size,
         offset_bits: Offset_bits,
      })

      getID('information_text').innerHTML = `
  Offset = ${Offset_bits} bits<br />
        Index bits = log<sub>2</sub>(${Cache_size}/${Math.pow(2, Offset_bits)}) = ${cache_index1} bits<br />
        Physical Address = log<sub>2</sub>(${Memory_size}) = ${PAaddress1} bits<br />
        Tag = ${PAaddress1} bits - ${cache_index1} bits - ${Offset_bits} bits = ${Tag_bits1} bits<br />
        Block = ${Tag_bits1} bits + ${cache_index1} bits = ${Tag_bits1 + cache_index1} bits<br /><br /> Please submit Instruction.
  `
   }
   configSubmit2 = (Tag_bits, cache_index) => {
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

      // Khởi tạo đối tượng PA_address với các thuộc tính tương ứng
      let _PAaddress = log2(this.state.memory_size);
      // Nếu độ dài không bằng thì thêm các số 0 vào trước binary cho đến khi bằng độ dài _PAaddress
      if (binary.length < _PAaddress) {
         let temp = '';
         for (let i = 0; i < _PAaddress - binary.length; i++) {
            temp += '0';
         }
         binary = temp + binary;
      }


      this.PA_address = new PAaddress_Direct(binary.slice(0, Tag_bits), binary.slice(Tag_bits, Tag_bits + cache_index), binary.slice(Tag_bits + cache_index, binary.length));


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

   render() {
      let cache_index = log2(this.state.cache_size / Math.pow(2, this.state.offset_bits));
      let PAaddress = log2(this.state.memory_size);
      let Tag_bits = PAaddress - cache_index - this.state.offset_bits;
      let soLanNext = 0;
      let Miss_or_Hit = true;


      this.createMainMemory();
      this.createCacheMemory();

      return (
         <StyleTotal className='container-fluid'>
            <div className='row maincontent container-fluid'>
               <div className='col-3 mincol'>
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
                              this.configSubmit2(Tag_bits, cache_index);
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
                              if (this.submit_part2 === 'chuanhan') {
                                 alert('Please submit Instruction.');
                                 return;
                              }

                              // Lấy dòng trùng với cache index đang chọn trên giao diện
                              let data_ = this.PA_address.index;
                              data_ = Number(data_).toString(10).toString(2);
                              let current_row = getID(data_);

                              // Đánh dấu dòng nào đang chọn trong bộ nhớ cache_
                              let decimal = Number(parseInt(data_, 2));
                              this.cacheMemory.currentIndex = decimal;

                              // 4 cột trong cache table
                              let valid = current_row.querySelector('#Valid');
                              let tag = current_row.querySelector('#Tag');
                              let index = current_row.querySelector('#Index');
                              let data = current_row.querySelector('#Data');
                              let dirty = current_row.querySelector('#Dirty');


                              if (soLanNext === 0) {
                                 // Set màu cho bảng nhỏ
                                 getID('caption__index').style.backgroundColor = '#ff5c8dc7';
                                 getID('caption__tag').style.backgroundColor = 'transparent';
                                 getID('caption__ofsset').style.backgroundColor = 'transparent';

                                 // Set màu cho bảng lớn
                                 index.style.backgroundColor = '#ff5c8dc7';
                                 valid.style.backgroundColor = '#ff5c8dc7';
                                 tag.style.backgroundColor = '#ff5c8dc7';
                                 data.style.backgroundColor = '#ff5c8dc7';
                                 dirty.style.backgroundColor = '#ff5c8dc7';



                                 // Information
                                 getID('information_text').innerHTML = 'Index requested will be searched in cache as highlighted in pink';
                                 getID('information_text').style.backgroundColor = '#ff5c8dc7';

                                 soLanNext++;
                                 return;
                              }

                              if (soLanNext === 1) {
                                 valid.style.backgroundColor = '#29b5f6a8';

                                 // Nếu như chưa có dữ liệu trong dòng cache
                                 if (this.cacheMemory.Array[this.cacheMemory.currentIndex].valid === 0) {
                                    valid.classList.add('current_row_close');
                                    // Information
                                    getID('information_text').innerHTML = 'This line contains no data';
                                 } else {
                                    valid.classList.add('current_row_tick');
                                    // Information
                                    getID('information_text').innerHTML = 'This line already contains data';
                                 }

                                 // Information
                                 getID('information_text').style.backgroundColor = '#29b5f6a8';

                                 soLanNext++;
                                 return;
                              }
                              if (soLanNext === 2) {
                                 tag.style.backgroundColor = '#29b5f6a8';
                                 getID('caption__tag').style.backgroundColor = '#29b5f6a8';

                                 // Nếu như có dữ liệu rồi thì so sánh tagbit
                                 if (this.cacheMemory.Array[this.cacheMemory.currentIndex].tagbit !== getID('caption__tag').innerHTML) {
                                    tag.classList.add('current_row_close');
                                    // Information
                                    getID('information_text').innerHTML = 'This line does not match the tag';
                                 } else {
                                    tag.classList.add('current_row_tick');
                                    // Information
                                    getID('information_text').innerHTML = 'This line match the tag';
                                 }

                                 soLanNext++;
                                 return;
                              }
                              if (soLanNext === 3) {
                                 // cache_
                                 Miss_or_Hit = this.cacheMemory.missOrHit(getID('caption__tag').innerHTML);
                                 if (!Miss_or_Hit) {
                                    index.classList.add('Miss_After');
                                    // Information
                                    getID('information_text').innerHTML = 'Valid bit is 0 or tag does not match. This is a cache miss';
                                 } else {
                                    index.classList.add('Hit_After');
                                    // Information
                                    getID('information_text').innerHTML = 'Valid bit is 1 and tag matches. This is a cache hit';
                                 }
                                 soLanNext++;
                                 return;
                              }
                              if (soLanNext === 4) {
                                 // Đổi màu xanh cho 3 cột còn lại
                                 index.style.backgroundColor = '#29b5f6a8';
                                 data.style.backgroundColor = '#29b5f6a8';
                                 dirty.style.backgroundColor = '#29b5f6a8';

                                 getID('caption__index').style.backgroundColor = 'transparent';

                                 // Cho dấu màu đỏ/xanh biến mất
                                 valid.classList.remove('current_row_close');
                                 valid.classList.remove('current_row_tick');

                                 tag.classList.remove('current_row_close');
                                 tag.classList.remove('current_row_tick');

                                 index.classList.remove('Miss_After');
                                 index.classList.remove('Hit_After');

                                 // Chuỗi nhị phân của dòng đang chọn
                                 let binary_string = getID('caption__tag').innerHTML + getID('caption__index').innerHTML;
                                 let decimo_string = parseInt(binary_string, 2);

                                 // Lấy dữ liệu trong bộ nhớ chính ra
                                 let buffer = this.mainMemory.Array.find(item => item.index === decimo_string).buffer;
                                 let datacurrent = '';
                                 for (var item of buffer) {
                                    // Lấy ký tự cuối cùng của item công vạo data
                                    datacurrent += item + ', ';
                                 }
                                 datacurrent = datacurrent.slice(0, datacurrent.length - 2);

                                 // Set cho cachememory
                                 this.cacheMemory.Array[this.cacheMemory.currentIndex].valid = 1;
                                 this.cacheMemory.Array[this.cacheMemory.currentIndex].tagbit = getID('caption__tag').innerHTML;
                                 this.cacheMemory.Array[this.cacheMemory.currentIndex].buffer = datacurrent;

                                 // Set cho giao diện
                                 tag.innerHTML = this.cacheMemory.Array[this.cacheMemory.currentIndex].tagbit;
                                 valid.innerHTML = this.cacheMemory.Array[this.cacheMemory.currentIndex].valid;
                                 data.innerHTML = datacurrent;

                                 setTimeout(() => {
                                    getID(`memory_block_row${decimo_string}`).scrollIntoView();
                                 }, 2);
                                 getID(`memory_block_row${decimo_string}`).style.backgroundColor = '#29b5f6a8';


                                 if (!Miss_or_Hit) {
                                    // Information
                                    let socot = Math.pow(2, this.state.offset_bits) - 1;
                                    getID('information_text').innerHTML = `Cache table is updated accordingly. Block ${decimo_string} with offset 0 to ${socot} is transferred to cache`;
                                    getID('information_text').style.backgroundColor = '#29b5f6a8';
                                 }


                                 soLanNext++;
                                 return;
                              }
                              if (soLanNext === 5) {

                                 getID('caption__tag').style.backgroundColor = 'transparent';

                                 // Chuỗi nhị phân của dòng đang chọn
                                 let binary_string = getID('caption__tag').innerHTML + getID('caption__index').innerHTML;
                                 let decimo_string = parseInt(binary_string, 2);

                                 // Xét lại màu cho các phần
                                 getID(`memory_block_row${decimo_string}`).style.backgroundColor = 'transparent';
                                 getID('information_text').style.backgroundColor = 'transparent';
                                 index.style.backgroundColor = 'transparent';
                                 valid.style.backgroundColor = 'transparent';
                                 tag.style.backgroundColor = 'transparent';
                                 data.style.backgroundColor = 'transparent';
                                 dirty.style.backgroundColor = 'transparent';

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

                                 soLanNext = 0;

                                 // Tính toán tỷ lệ miss hit
                                 if (Miss_or_Hit === false) {
                                    this.miss++;
                                 } else {
                                    this.hit++;
                                 }

                                 let miss_rate = this.miss / (this.miss + this.hit) * 100;

                                 getID('missRateLabel').innerHTML = Math.round(miss_rate) + '%';
                                 getID('hitRateLabel').innerHTML = (100 - Math.round(miss_rate)) + '%';

                                 let x;
                                 if (Miss_or_Hit === false) {
                                    x = 'Miss';
                                 } else {
                                    x = 'Hit';
                                 }

                                 getID('Status_Miss_hit').innerHTML += `
                      <li>
                      Load ${previous_input.toString().toUpperCase()} [${x}]
                      </li>
                      `;

                                 // Tô màu tỷ lệ miss/hit
                                 let color = document.getElementsByClassName('statistics')[0];
                                 color.style.backgroundColor = '#FDD835';

                                 // Information
                                 getID('information_text').innerHTML = 'The cycle has been completed.Please submit another instructions';

                                 Miss_or_Hit = true;
                                 return;
                              }

                           }}>Next</button>
                        </div>
                        <div className='col-6'>
                           <button id='fast_button' type="button" className="btn btn-primary" onClick={() => {
                              if (this.submit_part2 === 'chuanhan') {
                                 alert('Please submit Instruction.');
                                 return;
                              }
                              // Lấy dòng trùng với cache index đang chọn trên giao diện
                              let data_ = this.PA_address.index;
                              data_ = Number(data_).toString(10).toString(2);
                              let current_row = getID(data_);

                              // Đánh dấu dòng nào đang chọn trong bộ nhớ cache_
                              let decimal = Number(parseInt(data_, 2));
                              this.cacheMemory.currentIndex = decimal;

                              Miss_or_Hit = this.cacheMemory.missOrHit(getID('caption__tag').innerHTML);
                              console.log(getID('caption__tag').innerHTML);
                              console.log(this.cacheMemory.Array);

                              // 4 cột trong cache table
                              let valid = current_row.querySelector('#Valid');
                              let tag = current_row.querySelector('#Tag');
                              let index = current_row.querySelector('#Index');
                              let data = current_row.querySelector('#Data');
                              let dirty = current_row.querySelector('#Dirty');

                              // Chuỗi nhị phân của dòng đang chọn
                              let binary_string = getID('caption__tag').innerHTML + getID('caption__index').innerHTML;
                              let decimo_string = parseInt(binary_string, 2);

                              setTimeout(() => {
                                 getID(`memory_block_row${decimo_string}`).scrollIntoView();
                              }, 2);

                              // Lấy dữ liệu trong bộ nhớ chính ra
                              let buffer = this.mainMemory.Array.find(item => item.index === decimo_string).buffer;
                              let datacurrent = '';
                              for (var item of buffer) {
                                 // Lấy ký tự cuối cùng của item công vạo data
                                 datacurrent += item + ', ';
                              }
                              datacurrent = datacurrent.slice(0, datacurrent.length - 2);
                              // Set cho cachememory
                              this.cacheMemory.Array[this.cacheMemory.currentIndex].valid = 1;
                              this.cacheMemory.Array[this.cacheMemory.currentIndex].tagbit = getID('caption__tag').innerHTML;
                              this.cacheMemory.Array[this.cacheMemory.currentIndex].buffer = datacurrent;

                              // Set cho giao diện
                              tag.innerHTML = this.cacheMemory.Array[this.cacheMemory.currentIndex].tagbit;
                              valid.innerHTML = this.cacheMemory.Array[this.cacheMemory.currentIndex].valid;
                              data.innerHTML = datacurrent;


                              getID('caption__tag').style.backgroundColor = 'transparent';
                              getID('caption__index').style.backgroundColor = 'transparent';
                              getID('caption__ofsset').style.backgroundColor = 'transparent';

                              index.style.backgroundColor = 'transparent';
                              valid.style.backgroundColor = 'transparent';
                              tag.style.backgroundColor = 'transparent';
                              data.style.backgroundColor = 'transparent';
                              dirty.style.backgroundColor = 'transparent';

                              // Cho dấu màu đỏ/xanh biến mất
                              valid.classList.remove('current_row_close');
                              valid.classList.remove('current_row_tick');

                              tag.classList.remove('current_row_close');
                              tag.classList.remove('current_row_tick');

                              index.classList.remove('Miss_After');
                              index.classList.remove('Hit_After');

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

                              soLanNext = 0;

                              // Tính toán tỷ lệ miss hit
                              if (Miss_or_Hit === false) {
                                 this.miss++;
                              } else {
                                 this.hit++;
                              }

                              let miss_rate = this.miss / (this.miss + this.hit) * 100;

                              getID('missRateLabel').innerHTML = Math.round(miss_rate) + '%';
                              getID('hitRateLabel').innerHTML = (100 - Math.round(miss_rate)) + '%';

                              let x;
                              if (!Miss_or_Hit) {
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

                              Miss_or_Hit = true;
                              return;
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
                        <font face="titleFont"> DIRECT MAPPED CACHE </font>
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
                                 <td id='caption__tag'>TAG</td>
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