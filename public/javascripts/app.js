function App(url){

    const socket = io.connect(url);

    socket.on('messages', function(message) {
        console.log("message:", message);
    });

    const sendMessage = function(message){
        console.log("new message:", nickname, message);
    }

    const checkNickname = function() {

        window.nickname = atob( $.cookie("echoblaster-nickname") || "" );
        if( nickname )
            return;

        const options = {
            keyboard: false,
            show: true
        };

        $('#echoblaster-nickname-modal').modal(options);
        $('#echoblaster-nickname-modal').on('hidden.bs.modal', function (e) {
            let _nickname = $(this).find("#nickname-name").val();
            if( _nickname )
                $.cookie("echoblaster-nickname", btoa(_nickname));
            checkNickname();
        });
    };

    checkNickname();

    document.getElementById("echoblaster-message-text").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13){
            let txt = $(this);
            sendMessage(txt.val());
            txt.val("");
        }
    });
}
