# Music Finder App

<p align="center">
  <img src="https://raw.githubusercontent.com/bartekszajna/music_finder_app_design/master/design/mobile_views/light_mode.jpg" width="30%"/>
  <img src="https://raw.githubusercontent.com/bartekszajna/music_finder_app_design/master/design/mobile_views/dark_mode.jpg" width="30%"/>
  <img src="https://raw.githubusercontent.com/bartekszajna/music_finder_app_design/master/design/mobile_views/light_mode_info_modal.jpg" width="30%"/>
</p>

### Both client and server side code of SPA served by basic Express.js, using Spotify API to asynchronously fetch data and browse through your favourite music. Authorization handled with OAuth framework based on Client Credentials Flow. With [Figma design version](https://github.com/bartekszajna/music_finder_app_design) of the app together those repos make up a complete web application project.

#

<p align="center">
  <img src="https://raw.githubusercontent.com/bartekszajna/music_finder_app_design/master/design/desktop_views/dark_mode_info_modal.jpg" width="80%" />
</p>

## Features:

- powered by Spotify API
- served by Express.js which is responsible for handling both the OAuth (accessing bearer token) and proxying all user requests
- dynamically browsing through REST API and displays given resources on screen immediately
- audio player for available track resources
- no requirements for user login and authentication
- endpoints access based on client credentials access token, if you want to know more - see their documentation and [Guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/#client-credentials-flow)
- light/dark mode feature complying both to users' preference and their respective OS settings, current choice safely saved on Local Storage
- user's favourite list of liked items (stored on client side inside of Local Storage)
- uses Web Animations API
- smooth, animated DOM elements removal with FLIP (First-Last-Invert-Play) technique
- 404.html page prepared for wrong url requests
- dynamic loading of more data on scroll (with Intersection Observers)
