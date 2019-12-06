import {get, post, put, del} from './requester.js';

(function f() {
    const app = Sammy('#main', function () {
        //Use handlebars for templating
        this.use('Handlebars', 'hbs');

        const partials = {
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
        };

        //Routing
        this.get('/', function (ctx) {
            ctx.redirect('#/home');
        });

        this.get('#/', function (ctx) {
            ctx.redirect('#/home');
        });

        this.get('#/home', function (ctx) {
            addSessionInfo(ctx);
            this.loadPartials(partials).partial('./templates/home/home.hbs');
        });

        this.get('#/about', function (ctx) {
            addSessionInfo(ctx);
            this.loadPartials(partials).partial('./templates/about/about.hbs');
        });

        this.get('#/login', function (ctx) {
            addSessionInfo(ctx);
            partials['loginForm'] = './templates/login/loginForm.hbs';
            this.loadPartials(partials).partial('./templates/login/loginPage.hbs');
        });

        this.post('#/login', function (ctx) {
            const {username, password} = ctx.params;

            post('user', 'login', {username, password}, 'Basic')
                .then(userInfo => {
                    sessionStorage.setItem('authtoken', userInfo._kmd.authtoken);
                    sessionStorage.setItem('userID', userInfo._id);
                    sessionStorage.setItem('username', userInfo.username);

                    ctx.redirect('#/home');
                })
                .catch(console.error)
        });

        this.get('#/register', function (ctx) {
            addSessionInfo(ctx);
            partials['registerForm'] = './templates/register/registerForm.hbs';
            this.loadPartials(partials).partial('./templates/register/registerPage.hbs');
        });

        this.post('#/register', function (ctx) {
            const {username, password, repeatPassword} = ctx.params;

            if (username !== null && password !== null && password === repeatPassword) {
                post('user', '', {username: username, password: password, hasNoTeam: true}, 'Basic')
                    .then(r => {
                        ctx.redirect('#/login');
                    })
                    .catch(console.error)
            }
        });

        this.get('#/catalog', function (ctx) {
            addSessionInfo(ctx);
            partials['team'] = './templates/catalog/team.hbs';

            get('appdata', 'teams', 'Kinvey')
                .then(data => {
                    ctx.teams = data;
                    this.loadPartials(partials).partial('./templates/catalog/teamCatalog.hbs');
                })
                .catch(console.error);
        });

        this.get('#/catalog/:teamID', function (ctx) {
            addSessionInfo(ctx);
            const id = ctx.params.teamID;

            partials['teamControls'] = './templates/catalog/teamControls.hbs';

            get('appdata', `teams/${id}`, 'Kinvey')
                .then(teamInfo => {
                    ctx.name = teamInfo.name;
                    ctx.comment = teamInfo.comment;
                    ctx.members = teamInfo.members;
                    console.log( ctx.members);
                    this.loadPartials(partials).partial('./templates/catalog/details.hbs');
                })
                .catch(console.error);

        });

        this.get('#/create', function (ctx) {
            addSessionInfo(ctx);
            partials['createForm'] = './templates/create/createForm.hbs';
            this.loadPartials(partials).partial('./templates/create/createPage.hbs');
        });

        this.post('#/create', function (ctx) {
            const {name, comment} = ctx.params;
            let members = [];
            const teamCreator = {
                userID: sessionStorage.getItem('userID'),
                username: sessionStorage.getItem('username'),
            };
            members.push(teamCreator);

            post('appdata', 'teams', {name, comment, members}, 'Kinvey')
                .then(res => {
                    ctx.redirect('#/catalog');
                })
                .catch(console.error);
        });

        this.get('#/logout', function (ctx) {
            sessionStorage.clear();
            ctx.redirect('#/home')
        });
    });

    function addSessionInfo(ctx) {
        ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
        ctx.userID = sessionStorage.getItem('userID');
        ctx.username = sessionStorage.getItem('username');
    }

    //Run the app
    app.run('#/');
})();