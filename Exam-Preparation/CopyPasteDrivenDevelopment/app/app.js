import {get, post, put, del} from './requester.js';

(function initiate() {
    const app = Sammy('#rooter', function () {
        //Use handlebars for templating
        this.use('Handlebars', 'hbs');

        const routes = {
            home: '#/home',
            login: '#/login',
            register: '#/register',
            logout: '#/logout',
        };

        const templates = {
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            home: './templates/home/home.hbs',
            login: './templates/login/login.hbs',
            register: './templates/register/register.hbs',
        };

        const partialTemplates = {
            header: templates.header,
            footer: templates.footer,
        };

        function addTemplateInfo(ctx) {
            ctx.isLoggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.id = sessionStorage.getItem('id');
        }

        //Routing functions
        this.get(routes.home, function (ctx) {
            addTemplateInfo(ctx);
            this.loadPartials(partialTemplates).partial(templates.home);
        });

        this.get('#/', function (ctx) {
            this.redirect(routes.home);
        });

        this.get('/', function (ctx) {
            this.redirect(routes.home);
        });

        this.get(routes.login, function (ctx) {
            addTemplateInfo(ctx);
            this.loadPartials(partialTemplates).partial(templates.login);
        });

        this.post(routes.login, function (ctx) {
            const {username, password} = ctx.params;

            post('user', 'login', {username, password}, 'Basic')
                .then(userInfo => {
                    sessionStorage.setItem('authtoken', userInfo._kmd.authtoken);
                    sessionStorage.setItem('username', userInfo.username);
                    sessionStorage.setItem('id', userInfo._id);

                    ctx.redirect(routes.home);
                })
                .catch(console.error)
        });

        this.get(routes.register, function (ctx) {
            addTemplateInfo(ctx);
            this.loadPartials(partialTemplates).partial(templates.register);
        });

        this.post(routes.register, function (ctx) {
            const {username, password} = ctx.params;

            post('user', '', {username, password}, 'Basic')
                .then(userInfo => {
                    sessionStorage.setItem('authtoken', userInfo._kmd.authtoken);
                    sessionStorage.setItem('username', userInfo.username);
                    sessionStorage.setItem('id', userInfo._id);

                    ctx.redirect(routes.home);
                })
                .catch(console.error)
        });

        this.get(routes.logout, function (ctx) {
            sessionStorage.clear();
            ctx.redirect(routes.home)
        });

		//TODO: Implement all other stuff

        //Run the app
        this.run('#/');
    })
})();