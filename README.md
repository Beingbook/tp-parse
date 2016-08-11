[![Build Status](https://travis-ci.org/Beingbook/tp-parse.svg?branch=master)](https://travis-ci.org/Beingbook/tp-parse)
[![Dependency Badge](https://david-dm.org/Beingbook/tp-parse.svg?style=flat-square)](https://david-dm.org/Beingbook/tp-parse)
[![devDependency Status](https://david-dm.org/Beingbook/tp-parse/dev-status.svg?style=flat-square)](https://david-dm.org/Beingbook/tp-parse#info=devDependencies)
[![Code Climate](https://codeclimate.com/github/Beingbook/tp-parse/badges/gpa.svg)](https://codeclimate.com/github/Beingbook/tp-parse)
[![Issue Count](https://codeclimate.com/github/Beingbook/tp-parse/badges/issue_count.svg)](https://codeclimate.com/github/Beingbook/tp-parse)

It works with [Telpo](https://github.com/Beingbook/tp-app).
To launch this, see [getting-started](./docs/get-started.md) document.

### Directory Map

Run `tree -L 2 -I 'node_modules|build|.git|.DS_Store' -A -a` then you will see below:

```sh
.                      # Root
├── .editorconfig   # common editor configurations
├── .eslintrc.json  # eslint configurations
├── .gitignore
├── LICENSE.txt
├── README.md
├── package.json    # dependency list
├── src             # application source code
│ ├── assets       # private static files
│ ├── public       # public static files
│ ├── cloud        # parse cloud files
│ ├── cloud.j      # parse cloud importer
│ ├── server.js    # server entry
├── tests           # unit tests
└── tools           # build and deployment tools
    ├── .eslintrc.json
    ├── config.js   # webpack configurations
    ├── lib
    ├── run.js
    └── tasks       # build, deploy, serve, etc...
```

License MIT
