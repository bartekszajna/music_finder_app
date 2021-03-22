# Webpack 4 project template

### Very simple and basic ready-to-start project template. Based on Webpack 4 bundler, processes SCSS and JS files, minifies them, bundles and spites out to ./dist directory as ready for deploying. For more information and extensive documentation please visit https://webpack.js.org/.

**Includes:**

- scss/sass -> css compilation
- styles minification
- sourcemaps
- using ./src/template.html as a source for dynamicly created markdown in ./dist
- renaming (includes cache-busting)
- autoprefixers (with postcss-loader)
- scripts minification and transpiling through babel (preset-env)
- dynamic style.css inject to DOM
- bundling styles, scripts and images together
- images minification (albeit using web tools like (tinypng.com) is highly recommended and works much better)
- local server and automated live-reload thanks to webpack-dev-server

Inside of the project you will encounter two separate webpack config files - one serves as a development config and the other as a building one. Their names are optional, you only need to include them with `--config` flag in npm scripts to tell webpack which configuration file should it use. I found it pretty sufficient for my current needs but to keep up with DRY method you probably should separate mutual pieces to a third file (i.e. webpack.common.js) and it is possible by webpack-merge package.

In `src/styles` you'll find \_reset.scss - it is .scss file created
by Eric A. Meyer (meyerweb.com) and resets all default browser problematic styles like padding, margin, box-sizing.

In `src/assets` you'll find .jpg file used during configuration to check if images minification and injecting works.
Source/author: Photo by Michael Dam on Unsplash

    To start project, node.js & npm are required. You can download these from node website. Follow instructions.

`npm init -y`
Initiates npm management over your project. Creates package.json. `-y` sets all properties to default values. You can change them manually at any time by modifying package.json file.

`npm install / npm i`
This commands (either) should install all required dependencies listed in package.json file. Therefore node_modules directory is created.

`npm run start` one time script to create ./dist directory with readable scripts (difference lies in webpack-dev-server which works "in memory" so doesn't create that folder until you specifically build it)

`npm run dev` npm script for development process, opens local server (port 8000), opens your index.html and keeps looking for changes in project files. Enter command and work without interruptions for hours :) Webpack server - unlike tools like Gulp - can manage repetitive development tasks straight in the memory -> faster dev process, but be aware that it won't create ./dist folder on itself - you need to build app at the end

`npm run build` building script, not for repetitive evoke. Bundles all files, separates styles to external file, minifies scripts, injects style and script tags to markdown head, spites out ready for deployment ./dist folder

`./src`
Directory for all source subdirectories (styles, scripts, template.html and assets)

`./src/styles`
Source style files

`./src/scripts`
Source script files

`./dist`
Steady production directory for styles, images, html and scripts

PS. be aware of package.json file and data (author, project name, etc). Feel free to change it and use in your projects.
