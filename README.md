# Music Finder App

(<span style="color: red; font-weight: 700">Note: </span>project in progress - no available live website to test it yet)
<br>

<p align="center">
  <img src="https://raw.githubusercontent.com/bartekszajna/music_finder_app_design/master/design/mobile_views/light_mode.jpg" width="30%"/>
  <img src="https://raw.githubusercontent.com/bartekszajna/music_finder_app_design/master/design/mobile_views/dark_mode.jpg" width="30%"/>
  <img src="https://raw.githubusercontent.com/bartekszajna/music_finder_app_design/master/design/mobile_views/light_mode_info_modal.jpg" width="30%"/>
</p>

### Client-side code of SPA served by Express.js, using Spotify API to asynchronously fetch data and browse through your favourite music. Authorization handled with OAuth framework based on Client Credentials Flow. With [Figma design version](https://github.com/bartekszajna/music_finder_app_design) of the app together those repos make up a front-end part of project.

#

<p align="center">
  <img src="https://raw.githubusercontent.com/bartekszajna/music_finder_app_design/master/design/desktop_views/dark_mode_info_modal.jpg" width="80%" />
</p>

## Features:

- powered by Spotify API
- dynamically browsing through REST API and displays given resources on screen immediately
- no requirements for user login and authentication
- endpoints access based on client credentials access token, see their documentation and [Guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/#client-credentials-flow)
- light/dark mode switch
- user's favourite list of liked items (stored on client side inside of Local Storage)
- pagination of fetched data and loading more on scroll
