const locname = "퐝역"
const locimage = "https://railwaynomad.com/wp-content/uploads/2015/04/Pohong_station03.jpg"

document.querySelector("div.loc_and_image span").innerHTML=locname
document.querySelector("div.loc_and_image img").src=locimage

function createitem(name, img, way, startloc, destination, message, usernum, maxnum) {
    document.querySelector("div.user_item_layout span.nametext").innerHTML=name
    document.querySelector("div.user_item_layout img.profile").src=img
    document.querySelector("div.user_item_layout div.svgico img").src="../public/images/"+way+".svg"
    document.querySelector("div.user_item_layout span.loctext").innerHTML=startloc + " ➔ " + destination
    document.querySelector("div.user_item_layout span.message").innerHTML=message
    document.querySelector("div.user_item_layout  span.peoplenum").innerHTML="("+usernum+"/"+maxnum+")"

    if (!img) {
        document.querySelector("div.user_item_layout img.profile").src="../public/images/profile_null.png"
    }

    const layout = document.getElementsByClassName("user_item_layout");
    const userlist = document.getElementsByClassName("screen");
    let newitem = document.createElement('div');
    newitem.className ="useritem"
    newitem.innerHTML = layout[0].innerHTML;
    userlist[0].append(newitem);
}

function chatButtonClick(){
    
}




function testclick(){
    const a = document.querySelector("input#test1")
    const b = document.querySelector("input#test2")
    const c = document.querySelector("input#test3")
    const d = document.querySelector("input#test4")
    const e = document.querySelector("input#test5")
    const f = document.querySelector("input#test6")
    const g = document.querySelector("input#test7")
    const h = document.querySelector("input#test8")
    createitem(a.value, b.value, c.value, d.value, e.value, f.value, g.value, h.value);
}