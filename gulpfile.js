var gulp = require('gulp');
var runSequence = require('run-sequence');
var utils_1 = require('./tools/utils');
var config_1 = require('./tools/config');
utils_1.loadTasks(config_1.SEED_TASKS_DIR);
utils_1.loadTasks(config_1.PROJECT_TASKS_DIR);
gulp.task('build.dev', function (done) {
    return runSequence('clean.dev', 'tslint', 'build.assets.dev', 'build.js.dev', 'build.index.dev', done);
});
gulp.task('build.dev.watch', function (done) {
    return runSequence('build.dev', 'watch.dev', done);
});
gulp.task('build.e2e', function (done) {
    return runSequence('clean.dev', 'tslint', 'build.assets.dev', 'build.js.e2e', 'build.index.dev', done);
});
gulp.task('build.prod', function (done) {
    return runSequence('clean.prod', 'tslint', 'build.assets.prod', 'build.html_css.prod', 'build.js.prod', 'build.bundles', 'build.bundles.app', 'build.index.prod', done);
});
gulp.task('build.test', function (done) {
    return runSequence('clean.dev', 'tslint', 'build.assets.dev', 'build.js.test', 'build.index.dev', done);
});
gulp.task('build.test.watch', function (done) {
    return runSequence('build.test', 'watch.test', done);
});
gulp.task('build.tools', function (done) {
    return runSequence('clean.tools', 'build.js.tools', done);
});
gulp.task('docs', function (done) {
    return runSequence('build.docs', 'serve.docs', done);
});
gulp.task('serve.dev', function (done) {
    return runSequence('build.dev', 'server.start', 'watch.dev', done);
});
gulp.task('serve.e2e', function (done) {
    return runSequence('build.e2e', 'server.start', 'watch.e2e', done);
});
gulp.task('test', function (done) {
    return runSequence('build.test', 'karma.start', done);
});
//# sourceMappingURL=gulpfile.js.map