var email = localStorage.getItem('careatorEmail');

$.ajax({
    url: "https://norecruits.com/chatHistory/getHistoryByEmailId/" + email,
    type: "GET",
    contentType: "application/json",
    dataType: "json",
    success: function (data) {
        console.log("data: " + JSON.stringify(data));
        console.log("data.data.length: " + data.data.length);

        // if (data.data.length > 0) {
        //     console.log("started into")
        //     var parentUL = document.getElementById('parentUl_listOfChat');
        //     var li = document.createElement("li");  
        //     li.className = "left clearfix";
        //     var span = document.createElement("span");  
        //     li.className = "chat-img pull-left";
        //     var img = document.createElement("img");  
        //     li.src = "https://lh6.googleusercontent.com/-y-MY2satK-E/AAAAAAAAAAI/AAAAAAAAAJU/ER_hFddBheQ/photo.jpg";
        //     li.className = "img-circle";
        //     span.appendChild(img);
        //     li.appendChild(span);
        //     parentUL.appendChild(li);
       
        // }
        //window.location.href = "https://norecruits.com/careator/" + id + "/" + date;
    },
    error: function (err) {
        console.log("err: " + JSON.stringify(err));
        console.log("err.responseText: " + JSON.stringify(err.responseText));
        console.log("err.responseJSON: " + JSON.stringify(err.responseJSON.message));
    }
});