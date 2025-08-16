# music-player-bar
This is a lil widget you can add on your personal site -- a music player at the top of your page!

this project originated as me wanting to use the wikiplayer widget on my neocities site but it refused to play for whatever reason. So i decided to build my own! 

<b>DISCLAIMER:</b> unfortunately as I never learned officially how to code, and this is kinda a 'practice' project, I did use AI on few occasions for debugging (and sanity preservation) purposes. But I do try to handcode most parts of the project. If you are a strict no AI no matter what person, I apologise. And fyi, I am actively trying to learn js so I can use less and less AI in the future. 

# where can you use this? 
This was initially designed for neocities free version, but i reckon you can also use it on neocities supporters (duh), neko web, or other personal website host as long as you can edit the html, css, and js. 

# how to use
1. Download the script.js file and style.css, or copy paste the content into whatever script/css file you have.
2. add the below html code right below your `<body` tag on your index.html of the page you want to have the player
```
<div class="player" id="player"></div>
<audio id="audio" preload="metadata"></audio>
```
<img width="513" height="156" alt="Screenshot 2025-08-17 at 12 42 22 AM" src="https://github.com/user-attachments/assets/9b8c0d76-e668-40f4-b0dd-622834122109" />

like so 

3. Download playlist.json, and the mp3 files of whatever music you want to have in your player

<b>IMPORTANT:</b> Since we're not using any official embeds to play our music, make sure the music you have is royalty free and/or you have lisence to said music. 

4. from this point forward you can pretty much just follow the intructions provided in playlist.json to add music to your playlist, and you're good to go.

# making things pretty 
The playlist's default look is lilac. In case that's not your cup of tea, you can customize directly from style.css! 

but if you can't be bothered, I also have a few presets that may interest you 

#lisence
MIT License - Copyright (c) 2025 elsieee.


