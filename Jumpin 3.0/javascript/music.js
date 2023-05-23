'use strict';
(function(){
  const btn = document.querySelector('.mute-btn');
  let img = document.querySelector('.mute-btn > img')

  btn.addEventListener('click',function mute(){
    if(!background_audio.muted) {
      background_audio.muted = true;
      img.src = `../recources/172512_mute_icon.svg`;
    }else{
      background_audio.muted = false;
      img.src = `../recources/172479_high_volume_icon.svg`;
    }
})

})()