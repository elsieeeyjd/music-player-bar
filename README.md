# lil music player bar thing

<img width="1264" height="53" alt="Screenshot 2025-08-17 at 1 57 15 AM" src="https://github.com/user-attachments/assets/3dcc09e1-32cf-41d5-a221-b23ccd420688" />


This is a lil widget you can add on your personal site -- a music player at the top of your page!

this project originated as me wanting to use the wikiplayer widget on my neocities site but it refused to play for whatever reason. So i decided to build my own! see this player in action @ <a href="https://elswhere.neocities.org/">elswhere.neocities.org</a>

<b>DISCLAIMER:</b> as I'm still a newbie at javascript, and this is kinda a 'practice' project, I did use AI on few occasions for debugging (and sanity preservation) purposes. But I do handcode most parts of the project. All logic/design of the player is mine, and I personally reviewed all AI inputs. And fyi, I am actively trying to learn js so I can use less and less AI in the future. 

<b>a note on music ownership/copyright:</b> don't use any copyrighted music on the player, especially since this player doesnt use offical embeds like youtube or spotify. No, a disclaimer doesn't make it better. There are plenty of good royalty free music out there (check the player on my site for example!). I just dont want anyone to have their site suspended cuz of this lol. 


# where can you use this? 
This was initially designed for neocities free version, but i reckon you can also use it on neocities supporters (duh), neko web, or other personal website host as long as you can edit the html, css, and js. 

# how to use
1. Download the script.js file and style.css, or copy paste the content into whatever script/css file you have.
2. add the below html code right below your `<body>` tag on your index.html of the page you want to have the player
```
<div class="player" id="player"></div>
<audio id="audio" preload="metadata"></audio>
```
<img width="513" height="156" alt="Screenshot 2025-08-17 at 12 42 22 AM" src="https://github.com/user-attachments/assets/9b8c0d76-e668-40f4-b0dd-622834122109" />

like so 

3. Download playlist.json, and the mp3 files of whatever music you want to have in your player

<b>IMPORTANT:</b> Since we're not using any official embeds to play our music, make sure the music you have is royalty free and/or you have lisence to said music. 

4. to add songs to your playlist, edit playlist.json and fill out the info to your song accordingly. Copy and paste the rows to add more songs (remember commas!)

to add songs to your playlist, just copy and paste the rows and fill out the info!

<b>NOTE:</b> Neocities free v.s. paid -- how to host audio files

If you have neocities supporter/if your web host allow you host mp3 (idk if nekoweb does but yeah), the "src" part can just be a direct path to said mp3 file. 
However, if you're using neocities free/if your web host doesn't allow you to host mp3 files, you can just link it from other file hosting services like github (what i'm using) or catbox.moe, and paste the url. 

# making things pretty 
The playlist's default look is lilac. In case that's not your cup of tea, you can customize directly from style.css! 

but if you can't be bothered, I also have a few presets that may interest you <a href = "the-playlist-stuff/cosmetics"> here </a>

<b>Greenery 🍀</b>
<img width="1266" height="55" alt="Screenshot 2025-08-17 at 2 01 23 AM" src="https://github.com/user-attachments/assets/d4fb1459-99b4-4f6a-9d8e-edaf018cdaa0" />


<b>Rosie 🌹</b>
<img width="1267" height="56" alt="Screenshot 2025-08-17 at 1 52 13 AM" src="https://github.com/user-attachments/assets/82c8d002-c74e-4942-96a5-4aa32d44a198" />

<b>Deep dark 🐳</b>
<img width="1265" height="53" alt="Screenshot 2025-08-17 at 1 52 50 AM" src="https://github.com/user-attachments/assets/57e31f9d-329b-4da2-bc7d-4d4e2846d806" />

<b>Barbie 💞</b>
<img width="1268" height="57" alt="Screenshot 2025-08-17 at 1 55 41 AM" src="https://github.com/user-attachments/assets/faaab0ad-622d-40d8-848b-2db20f219d96" />

<b>French 🇫🇷 (wait what?)</b>
<img width="1265" height="55" alt="Screenshot 2025-08-17 at 1 51 49 AM" src="https://github.com/user-attachments/assets/21b7e75d-9973-429d-81c5-083d29acd0a8" />


# lisence

MIT License - Copyright (c) 2025 elsieee.


