# Babel6 Express Package
[![Build Status](https://travis-ci.org/Beingbook/babel6-api-server.svg?branch=master)](https://travis-ci.org/Beingbook/babel6-api-server)
[![Dependency Badge](https://david-dm.org/Beingbook/babel6-api-server.svg?style=flat-square)](https://david-dm.org/Beingbook/babel6-api-server)
[![devDependency Status](https://david-dm.org/Beingbook/babel6-api-server/dev-status.svg?style=flat-square)](https://david-dm.org/Beingbook/babel6-api-server#info=devDependencies)
[![Code Climate](https://codeclimate.com/github/Beingbook/babel6-api-server/badges/gpa.svg)](https://codeclimate.com/github/Beingbook/babel6-api-server)
[![Issue Count](https://codeclimate.com/github/Beingbook/babel6-api-server/badges/issue_count.svg)](https://codeclimate.com/github/Beingbook/babel6-api-server)

A nice package to deploy your node.js project as PaaS.

## Features

* Babel 6, ES2015 + ES7
* Mocha Test Environment
* Webpack, development and production
* Airbnb config eslint

## See Documents
* [Getting Started](./docs/get-started.md)
* [API Route](./docs/route.md)

### Directory Map

Run `tree -L 2 -I 'node_modules|build|.git|.DS_Store' -A -a` then you will see below:

```sh
.                  # Root
├── .editorconfig  # common editor configurations
├── .eslintrc.json # eslint configurations
├── .gitignore
├── LICENSE.txt
├── README.md
├── package.json   # dependency list
├── src            # application source code
│ ├── assets       # private static files
│ ├── public       # public static files
│ ├── server.js    # server entry
├── tests          # unit tests
└── tools          # build and deployment tools
    ├── .eslintrc.json
    ├── config.js  # webpack configurations
    ├── lib
    ├── run.js
    └── tasks      # build, deploy, serve, etc...
```
