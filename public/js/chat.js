//var MAX_UPLOAD_SIZE = 0.5; // in MB
var MAX_UPLOAD_SIZE = 0.09; // in MB
// var socket = io();
var count = 0;
var imageReader = new FileReader();
var videoReader = new FileReader();
var fileReader = new FileReader();
// var userName;

// 
//#####  Start Auto Link Js #####//
(function () {
    var autoLink,
        slice = [].slice;

    autoLink = function () {
        var callback, k, linkAttributes, option, options, pattern, v;
        options = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        pattern = /(^|[\s\n]|<[A-Za-z]*\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;
        if (!(options.length > 0)) {
            return this.replace(pattern, "$1<a href='$2'>$2</a>");
        }
        option = options[0];
        callback = option["callback"];
        linkAttributes = ((function () {
            var results;
            results = [];
            for (k in option) {
                v = option[k];
                if (k !== 'callback') {
                    results.push(" " + k + "='" + v + "'");
                }
            }
            return results;
        })()).join('');
        return this.replace(pattern, function (match, space, url) {
            var link;
            link = (typeof callback === "function" ? callback(url) : void 0) || ("<a href='" + url + "'" + linkAttributes + ">" + url + "</a>");
            return "" + space + link;
        });
    };

    String.prototype['autoLink'] = autoLink;

}).call(this);


function autoLinkNeed() {
    console.log("autoLinkNeed-->");

    var new_window = $('#message-container div.new_windowAutoLink:last')
    console.log("new_window.html()-->:" + new_window.html());
    $(new_window).html(
        new_window.html().autoLink({ target: "_blank" })
    );

    console.log("<--autoLinkNeed");
}

//#####  End Auto Link Js #####//

$('#fileselect').change(function (e) {

    console.log("FIle Select -->");
    file = e.target.files[0];
    console.log("file: " + file);
    console.log("file.type: " + file.type);


    console.log("<--FIle Select");
});
var date;
var time;
function DisplayCurrentTime() {
    console.log("DisplayCurrentTime-->");

    date = new Date();
    console.log("date: " + date);
    var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    var am_pm = date.getHours() >= 12 ? "PM" : "AM";
    hours = hours < 10 ? "0" + hours : hours;
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
    console.log("time: " + time);

    return time;

    console.log("<--DisplayCurrentTime");
};
if (localStorage.getItem("userData")) {
    // var userData = localStorage.getItem("userData");
    // console.log("localStorage.getItem(userData).status: "+localStorage.getItem("userData").status);
    // console.log("localStorage.getItem(userData).stringify: "+JSON.stringify(localStorage.getItem("userData")));
    // console.log("userData: "+userData);
    // console.log("userData.status: "+userData.status);
    // console.log("userData.userName: "+userData.userName);
    // console.log("userData.strigify: "+JSON.stringify(userData));
    // userName = userData.userName;
    console.log("userName-->: " + userName);
}
else {
    console.log("NOOOOOOOOOOOOO Session data");
}
function sendMessage() {
    console.log("sendMsg-->");
    var msg = document.getElementById('message').value;
    // var file = e.target.files[0];
    if (userName != null) {
        if (msg != null) {
            console.log("msg: " + msg);
            if (msg) {
                console.log("Start to emit message  ");
                console.log("peerNew_id: " + peerNew_id);
                signaling_socket.emit('textMsg', { 'message': msg, 'userId': peerNew_id, 'queryLink': queryLink, 'timeLink': timeLink, 'userName': userName, "email": localStorage.getItem('careatorEmail'), "urlDate":urlDate });
                document.getElementById('message').value = "";
            }
        }
        else {
            console.log("You Didn't type any message")
        }
        if (file) {
            console.log("file.type.substring(0,5): " + file.type.substring(0, 5));
            console.log("file.type.substring(0,4): " + file.type.substring(0, 4));
            // if (file.type.substring(0, 5) === 'image' || file.type.substring(0, 5) === 'video' || file.type.substring(0, 4) === 'docx') {
            console.log("file.size: " + file.size);
            console.log("MAX_UPLOAD_SIZE * 1000: " + MAX_UPLOAD_SIZE * 1000);
            console.log("MAX_UPLOAD_SIZE: " + MAX_UPLOAD_SIZE + "MAX_UPLOAD_SIZE * 1000 * 1000: " + MAX_UPLOAD_SIZE * 1000 * 1000);
            /* &&&& MAX_UPLOAD_SIZE was in a if condition is-->MAX_UPLOAD_SIZE * 1000 * 1000, i have changed for test purpose as--> MAX_UPLOAD_SIZE * 1000 &&&& */
            if (file.size > MAX_UPLOAD_SIZE * 1000*1000) {
                alert('Sorry, we can only accept files up to ' + MAX_UPLOAD_SIZE + ' MB');
            }
            else if (file.type.substring(0, 5) === 'image') {
                console.log("Image");
                // upload image  
                imageReader.readAsDataURL(file);
            }
            else if (file.type.substring(0, 5) === 'video') {

                console.log("Video");
                // uplaod video  
                videoReader.readAsDataURL(file);
            }
            else {
                console.log("other from sendMessage");
                fileReader.readAsDataURL(file);
            }
            // }
            // else {
            //     alert("Sorry, you an only share images or videos or html Files");
            // }
            // reset select box and file object 
            $('#fileselect').val('');
            file = '';
        }
        else {
            console.log("You haven't selected any file to share");
        }
    }
    else {
        console.log("You haven't set name");
       // $('#setName').trigger('click');
    }
    console.log("<--Upload");
    console.log("<--sendMsg");
    return false; // don't reload the page
}

signaling_socket.on('newTextMsg', function (data) {

    console.log("newTextMsg-->");
    console.log("data.message: " + data.message);
    console.log("data.userId: " + data.userId);
    console.log("data.queryId: " + data.queryId);

    console.log("queryLink: " + queryLink);
    if (data.queryId == queryLink) {

        /* ##### Start Calling Get Time  ##### */
        var time = DisplayCurrentTime();
        /* ##### End Calling Get Time  ##### */

        document.getElementById('message-container').innerHTML += '<div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">'
            + data.userName + '</span></div><i class="direct-chat-img" aria-hidden="true"></i><!-- /.direct-chat-img --><div class="content direct-chat-text new_windowAutoLink">' + data.message + '</div><div class="direct-chat-info clearfix"><span class="direct-chat-timestamp pull-right">' + time + '</span></div>'
        autoLinkNeed();
        scrollDown();
        var chatOpen = $("#qnimate").hasClass("popup-box-on");
        if (chatOpen) {
            document.getElementById('chatNotification').style.display = 'none';
        }
        else {
            count = count + 1;
            document.getElementById('chatNotification').style.display = 'inline';
            document.getElementById('chatNotification').innerHTML = '(' + count + ')';
            var x = document.getElementById("myAudio");
            x.play();
        }
    }
    else {
        console.log("newTextMsg: Sorry");
    }
    console.log("<--newTextMsg");
})

function playAudioForNotify() {
    console.log("playAudioForNotify-->");
    var snd = new Audio("./home/img/alrt.mp3"); // buffers automatically when created
    snd.play();
    console.log("<--playAudioForNotify");
}

/* #### Start File Sharing  ##### */

// Appends either an image or a video file to user's  window
function appendFile(URI, type, name, queryId) {
    console.log("appendFile-->");
    console.log("URI: " + URI);
    console.log("type: " + type);
    // console.log("user: "+user);

    if (queryId == queryLink) {
        if (type === 'image') {
            console.log("image");
            document.getElementById('message-container').innerHTML += '<div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">'
                + name + '</span></div><img alt="iamgurdeeposahan" src="http://bootsnipp.com/img/avatars/bcf1c0d13e5500875fdd5a7e8ad9752ee16e7462.jpg" class="direct-chat-img"><!-- /.direct-chat-img --><div class="direct-chat-text"><img src="' + URI + '" height="100px" /></div><div class="direct-chat-info clearfix"><span id=' + URI + ' class="direct-chat-timestamp pull-right"></span></div>'

            /* ##### Start Calling Get Time  ##### */
            DisplayCurrentTime(URI);
            /* ##### End Calling Get Time  ##### */
            scrollDown();
        }
        else if (type === 'video') {
            console.log("video-->");

            document.getElementById('message-container').innerHTML += '<div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">'
                + name + '</span></div><img alt="iamgurdeeposahan" src="http://bootsnipp.com/img/avatars/bcf1c0d13e5500875fdd5a7e8ad9752ee16e7462.jpg" class="direct-chat-img"><!-- /.direct-chat-img --><div class="direct-chat-text"><video width="320" height="240" controls><source src="' + URI + '"></div><div class="direct-chat-info clearfix"><span  id=' + URI + ' class="direct-chat-timestamp pull-right"></span></div>'

            /* ##### Start Calling Get Time  ##### */
            DisplayCurrentTime(URI);
            /* ##### End Calling Get Time  ##### */
            scrollDown();
        }
        else {
            console.log("Other");
            //             var save = document.createElement('a');
            // save.href = URI;
            // save.target = '_blank';
            // save.download = name || URI;
            // save.innerHTML="download"

            // var event = document.createEvent('Event');
            // event.initEvent('click', true, true);

            // save.dispatchEvent(event);
            // (window.URL || window.webkitURL).revokeObjectURL(save.href);
            document.getElementById('message-container').innerHTML += '<div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">'
                + name + '</span></div> <img alt="iamgurdeeposahan" src="http://bootsnipp.com/img/avatars/bcf1c0d13e5500875fdd5a7e8ad9752ee16e7462.jpg" class="direct-chat-img"><!-- /.direct-chat-img --><div class="direct-chat-text"><a width="320" height="240" href=' + URI + ' target="_blank" download=' + URI + '><source src="' + URI + '">Download Here</a></div><div class="direct-chat-info clearfix"><span  id=' + URI + ' class="direct-chat-timestamp pull-right"></span></div>'

            /* ##### Start Calling Get Time  ##### */
            DisplayCurrentTime(URI);
            /* ##### End Calling Get Time  ##### */
            scrollDown();
        }


    }


    console.log("<--appendFile");
}
imageReader.onload = function (e) {
    console.log("imageReader.onload-->");
    scrollDown();
    var targetResult = e.target.result;

    // share image
    // TODO try stream?
    signaling_socket.emit('file', { 'userId': peerNew_id, 'queryLink': queryLink, 'timeLink': timeLink, 'userName': userName, 'dataURI': targetResult, 'type': 'image' });
    console.log("<--imageReader.onload");
};

videoReader.onload = function (e) {
    console.log("videoReader.onload-->");
    var targetResult = e.target.result;

    scrollDown();
    // 
    // share video
    signaling_socket.emit('file', { 'userId': peerNew_id, 'queryLink': queryLink, 'timeLink': timeLink, 'userName': userName, 'dataURI': targetResult, 'type': 'video' });
    console.log("<--videoReader.onload");
};
fileReader.onload = function (e) {
    console.log("fileReader.onload-->");

    scrollDown();
    var targetResult = e.target.result;

    // share image
    // TODO try stream?
    signaling_socket.emit('file', { 'userId': peerNew_id, 'queryLink': queryLink, 'timeLink': timeLink, 'userName': userName, 'dataURI': targetResult, 'type': 'doc' });
    console.log("<--fileReader.onload");
};

signaling_socket.on('file', function (data) {
    console.log("File Request from Server-->");
    console.log("data.queryLink: " + data.queryLink);
    console.log("queryLink: " + queryLink);
    if (data.queryId == queryLink) {
        appendFile(data.dataURI, data.type, data.userName, data.queryId);
        scrollDown();
    }
    else {
        console.log("Sorry query id is not equall with queryLink");
    }

    console.log("<--File Request from Server");
    // appendFile(dataURI, type, from);


});

/* #### End File Sharing  ##### */
$(function () {
    $("#addChatWindow ").click(function () {
        console.log("addChatWindow-->");
        $('#qnimate').addClass('popup-box-on');
        document.getElementById('chatNotification').style.display = 'none';
        count = 0;
    });

    $("#removeClass ").click(function () {
        console.log("removeClass-->");
        $('#qnimate').removeClass('popup-box-on');
    });
})



