![ReactJS Logo. Subjected to Copyright. Facebook Inc. From Wikimedia.org](https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg)

# ReactJS.SimpleMathGame
*A basic math game(Children's Math Game perhaps)*

version: 0.0.001

Author: **[Vernard Mercader](http://vernard.net)**

Instructor: **[Samer Buna](http://edgecoders.com)**

Live Demo: **[http://vmdataserv.com/react-starsumsgame](http://vmdataserv.com/react-starsumsgame)**

Keywords: React,Express,Node,Webpack,Babel,javaScript,Math

A basic math game(Children's Math Game perhaps) where you pick a number or a group of number which equal to the sum value of elements/objects presented. The goal is simple: (1) make it before the timer ends; (2) You can only pick a number once; (3) You can add any group of numbers to get to a sum equal to the number of objects (Star), or you can pick only one (which would be the number of stars present); (4) If all of the 9 numbers are picked, you win the game.  

It's a simple game where React focuses on UI Logic states, and majority of the "brains" of the program are JavaScript Math.

## Init:

To start the project in Node:

    npm -y init

Simple installation:
run `npm install`

(Really detailed) Install necessities

1. `npm install --save express react react-dom`
2. `npm install --save-dev webpack webpack-cli babel-loader @babel/core @babel/preset-react @babel/plugin-proposal-class-properties html-webpack-plugin`

After initialisation, creating the entry point (start.js (*others like it as app.js*))

Additionally, run the following:

* `npm i --save-dev clean-webpack-plugin`
* `npm install less`
* `npm i --save-dev less-loader`
* `npm i --save-dev css-loader style-loader postcss-loader`
* `npm i --save-dev autoprefixer cssnano`
* `npm i --save-dev mini-css-extract-plugin`
* `npm i --save-dev less-plugin-clean-css@latest`
* `npm i --save-dev file-loader`
* `npm i --save-dev terser-webpack-plugin`

3. then run `node start.js`
