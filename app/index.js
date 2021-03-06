'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var colors = require('colors');


var YeogurtGenerator = module.exports = function YeogurtGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.options = options;

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(YeogurtGenerator, yeoman.generators.Base);

YeogurtGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    var yeogurtLogo = '' +
        '                                    _   \n'.red +
        '                  ' + 'Welcome to'.green + '       | |  \n'.red +
        '  _   _  ___  ___   __ _ _   _ _ __| |_ \n'.red +
        ' | | | |/ _ \\\/ _ \\ \/ _` | | | | \'__| __|\n'.red +
        ' | |_| |  __/ (_) | (_| | |_| | |  | |_ \n'.red +
        '  \\__, |\\___|\\___/ \\__, |\\__,_|_|   \\__|\n'.red +
        '   __/ |            __/ |               \n'.red +
        '  |___/            |___/     \n'.red +
        '                                      ';

    // have Yeogurt greet the user.
    console.log(yeogurtLogo);

    var prompts = [{
        name: 'projectName',
        message: 'What would you like to' + ' name your project'.blue + '?',
        default: 'Sample'
    }, {
        type: 'list',
        name: 'versionControl',
        message: 'Which version control software are you using (or plan to use)?',
        choices: ['Git', 'SVN', 'None (I like to live on the edge)']
    }, {
        type: 'list',
        name: 'cssOption',
        message: 'Which CSS preprocessor would you like to use?',
        choices: ['SCSS', 'LESS', 'None (Vanilla CSS)']
    }, {
        when: function(props) { return (/SCSS/i).test(props.cssOption); },
        type: 'confirm',
        name: 'useBourbon',
        message: 'Would you like to use the Bourbon Mixin Library?',
        default: true
    }, {
        when: function(props) { return (/LESS/i).test(props.cssOption); },
        type: 'confirm',
        name: 'useLesshat',
        message: 'Would you like to use the Lesshat Mixin Library?',
        default: true
    }, {
        type: 'list',
        name: 'jsOption',
        message: 'Which JavaScript module library would you like to use?',
        choices: ['RequireJS', 'Browserify', 'None (Vanilla JavaScript)']
    }, {
        type: 'confirm',
        name: 'ieSupport',
        message: 'Do you need to support IE8+?',
        default: true
    }, {
        type: 'confirm',
        name: 'responsive',
        message: 'Will the site be responsive (Use CSS3 media queries)?',
        default: true
    }, {
        type: 'confirm',
        name: 'useGA',
        message: 'Will you be using Google Analytics?',
        default: true
    }, {
        type: 'confirm',
        name: 'useFTP',
        message: 'Will you be deploying code to an FTP server?',
        default: true
    }, {
        type: 'confirm',
        name: 'jshint',
        message: 'Would you like to lint your Javascript with JSHint?',
        default: true
    }, {
        type: 'checkbox',
        name: 'extras',
        message: 'Select any extras you would like:',
        choices: [{
            name: 'Twitter Bootstrap 3.x',
            value: 'useBootstrap',
            checked: true
        }, {
            name: 'Font Awesome 4.x',
            value: 'useFontAwesome',
            checked: true
        }, {
            name: 'HTML5 Boilerplate extras (.htaccess, Apple homescreen icon, etc)',
            value: 'htaccess',
            checked: false
        }, {
            name: 'Dynamic Dashboard: Generate a dashboard for your site/app',
            value: 'useDashboard',
            checked: false
        }]
    }];

    this.prompt(prompts, function(props) {
        this.projectName = props.projectName;
        this.versionControl = props.versionControl;
        this.cssOption = props.cssOption;
        this.jsOption = props.jsOption;
        this.ieSupport = props.ieSupport;
        this.responsive = props.responsive;
        this.extras = props.extras;
        this.jshint = props.jshint;
        this.useGA = props.useGA;
        this.useFTP = props.useFTP;
        this.useDashboard = props.useDashboard;
        this.useBourbon = props.useBourbon;
        this.useLesshat = props.useLesshat;
        var extras = this.extras;

        function hasFeature(feat) {
            return extras.indexOf(feat) !== -1;
        }

        this.htaccess = hasFeature('htaccess');
        this.useBootstrap = hasFeature('useBootstrap');
        this.useFontAwesome = hasFeature('useFontAwesome');
        this.useDashboard = hasFeature('useDashboard');

        if (this.htaccess) {
            this.ieIcons = true;
            this.adobeXdomain = true;
            this.appleIcon = true;
        }

        this.props = props;

        cb();
    }.bind(this));
};

YeogurtGenerator.prototype.app = function app() {

    // Create .yo-rc.json file
    this.config.set('config', this.props);
    this.config.save();

    // Create needed Directories

    // root (/)
    this.template('Gruntfile.js', 'Gruntfile.js');
    this.template('_bower.json', 'bower.json');
    this.template('_package.json', 'package.json');

    this.copy('dev/robots.txt', 'dev/robots.txt');
    this.copy('dev/humans.txt', 'dev/humans.txt');
    this.copy('dev/favicon.ico', 'dev/favicon.ico');

    if (this.useFTP) {
        this.copy('.ftppass', '.ftppass');
    }

    if (this.versionControl === 'SVN') {
        this.copy('svn-init.sh', 'svn-init.sh');
    }

    // dev/
    this.mkdir('dev');

    // dev/images
    this.mkdir('dev/images');

};

YeogurtGenerator.prototype.markup = function markup() {
    // dev/markup
    this.mkdir('dev/markup');
    this.mkdir('dev/markup/templates');
    this.mkdir('dev/markup/pages');
    this.mkdir('dev/markup/components');
    this.mkdir('dev/markup/helpers');

    this.template('dev/markup/components/header.jade', 'dev/markup/components/header.jade');
    this.template('dev/markup/components/footer.jade', 'dev/markup/components/footer.jade');
    this.template('dev/markup/helpers/heading.jade', 'dev/markup/helpers/heading.jade');
    this.template('dev/markup/pages/index.jade', 'dev/markup/pages/index.jade');
    this.template('dev/markup/base.jade', 'dev/markup/base.jade');
    this.template('dev/markup/templates/one-column.jade', 'dev/markup/templates/one-column.jade');
};

YeogurtGenerator.prototype.scripts = function scripts() {
    // dev/scripts
    this.mkdir('dev/scripts');
    this.mkdir('dev/scripts/vendor');
    this.mkdir('dev/scripts/modules');

    this.template('dev/scripts/app.js', 'dev/scripts/app.js');

    if (this.jsOption === 'Browserify' || this.jsOption === 'RequireJS') {
        this.template('dev/scripts/main.js', 'dev/scripts/main.js');
        this.template('dev/scripts/modules/module.js', 'dev/scripts/modules/module.js');
    }
};

YeogurtGenerator.prototype.styles = function styles() {
    // dev/styles
    this.mkdir('dev/styles');
    this.mkdir('dev/styles/fonts');

    if (this.cssOption !== 'None (Vanilla CSS)') {
        if (this.cssOption === 'LESS') {
            this.mkdir('dev/styles/base');
            this.mkdir('dev/styles/partials');
            this.mkdir('dev/styles/vendor');
            if (this.useFontAwesome) {
                this.template('dev/styles/vendor/_font-awesome.less', 'dev/styles/vendor/_font-awesome.less');
            }
            if (this.useBootstrap) {
                this.template('dev/styles/vendor/_bootstrap.less', 'dev/styles/vendor/_bootstrap.less');
            }
            this.template('dev/styles/base/_box-sizing.less', 'dev/styles/base/_box-sizing.less');
            this.template('dev/styles/base/_mixins.less', 'dev/styles/base/_mixins.less');
            this.template('dev/styles/base/_variables.less', 'dev/styles/base/_variables.less');
            this.template('dev/styles/base/_reset.less', 'dev/styles/base/_reset.less');
            if (this.useLesshat) {
                this.template('dev/styles/vendor/_lesshat.less', 'dev/styles/vendor/_lesshat.less');
            }
            if (!this.useBootstrap) {
                this.template('dev/styles/vendor/_normalize.less', 'dev/styles/vendor/_normalize.less');
            }
            this.template('dev/styles/partials/_footer.less', 'dev/styles/partials/_footer.less');
            this.template('dev/styles/partials/_header.less', 'dev/styles/partials/_header.less');
            this.template('dev/styles/main.less', 'dev/styles/main.less');
            if (this.ieSupport) {
                this.template('dev/styles/partials/_print.less', 'dev/styles/print.less');
                this.template('dev/styles/base/_ie8.less', 'dev/styles/base/_ie8.less');
            }
            else {
                this.template('dev/styles/partials/_print.less', 'dev/styles/partials/_print.less');
            }
        }
        if (this.cssOption === 'SCSS') {
            this.mkdir('dev/styles/base');
            this.template('dev/styles/base/_mixins.less', 'dev/styles/base/_mixins.scss');
            this.template('dev/styles/base/_variables.less', 'dev/styles/base/_variables.scss');
            this.template('dev/styles/base/_reset.less', 'dev/styles/base/_reset.scss');
            this.template('dev/styles/base/_box-sizing.less', 'dev/styles/base/_box-sizing.scss');
            this.mkdir('dev/styles/partials');
            this.template('dev/styles/partials/_footer.less', 'dev/styles/partials/_footer.scss');
            this.template('dev/styles/partials/_header.less', 'dev/styles/partials/_header.scss');
            this.mkdir('dev/styles/vendor');
            if (this.useFontAwesome) {
                this.template('dev/styles/vendor/_font-awesome.less', 'dev/styles/vendor/_font-awesome.scss');
            }
            if (this.useBootstrap) {
                this.template('dev/styles/vendor/_bootstrap.less', 'dev/styles/vendor/_bootstrap.scss');
            }
            if (this.useBourbon) {
                this.template('dev/styles/vendor/_bourbon.scss', 'dev/styles/vendor/_bourbon.scss');
            }
            if (!this.useBootstrap) {
                this.template('dev/styles/vendor/_normalize.less', 'dev/styles/vendor/_normalize.scss');
            }
            if (this.ieSupport) {
                this.template('dev/styles/partials/_print.less', 'dev/styles/print.scss');
                this.template('dev/styles/base/_ie8.less', 'dev/styles/base/_ie8.scss');
            }
            else {
                this.template('dev/styles/partials/_print.less', 'dev/styles/partials/_print.scss');
            }
            this.template('dev/styles/main.less', 'dev/styles/main.scss');
        }
    }
    else {
        this.template('dev/styles/main.css', 'dev/styles/main.css');
        this.template('dev/styles/print.css', 'dev/styles/print.css');
    }

};

YeogurtGenerator.prototype.dashboard = function dashboard() {
    // Dashboard
    if (this.useDashboard) {
        // markup
        this.mkdir('dev/dashboard');
        this.mkdir('dev/dashboard/markup');
        this.mkdir('dev/dashboard/markup/components');
        this.mkdir('dev/dashboard/markup/templates');

        this.copy('dev/dashboard/markup/components/header.jade', 'dev/dashboard/markup/components/header.jade');
        this.copy('dev/dashboard/markup/components/footer.jade', 'dev/dashboard/markup/components/footer.jade');
        this.copy('dev/dashboard/markup/components/dashboard-switcher.jade', 'dev/dashboard/markup/components/dashboard-switcher.jade');
        this.copy('dev/dashboard/markup/components/status-key.jade', 'dev/dashboard/markup/components/status-key.jade');
        this.copy('dev/dashboard/markup/pages/index.jade', 'dev/dashboard/markup/pages/index.jade');
        this.copy('dev/dashboard/markup/base.jade', 'dev/dashboard/markup/base.jade');
        this.copy('dev/dashboard/markup/templates/dashboard.jade', 'dev/dashboard/markup/templates/dashboard.jade');

        // images
        this.directory('dev/dashboard/images', 'dev/dashboard/images');

        // styles
        this.mkdir('dev/dashboard/styles');
        this.directory('dev/dashboard/styles/fonts', 'dev/dashboard/styles/fonts');

        if (this.cssOption !== 'None (Vanilla CSS)') {
            if (this.cssOption === 'LESS') {
                this.mkdir('dev/dashboard/styles/base');
                this.template('dev/dashboard/styles/base/_box-sizing.less', 'dev/dashboard/styles/base/_box-sizing.less');
                this.template('dev/dashboard/styles/base/_ie8.less', 'dev/dashboard/styles/base/_ie8.less');
                this.template('dev/dashboard/styles/base/_mixins.less', 'dev/dashboard/styles/base/_mixins.less');
                this.template('dev/dashboard/styles/base/_reset.less', 'dev/dashboard/styles/base/_reset.less');
                this.template('dev/dashboard/styles/base/_variables.less', 'dev/dashboard/styles/base/_variables.less');
                this.mkdir('dev/dashboard/styles/partials');
                this.copy('dev/dashboard/styles/partials/_footer.less', 'dev/dashboard/styles/partials/_footer.less');
                this.copy('dev/dashboard/styles/partials/_header.less', 'dev/dashboard/styles/partials/_header.less');
                this.template('dev/dashboard/styles/partials/_status-key.less', 'dev/dashboard/styles/partials/_status-key.less');
                this.template('dev/dashboard/styles/partials/_dashboard-switcher.less', 'dev/dashboard/styles/partials/_dashboard-switcher.less');
                this.template('dev/dashboard/styles/partials/_dashboard.less', 'dev/dashboard/styles/partials/_dashboard.less');
                this.mkdir('dev/dashboard/styles/vendor');
                if (this.useFontAwesome) {
                    this.template('dev/dashboard/styles/vendor/_font-awesome.less', 'dev/dashboard/styles/vendor/_font-awesome.less');
                }
                if (this.useLesshat) {
                    this.template('dev/dashboard/styles/vendor/_lesshat.less', 'dev/dashboard/styles/vendor/_lesshat.less');
                }
                this.template('dev/dashboard/styles/vendor/_normalize.less', 'dev/dashboard/styles/vendor/_normalize.less');
                this.template('dev/dashboard/styles/main.less', 'dev/dashboard/styles/main.less');
            }
            if (this.cssOption === 'SCSS') {
                this.mkdir('dev/dashboard/styles/base');
                this.template('dev/dashboard/styles/base/_box-sizing.less', 'dev/dashboard/styles/base/_box-sizing.scss');
                this.template('dev/dashboard/styles/base/_ie8.less', 'dev/dashboard/styles/base/_ie8.scss');
                this.template('dev/dashboard/styles/base/_mixins.less', 'dev/dashboard/styles/base/_mixins.scss');
                this.template('dev/dashboard/styles/base/_reset.less', 'dev/dashboard/styles/base/_reset.scss');
                this.template('dev/dashboard/styles/base/_variables.less', 'dev/dashboard/styles/base/_variables.scss');
                this.mkdir('dev/dashboard/styles/partials');
                this.copy('dev/dashboard/styles/partials/_footer.less', 'dev/dashboard/styles/partials/_footer.scss');
                this.copy('dev/dashboard/styles/partials/_header.less', 'dev/dashboard/styles/partials/_header.scss');
                this.template('dev/dashboard/styles/partials/_status-key.less', 'dev/dashboard/styles/partials/_status-key.scss');
                this.template('dev/dashboard/styles/partials/_dashboard-switcher.less', 'dev/dashboard/styles/partials/_dashboard-switcher.scss');
                this.template('dev/dashboard/styles/partials/_dashboard.less', 'dev/dashboard/styles/partials/_dashboard.scss');
                this.mkdir('dev/dashboard/styles/vendor');
                this.template('dev/dashboard/styles/vendor/_font-awesome.less', 'dev/dashboard/styles/vendor/_font-awesome.scss');
                if (this.useBourbon) {
                    this.template('dev/dashboard/styles/vendor/_bourbon.scss', 'dev/dashboard/styles/vendor/_bourbon.scss');
                }
                this.template('dev/dashboard/styles/vendor/_normalize.less', 'dev/dashboard/styles/vendor/_normalize.scss');
                this.template('dev/dashboard/styles/main.less', 'dev/dashboard/styles/main.scss');
            }
        }
        else {
            this.template('dev/dashboard/styles/main.css', 'dev/dashboard/styles/main.css');
        }

        // scripts
        this.directory('dev/dashboard/scripts', 'dev/dashboard/scripts');
    }
};

YeogurtGenerator.prototype.testing = function testing() {
    this.mkdir('test');
    this.mkdir('test/spec');
    if (this.jsOption === 'RequireJS') {
        this.copy('test/test-main.js', 'test/test-main.js');
    }
    this.template('test/spec/appSpec.js', 'test/spec/appSpec.js');
    this.template('karma.conf.js', 'karma.conf.js');
};

YeogurtGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    if (this.jshint) {
        this.copy('jshintrc', '.jshintrc');
    }
};

YeogurtGenerator.prototype.extras = function extras() {
    if (this.adobeXdomain) {
        this.copy('dev/crossdomain.xml', 'dev/crossdomain.xml');
    }

    if (this.ieIcons) {
        this.copy('dev/browserconfig.xml', 'dev/browserconfig.xml');
        this.copy('dev/tile.png', 'dev/tile.png');
        this.copy('dev/tile-wide.png', 'dev/tile-wide.png');
    }

    if (this.htaccess) {
        this.copy('dev/.htaccess', 'dev/.htaccess');
    }

    if (this.appleIcon) {
        this.copy('dev/apple-touch-icon-precomposed.png', 'dev/apple-touch-icon-precomposed.png');
    }
};

YeogurtGenerator.prototype.runtime = function runtime() {
    this.copy('bowerrc', '.bowerrc');
    if (this.versionControl === 'Git') {
        this.copy('gitignore', '.gitignore');
        this.copy('gitattributes', '.gitattributes');
    } else if (this.versionControl === 'SVN') {
        this.copy('svnignore', '.svnignore');
    }
};

YeogurtGenerator.prototype.install = function() {
    if (this.options['skip-install']) {
        return;
    }

    var done = this.async();
    this.installDependencies({
        skipMessage: this.options['skip-install-message'],
        skipInstall: this.options['skip-install'],
        callback: done
    });
};
