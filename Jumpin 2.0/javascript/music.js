'use strict';
(function(){
  const btn= document.querySelector('.mute-btn');

  btn.addEventListener('click',function mute(){
    if(background_audio.muted == false){
      background_audio.muted = true;
    } else {
      background_audio.muted = false;
    }

})

})()