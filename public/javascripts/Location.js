
let locations = document.querySelectorAll(".Long_spot");

let Content = 
`
<div class="ui labeled icon top right pointing dropdown button" id="Search-Cate-start">
      
<span id="T1" class="text">Search</span>
<div class="menu">
  <div class="ui search icon input">
    <i class="search icon"></i>
    <input type="text" name="search" placeholder="Search issues...">
  </div>
  <div class="divider"></div>
  <div class="header">
    <i class="caret right"></i>
    서울,경기권
  </div>
  <div class="item">
    
    서울
  </div>
  <div class="item">
   
    인천
  </div>
  <div class="item">
    
    수원
  </div>
  <div class="item">
    성남
  </div>
  <div class="divider"></div>
  <div class="header">
    <i class="calendar icon"></i>
    전라도
  </div>
  <div class="item">
    전주
  </div>
  <div class="divider"></div>
  <div class="header">
    충청도
  </div>
  <div class="item">
    대전
  </div>
  <div class="divider"></div>
  <div class="header">
    강원도
  </div>
  <div class="item">
    강릉
  </div>
  <div class="divider"></div>
  <div class="header">
    경상도
  </div>
</div>
</div>`

locations.forEach(element => {element.innerHTML =  Content; console.log("HOHO")})