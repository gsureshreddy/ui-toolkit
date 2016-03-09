# Introduction

A modular seed project for portals. Originally seed from angular2-seed project 

It is something similar to the Angular Quick Start but does the entire build with gulp.

`portal` provides the following features:

- Allows you to painlessly update the seed tasks of your already existing project.
- Ready to go, statically typed build system using gulp for working with TypeScript.
- Production and development builds.
- Sample unit tests with Jasmine and Karma including code coverage via [istanbul](https://gotwarlost.github.io/istanbul/).
- End-to-end tests with Protractor.
- Development server with Livereload.
- Following the [best practices for your application’s structure](https://github.com/mgechev/angular2-style-guide).
- Manager of your type definitions using [typings](https://github.com/typings/typings).
- Basic Service Worker, which implements "Cache then network strategy".

# How to start

**Note** that this seed project requires node v4.x.x or higher and npm 2.14.7.

You must have `ts-node` installed as global. If you don't, use:

```bash
npm install -g ts-node
```

In order to start the seed use:


```bash
git clone --depth 1 https://github.com/gsureshreddy/Portal.git
cd Portal
# install the project's dependencies
npm install
# watches your files and uses livereload by default
npm start
# api document for the app
npm run docs

# dev build
npm run build.dev
# prod build
npm run build.prod
```

_Does not rely on any global dependencies._

# Table of Content

- [Introduction](#introduction)
- [How to start](#how-to-start)
- [Table of Content](#table-of-content)
- [Configuration](#configuration)
- [How to extend?](#how-to-extend)
- [Running tests](#running-tests)
- [Contributing](#contributing)
- [Examples](#examples)
- [Directory Structure](#directory-structure)
- [Contributors](#contributors)
- [Change Log](#change-log)
- [License](#license)

# Configuration

Default application server configuration

```javascript
var PORT             = 5555;
var LIVE_RELOAD_PORT = 4002;
var DOCS_PORT        = 4003;
var APP_BASE         = '/';
```

Configure at runtime

```bash
npm start -- --port 8080 --reload-port 4000 --base /my-app/
```

# How to extend?

## Adding external dependency
In his example we'll show how you can add `angular2-jwt` to the `portal`.

1. Install the npm dependency.

  ```bash
  npm install angular2-jwt --save
  ```

2. Reference the dependency inside of any TypeScript file part of the project.

  Inside `src/about/components/about.component.ts` use:

  ```ts
  import * as jwt from 'angular2-jwt/angular2-jwt';
  // ...
  console.log(jwt.AuthConfig);
  ```

For such library you don't need `NPM_DEPENDENCIES`, since in `dev` it is loaded with SystemJS, and in production _browserify_ will bundle it based in the reference in `about.ts`.

## Adding external styles

In this page we'll show you how you can include the styles from Bootstrap to your project.

1. Install bootstrap.

  ```bash
  npm install bootstrap --save
  ```

2. Declare the `bootstrap.css` file as injectable.

  Inside `./tools/config.ts`, change `DEV_NPM_DEPENDENCIES` and `PROD_NPM_DEPENDENCIES` to add:

  ```ts
   export const *_NPM_DEPENDENCIES = [
      { src: 'systemjs/dist/system-polyfills.js' },
      //..
      { src: 'bootstrap/dist/css/bootstrap.min.css', inject: true },
      // ...
      { src: 'my-library/dist/bundle.js', inject: true }
  ];
  ```

Each entry of the `NPM_DEPENDENCIES` should follow this interface:

```ts
interface InjectableDependency {
  src: string;
  inject: string | boolean;
}
```

### `src` property

The `src` property of the dependency points out its destination. For instance, in the case of `bootstrap.css`: `bootstrap/dist/css/bootstrap.min.css`. **Note that the path is relative to `node_modules`**.

### `inject` property

In case the value of the `inject` property equals:

- `libs`, the dependency will be injected into the `<!-- libs:js -->` section of the index file.
- `shims`, the dependency will be injected into the `<!-- shims:js -->` section of the index file.
- `true`, then the dependency will be injected in `<!-- inject:css -->` or `<!-- inject:js -->` (depending on its type)

## Adding custom Gulp task

In this example we are going to add SASS support to the seed's dev build:

1. Install `gulp-sass` as dependency:

  ```bash
  npm install gulp-sass --save-dev
  ```

2. Add type definitions:

  ```bash
  # Note: typings MUST be installed as global
  typings install --ambient gulp-sass --save
  ```
  or with your local typings
  ```bash
  cd node_modules/.bin/
  typings install --ambient gulp-sass --save
  cd ../..
  ```

3. Add SASS task at `./tools/tasks/build.sass.dev.ts`:

  ```ts
  import {join} from 'path';
  import {APP_SRC, APP_DEST} from '../config';

  export = function buildSassDev(gulp, plugins, option) {
    return function () {
      return gulp.src(join(APP_SRC, '**', '*.scss'))
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(gulp.dest(APP_DEST));
    };
  }
  ```

4. Add `build.sass.dev` to your dev pipeline:

  ```ts
  // gulpfile.ts
  ...
  // --------------
  // Build dev.
  gulp.task('build.dev', done =>
    runSequence('clean.dist',
        'tslint',
        // New task
        'build.sass.dev',
        // ---
        'build.assets.dev',
        'build.js.dev',
        'build.index',
        done));
  ...

  ```
## Adding external fonts
Adding fonts installed with package manager is quite often task. For instance, using font-awesome or any other similar library is a typical task one will need.

For this purpose, you can go through the following steps:

1. In `config.ts`:

  ```ts
  export const FONTS_DEST = `${APP_DEST}/fonts`;
  export const FONTS_SRC =[
    'node_modules/bootstrap/dist/fonts/**'
  ];
  ```

2. For the production build, create a file `./tools/tasks/build.fonts.prod.ts`:

  ```ts
  import {join} from 'path';
  import {FONTS_SRC, FONTS_DEST} from '../config';

  export = function buildFonts(gulp, plugins) {
    return function () {
      return gulp
        .src(FONTS_SRC)
        .pipe(gulp.dest(FONTS_DEST));
    };
  }
  ```

3. In `gulpfile.ts`

  ```ts
  gulp.task('build.prod', done =>
    runSequence('clean.prod',
                'tslint',
                'build.assets.prod',
                'build.fonts.prod',    // Added task;
                'build.html_css.prod',
                'build.js.prod',
                'build.bundles',
                'build.bundles.app',
                'build.index.prod',
                done));
  ```

# Running tests

```bash
npm test

# Debug - In two different shell windows
npm run build.test.watch      # 1st window
npm run karma.start           # 2nd window

# code coverage (istanbul)
# auto-generated at the end of `npm test`
# view coverage report:
npm run serve.coverage

# e2e (aka. end-to-end, integration) - In three different shell windows
# Make sure you don't have a global instance of Protractor

# npm run webdriver-update <- You will need to run this the first time
npm run webdriver-start
npm run serve.e2e
npm run e2e

# e2e live mode - Protractor interactive mode
# Instead of last command above, you can use:
npm run e2e.live
```
You can learn more about [Protractor Interactive Mode here](https://github.com/angular/protractor/blob/master/docs/debugging.md#testing-out-protractor-interactively)

# Directory Structure

```
.
├── LICENSE
├── README.md
├── gulpfile.ts                <- configuration of the gulp tasks
├── karma.conf.js              <- configuration of the test runner
├── package.json               <- dependencies of the project
├── protractor.conf.js         <- e2e tests configuration
├── src                        <- source code of the application
│   ├── home
│   │   └── components
│   ├── index.html
│   ├── main.ts
│   ├── shared
│   │   └── services
│   │       ├── name-list...
│   │       └── name-list...
│   └── sw.js                  <- sample service worker
├── test-main.js               <- testing configuration
├── tools
│   ├── README.md              <- build documentation
│   ├── config
│   │   ├── project.config.ts  <- configuration of the specific project
│   │   ├── seed.config....
│   │   └── seed.config.ts     <- generic configuration of the seed project
│   ├── config.ts              <- exported configuration (merge both seed.config and project.config, project.config overrides seed.config)
│   ├── debug.ts
│   ├── manual_typings
│   │   ├── project            <- manual ambient typings for the project
│   │   │   └── sample.pac...
│   │   └── seed               <- seed manual ambient typings
│   │       ├── merge-stre..
│   │       └── slash.d.ts
│   ├── tasks                  <- gulp tasks
│   │   ├── project            <- project specific gulp tasks
│   │   │   └── sample.tas...
│   │   └── seed               <- seed generic gulp tasks. They can be overriden by the project specific gulp tasks
│   ├── utils                  <- build utils
│   │   ├── project            <- project specific gulp utils
│   │   │   └── sample_util...
│   │   ├── project.utils.ts
│   │   ├── seed               <- seed specific gulp utils
│   │   │   ├── clean.ts
│   │   │   ├── code_change...
│   │   │   ├── server.ts
│   │   │   ├── tasks_tools.ts
│   │   │   ├── template_loc...
│   │   │   ├── tsproject.ts
│   │   │   └── watch.ts
│   │   └── seed.utils.ts
│   └── utils.ts
├── tsconfig.json              <- configuration of the typescript project (ts-node, which runs the tasks defined in gulpfile.ts)
├── tslint.json                <- tslint configuration
├── typings                    <- typings directory. Contains all the external typing definitions defined with typings
├── typings.json
└── appveyor.yml
```

# Contributors
1. Suresh Reddy Guntaka

# Change Log

You can follow the [Angular 2 change log here](https://github.com/angular/angular/blob/master/CHANGELOG.md).

# License

UDVI copyright 2016