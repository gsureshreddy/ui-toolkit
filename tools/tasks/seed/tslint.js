var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var path_1 = require('path');
var config_1 = require('../../config');
var plugins = gulpLoadPlugins();
module.exports = function () {
    var src = [
        path_1.join(config_1.APP_SRC, '**/*.ts'),
        '!' + path_1.join(config_1.APP_SRC, '**/*.d.ts'),
        path_1.join(config_1.TOOLS_DIR, '**/*.ts'),
        '!' + path_1.join(config_1.TOOLS_DIR, '**/*.d.ts')
    ];
    return gulp.src(src)
        .pipe(plugins.tslint({
        rulesDirectory: config_1.NG2LINT_RULES
    }))
        .pipe(plugins.tslint.report(plugins.tslintStylish, {
        emitError: true,
        sort: true,
        bell: true
    }));
};
//# sourceMappingURL=tslint.js.map