function App(url){
    "use strict"
    var socket = io.connect(url);

    socket.on('messages', function(message) {

        let messages = typeof(message) == "object" && message instanceof Array ? message : [message];

        for ( var i = messages.length-1; i >- 1; i-- ) {

            if( !messages[i] || !messages[i].Author || !messages[i].Text )
                continue;

            var li = document.createElement("li"); li.className = "list-group-item";
            var spanNickname = document.createElement("span"); spanNickname.className = "nickname"; spanNickname.innerText = (messages[i].Author || "") + ": ";
            var spanMessage = document.createElement("span"); spanMessage.className = "message"; spanMessage.innerText = (messages[i].Text || "");
            li.appendChild(spanNickname);
            li.appendChild(spanMessage);

            $("#messages").append(li);
            $("html, body").animate({ scrollTop: $(document).height() }, 0);
        }
    });

    var sendMessage = function(message){
        $.post( "/api/v1/messages/", { Author: nickname, Room: "public", Text: message })
         .done(function( data ) {
         })
         .fail(function( data ) {
             console.error(data.responseText);
         })
         .always(function(data) {
         });
    }

    var checkNickname = function() {

        window.nickname = atob( $.cookie("echoblaster-nickname") || "" );
        if( nickname )
            return;

        var options = {
            keyboard: false,
            show: true
        };

        $('#echoblaster-nickname-modal').modal(options);
        $('#echoblaster-nickname-modal').on('hidden.bs.modal', function (e) {
            var _nickname = $(this).find("#nickname-name").val();
            if( _nickname )
                $.cookie("echoblaster-nickname", btoa(_nickname));
            checkNickname();
        });
    };

    checkNickname();

    var postMessage = function(event) {
        event.preventDefault();
        if (event.keyCode == 13){
            var txt = $(this);
            sendMessage(txt.val());
            txt.val("");
        }
    }

    document.getElementById("echoblaster-message-text").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13){
            var txt = $(this);
            sendMessage(txt.val());
            txt.val("");
        }
    });
    document.getElementById("echoblaster-message-send").addEventListener("click", function(event) {
        event.preventDefault();
        var txt = $("#echoblaster-message-text");
        sendMessage(txt.val());
        txt.val("");
    });
}
