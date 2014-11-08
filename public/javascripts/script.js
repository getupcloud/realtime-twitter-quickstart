$(function() {
  function add_tweet(t) {
    var li = $(
      '<li>'
     +  '<div class="image">'
     +      '<img src="' + t.profile_image_url + '">'
     +  '</div>'
     +  '<div class="tweet">'
     +      ' <div class="name">' + t.name + '</div>'
     +      ' <div class="screen_name"><a href="https://twitter.com/' + t.screen_name + '">@' + t.screen_name + '</a></div>'
     +      ' <div class="created_at">' + t.created_at + '</div>'
     +  '<div class="text">' + t.text + '</div>'
     +'</li>'
    );
    $('ul').prepend(li);
    $('#last-update').text(new Date().toTimeString()); 
  };

  //Referencia: http://www.html5rocks.com/pt/tutorials/websockets/basics/
  var ws = new WebSocket('ws://' + location.hostname + ':8000');

  ws.onopen = function () {
    console.log('Conectado no servidor');
  };

  ws.onerror = function (error) {
    console.error(error);
  };

  ws.onmessage = function (e) {
    console.log('Message:', e.data);
    var t = JSON.parse(e.data);
    add_tweet(t);
  };


  /*add_tweet({
    name: 'fsilva',
    screen_name: 'Fulano Silva',
    profile_image_url: 'http://pbs.twimg.com/profile_images/2934829341/ef41c867b555ababcdda0200513b2211_normal.jpeg',
    created_at: 'Fri Nov 07 14:06:46 +0000 2014',
    text: 'Algumas campanhas irão escalar suas estruturas na @GetupCloud neste #BlackFriday - você está preparado? #paas #escalabilidade #openshift'
  });*/
})
