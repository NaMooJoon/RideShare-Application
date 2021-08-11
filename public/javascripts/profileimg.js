// var xhr = new XMLHttpRequest();
// xhr.open("GET", "파일경로");
// xhr.responseType = "blob";
// xhr.onload = response;
// xhr.send();

// function response(e) {
//    var urlCreator = window.URL || window.webkitURL;
//    var imageUrl = urlCreator.createObjectURL(this.response);
//    document.querySelector("#profile_image").src = imageUrl;
// }

function test(files) {
    var blob = files[0];
    const blobUrl = window.URL.createObjectURL(blob);
    document.querySelector("#profile_image").src = blobUrl;
    console.log("blob의 Url",blobUrl);
    window.URL.revokeObjectURL(blobUrl);
}