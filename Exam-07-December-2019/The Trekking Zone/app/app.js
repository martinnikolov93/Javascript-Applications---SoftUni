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
            createTrek: '#/createTrek',
            viewTrek: '#/treks/:trekId',
            editTrek: '#/treks/edit/:trekId',
            deleteTrek: '#/treks/delete/:trekId',
            likeTrek: '#/treks/like/:trekId',
            profile: '#/profile/:uId',
        };

        const templates = {
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            home: './templates/home/home.hbs',
            login: './templates/login/login.hbs',
            register: './templates/register/register.hbs',
            createTrek: './templates/trek/create.hbs',
            viewTrek: './templates/trek/view.hbs',
            editTrek: './templates/trek/edit.hbs',
            profile: './templates/profile/profile.hbs',
        };

        const partialTemplates = {
            header: templates.header,
            footer: templates.footer,
        };

        function addTemplateInfo(ctx) {
            ctx.isLoggedIn = localStorage.getItem('authtoken') !== null;
            ctx.username = localStorage.getItem('username');
            ctx.id = localStorage.getItem('id');
        }

        /** Routing **/
        //Home
        this.get(routes.home, function (ctx) {
            addTemplateInfo(ctx);
            if (localStorage.getItem('authtoken') !== null) {
                get('appdata', 'treks', 'Kinvey')
                    .then(treks => {
                        ctx.userId = localStorage.getItem('id');
                        ctx.treks = treks;
                        this.loadPartials(partialTemplates).partial(templates.home);
                    })
                    .catch(console.error);
            } else {
                this.loadPartials(partialTemplates).partial(templates.home);
            }
        });

        this.get('#/', function (ctx) {
            this.redirect(routes.home);
        });

        this.get('/', function (ctx) {
            this.redirect(routes.home);
        });

        //User
        //Login
        this.get(routes.login, function (ctx) {
            addTemplateInfo(ctx);
            this.loadPartials(partialTemplates).partial(templates.login);
        });

        this.post(routes.login, function (ctx) {
            displayLoading();
            const {username, password} = ctx.params;
            post('user', 'login', {username, password}, 'Basic')
                .then(userInfo => {
                    localStorage.setItem('authtoken', userInfo._kmd.authtoken);
                    localStorage.setItem('username', userInfo.username);
                    localStorage.setItem('id', userInfo._id);

                    removeLoading();
                    displaySuccess('Successfully logged user.');

                    ctx.redirect(routes.home);
                })
                .catch(function () {
                    displayError('Wrong credentials!');
                })
        });

        //Register
        this.get(routes.register, function (ctx) {
            addTemplateInfo(ctx);
            this.loadPartials(partialTemplates).partial(templates.register);
        });

        this.post(routes.register, function (ctx) {
            displayLoading();
            const {username, password, rePassword} = ctx.params;

            if (username.length < 3) {
                displayError('The username should be at least 3 characters long');
                return;
            }
            if (password.length < 6) {
                displayError('The password should be at least 6 characters long');
                return;
            }
            if (password !== rePassword) {
                displayError('The repeat password should be equal to the password');
                return;
            }


            post('user', '', {username, password}, 'Basic')
                .then(userInfo => {
                    localStorage.setItem('authtoken', userInfo._kmd.authtoken);
                    localStorage.setItem('username', userInfo.username);
                    localStorage.setItem('id', userInfo._id);

                    removeLoading();
                    displaySuccess('Successfully registered user.');

                    ctx.redirect(routes.home);
                })
                .catch(function () {
                    displayError('User already registered!');
                })
        });

        //Logout
        this.get(routes.logout, function (ctx) {
            let headers = {
                method: 'POST',
                headers: {
                    'Authorization': `Kinvey ${localStorage.getItem('authtoken')}`
                }
            };
            fetch('https://baas.kinvey.com/user/kid_r1Pn8XhsB/_logout', headers)
                .then(function () {
                    displaySuccess('Logout successful.');
                    localStorage.clear();
                    ctx.redirect(routes.home)
                })
                .catch(function () {
                    displayError('Something went wrong!');
                });
        });

        //Treks
        //Create trek
        this.get(routes.createTrek, function (ctx) {
            addTemplateInfo(ctx);
            this.loadPartials(partialTemplates).partial(templates.createTrek);
        });

        this.post(routes.createTrek, function (ctx) {
            displayLoading();
            const {location, dateTime, description, imageURL} = ctx.params;
            const likes = 0;
            const organizer = localStorage.getItem('username');

            if (location.length < 6) {
                displayError('The trek name should be at least 6 characters long.');
                return;
            }
            if (description.length < 10) {
                displayError('The description should be at least 10 characters long.');
                return;
            }

            post('appdata', 'treks', {location, dateTime, description, imageURL, likes, organizer}, 'Kinvey')
                .then(trekInfo => {
                    removeLoading();
                    displaySuccess('Trek created successfully.');
                    ctx.redirect(routes.home);
                })
                .catch(function () {
                    displayError('Something went wrong!');
                });
        });

        //View trek
        this.get(routes.viewTrek, function (ctx) {
            const id = ctx.params.trekId;
            addTemplateInfo(ctx);

            get('appdata', `treks/${id}`, 'Kinvey')
                .then(trekInfo => {
                    ctx.trekInfo = trekInfo;
                    ctx.isCreator = trekInfo._acl.creator === localStorage.getItem('id');
                    this.loadPartials(partialTemplates).partial(templates.viewTrek);
                })
        });

        //Edit trek
        this.get(routes.editTrek, function (ctx) {
            const id = ctx.params.trekId;
            addTemplateInfo(ctx);

            get('appdata', `treks/${id}`, 'Kinvey')
                .then(trekInfo => {
                    ctx.trekInfo = trekInfo;
                    this.loadPartials(partialTemplates).partial(templates.editTrek);
                })
                .catch(function () {
                    displayError('Something went wrong!');
                })
        });

        this.post(routes.editTrek, function (ctx) {
            displayLoading();
            const trekInfo = ctx.params;
            const id = ctx.params.trekId;
            put('appdata', `treks/${id}`, trekInfo, 'Kinvey')
                .then(trekInfo => {
                    removeLoading();
                    displaySuccess('Trek edited successfully.');
                    ctx.redirect(routes.home);
                })
                .catch(console.error);
        });

        //Delete trek
        this.get(routes.deleteTrek, function (ctx) {
            const id = ctx.params.trekId;
            del('appdata', `treks/${id}`, 'Kinvey')
                .then(trekInfo => {
                    displaySuccess('You closed the trek successfully.');
                    ctx.redirect(routes.home);
                })
                .catch(console.error);
        });

        //Like trek
        this.get(routes.likeTrek, function (ctx) {
            const id = ctx.params.trekId;
            get('appdata', `treks/${id}`, 'Kinvey')
                .then(trekInfo => {
                    let isCreator = trekInfo._acl.creator === localStorage.getItem('id');
                    if (isCreator) {
                        ctx.redirect(routes.home);
                    } else {
                        displaySuccess('You liked the trek successfully.');
                        trekInfo.likes++;
                        put('appdata', `treks/${id}`, trekInfo, 'Kinvey')
                            .then(function () {
                                ctx.redirect(`#/treks/${id}`);
                            })
                            .catch(console.error);
                    }
                })
                .catch(console.error);
        });

        //profile view
        this.get(routes.profile, function (ctx) {
            const id = ctx.params.uId;
            addTemplateInfo(ctx);
            console.log(id)

            get('user', `${id}`, 'Kinvey')
                .then(userInfo => {
                    ctx.userInfo = userInfo;
                    let endPoint = `treks/?query={"_acl.creator":"${id}"}`;
                    get('appdata', endPoint, 'Kinvey')
                        .then(treksInfo => {
                            ctx.treksInfo = treksInfo;
                            ctx.wished = treksInfo.length;
                            this.loadPartials(partialTemplates).partial(templates.profile);
                        })
                })
                .catch(console.error);
        });

        function displaySuccess(message) {
            let div = document.getElementById('successBox');
            div.textContent = message;
            div.style.display = 'block';

            div.addEventListener('click', function () {
                div.textContent = '';
                div.style.display = 'none';
            });

            setTimeout(function () {
                div.style.display = 'none';
                div.textContent = '';
            }, 5000);
        }

        function displayError(message) {
            let div = document.getElementById('errorBox');
            div.textContent = message;
            div.style.display = 'block';

            div.addEventListener('click', function () {
                div.textContent = '';
                div.style.display = 'none';
            })
        }

        function displayLoading() {
            let div = document.getElementById('loadingBox');
            div.textContent = 'Loading';
            div.style.display = 'block';
        }

        function removeLoading() {
            let div = document.getElementById('loadingBox');
            div.textContent = '';
            div.style.display = 'none';
        }

        //Run the app
        this.run('#/home');
    })
})();