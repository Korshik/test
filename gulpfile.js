import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
// import less from 'gulp-less';
import { deleteAsync } from 'del';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import babel from 'gulp-babel';
import GulpUglify from 'gulp-uglify';
import concat from 'gulp-concat'
const sass = gulpSass(dartSass);

// пути к файлам назначения
const paths = {
    styles: {
        src: ['src/styles/**/*.sass','src/styles/**/*.scss'],
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'dist/js/' 
    }
}
// задача для очистки каталога
function clean() {
    return deleteAsync(['dist'])
}
const _clean = clean;

// задача для обработки стилей
function styles() {
    return gulp.src(paths.styles.src)
    // .pipe(less())
		.pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({
        basename: 'main',
        suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest))
}
// задача для обработки скриптов
function scripts(){
    return gulp.src(paths.scripts.src, {
        sourcemaps: true
    })
    .pipe(babel())
    .pipe(GulpUglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
}
// задача для отслеживания изменений
function watch(){
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
}

const build = gulp.series(clean, gulp.parallel(styles,scripts), watch)

export { _clean as clean };
export { styles };
export { scripts };
export { watch };
export { build };
export default build;
