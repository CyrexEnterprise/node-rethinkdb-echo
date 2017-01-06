function App (url) {
  'use strict';
  var socket = io.connect(url);

  socket.on('messages', function (message) {
    var messages = typeof message === 'object' && message instanceof Array ? message : [message];

    for (var i = (messages.length - 1); i >- 1; i--) {
      if (!messages[i] || !messages[i].Author || !messages[i].Text) {
        continue;
      }

      var li = document.createElement('li'); li.className = 'list-group-item';
      var spanNickname = document.createElement('span'); spanNickname.className = 'nickname'; spanNickname.innerText = (messages[i].Author || '') + ': ';
      var spanMessage = document.createElement('span'); spanMessage.className = 'message'; spanMessage.innerText = (messages[i].Text || '');
      li.appendChild(spanNickname);
      li.appendChild(spanMessage);

      var messagesElement = document.getElementById('messages');
      messagesElement.appendChild(li);

      var bodyElement = document.getElementsByTagName('body');
      if (bodyElement.length) {
        bodyElement[0].scrollTop = bodyElement[0].scrollHeight;
      }
    }
  });

  var sendMessage = function (message) {
    var obj = { Author: nickname, Room: 'public', Text: message };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState === XMLHttpRequest.DONE) {
        if (xhttp.status !== 200) {
          console.error(xhttp.status, xhttp.responseText);
        }
      }
    };

    xhttp.open('POST', '/api/v1/messages/', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(obj));
  }

  var checkNickname = function() {

    window.nickname = atob($.cookie('echoblaster-nickname') || '');
    if (nickname) {
      return;
    }

    var options = {
      keyboard: false,
      show: true
    };

    function enterName(e) {
      if (e.which && e.which !== 13) {
        return;
      }

      var _nickname = $(this).find('#nickname-name').val();
      if (_nickname) {
        $.cookie('echoblaster-nickname', btoa(_nickname));
      }
      checkNickname();
    }

    $('#echoblaster-nickname-modal').modal(options);
    $('#echoblaster-nickname-modal').on('hide.bs.modal', enterName);
    $('#nickname-form').on('keypress', enterName);
  };

  checkNickname();

  document.getElementById('echoblaster-message-text').addEventListener('keyup', function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
      var txt = $(this);
      sendMessage(txt.val());
      txt.val('');
    }
  });
  document.getElementById('echoblaster-message-send').addEventListener('click', function (event) {
    event.preventDefault();
    var txt = $('#echoblaster-message-text');
    sendMessage(txt.val());
    txt.val('');
  });
}
