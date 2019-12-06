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
            share: '#/share',
            recipe: '#/recipes/:recipeId',
            likeRecipe: '#/recipes/like/:recipeId',
            editRecipe: '#/recipes/edit/:recipeId',
            delRecipe: '#/recipes/delete/:recipeId',
        };

        const templates = {
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            home: './templates/home/home.hbs',
            login: './templates/login/login.hbs',
            register: './templates/register/register.hbs',
            share: './templates/share/share.hbs',
            recipe: './templates/recipes/recipe.hbs',
            editRecipe: './templates/recipes/edit.hbs'
        };

        const partialTemplates = {
            header: templates.header,
            footer: templates.footer,
        };

        const categories = {
          'Vegetables and legumes/beans': 'https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549__340.jpg',
          'Grain Food': 'https://cdn.pixabay.com/photo/2014/12/11/02/55/corn-syrup-563796__340.jpg',
          'Fruits': 'https://cdn.pixabay.com/photo/2017/06/02/18/24/fruit-2367029__340.jpg',
          'Milk, cheese, eggs and alternatives': 'https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg',
          'Lean meats and poultry, fish and alternatives': 'https://t3.ftcdn.net/jpg/01/18/84/52/240_F_118845283_n9uWnb81tg8cG7Rf9y3McWT1DT1ZKTDx.jpg',
        };

        function addTemplateInfo(ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.id = sessionStorage.getItem('id');
            ctx.names = sessionStorage.getItem('names');
            //ctx.recipes = [1,1];
        }

        //Routing functions
        this.get(routes.home, function (ctx) {
            addTemplateInfo(ctx);
            if (sessionStorage.getItem('authtoken') !== null) {
                get('appdata', 'cookUni', 'Kinvey')
                    .then(recipes => {
                        ctx.recipes = recipes;

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
                    sessionStorage.setItem('names', `${userInfo.firstName} ${userInfo.lastName}`);

                    ctx.redirect(routes.home);
                })
                .catch(console.error)
        });

        this.get(routes.register, function (ctx) {
            addTemplateInfo(ctx);
            this.loadPartials(partialTemplates).partial(templates.register);
        });

        this.post(routes.register, function (ctx) {
            const {username, password, firstName, lastName} = ctx.params;

            post('user', '', {username, password, firstName, lastName}, 'Basic')
                .then(userInfo => {
                    sessionStorage.setItem('authtoken', userInfo._kmd.authtoken);
                    sessionStorage.setItem('username', userInfo.username);
                    sessionStorage.setItem('id', userInfo._id);
                    sessionStorage.setItem('names', `${firstName} ${lastName}`);

                    ctx.redirect(routes.home);
                })
                .catch(console.error)
        });

        this.get(routes.logout, function (ctx) {
            sessionStorage.clear();
            ctx.redirect(routes.home)
        });

        this.get(routes.share, function (ctx) {
            addTemplateInfo(ctx);
            this.loadPartials(partialTemplates).partial(templates.share);
        });

        this.post(routes.share, function (ctx) {
            let {meal, ingredients, prepMethod, description, foodImageURL, category} = ctx.params;
            ingredients = ingredients.split(', ');
            category = category.value;
            const likesCounter = 0;
            const categoryImageURL = categories[category];
            post('appdata', 'cookUni', {meal, ingredients, prepMethod, description, foodImageURL, category, likesCounter, categoryImageURL}, 'Kinvey')
                .then(function () {
                    ctx.redirect(routes.home);
                })
                .catch(console.error);
        });

        this.get(routes.recipe, function (ctx) {
            addTemplateInfo(ctx);
            const id = ctx.params.recipeId;
            get('appdata', `cookUni/${id}`, 'Kinvey')
                .then(recipeInfo => {
                    ctx.id = recipeInfo._id;
                    ctx.meal = recipeInfo.meal;
                    ctx.foodImageURL = recipeInfo.foodImageURL;
                    ctx.ingredients = recipeInfo.ingredients;
                    ctx.prepMethod = recipeInfo.prepMethod;
                    ctx.description = recipeInfo.description;
                    ctx.likesCounter = recipeInfo.likesCounter;
                    ctx.isCreator = sessionStorage.getItem('id') === recipeInfo._acl.creator;
                    this.loadPartials(partialTemplates).partial(templates.recipe);
                })
                .catch(console.error);
        });

        this.get(routes.likeRecipe, function (ctx) {
            const id = ctx.params.recipeId;
            get('appdata', `cookUni/${id}`, 'Kinvey')
                .then(recipeInfo => {
                    recipeInfo.likesCounter++;
                    put('appdata',`cookUni/${id}`, recipeInfo, 'Kinvey')
                        .then(function () {
                            ctx.redirect(routes.home)
                        })
                })
                .catch(console.error);
        });

        this.get(routes.editRecipe, function (ctx) {
            addTemplateInfo(ctx);
            const id = ctx.params.recipeId;
            get('appdata', `cookUni/${id}`, 'Kinvey')
                .then(recipeInfo => {
                    ctx.id = recipeInfo._id;
                    ctx.meal = recipeInfo.meal;
                    ctx.foodImageURL = recipeInfo.foodImageURL;
                    ctx.ingredients = recipeInfo.ingredients.join(', ');
                    ctx.prepMethod = recipeInfo.prepMethod;
                    ctx.description = recipeInfo.description;
                    ctx.category = recipeInfo.category;

                    this.loadPartials(partialTemplates).partial(templates.editRecipe)
                })
                .catch(console.error);
        });

        this.post(routes.editRecipe, function (ctx) {
            const id = ctx.params.recipeId;
            ctx.params.ingredients = ctx.params.ingredients.split(', ');
            let recipeInfo = ctx.params;
            let category = recipeInfo.category;
            recipeInfo.categoryImageURL = categories[category];

            put('appdata', `cookUni/${id}`, recipeInfo, 'Kinvey')
                .then(function () {
                    ctx.redirect(routes.home);
                })
                .catch(console.error);
        });

        this.get(routes.delRecipe, function (ctx) {
            const id = ctx.params.recipeId;
            del('appdata', `cookUni/${id}`, 'Kinvey')
                .then(function () {
                    ctx.redirect(routes.home);
                })
                .catch(console.error)
        });

        //Run the app
        this.run('#/');
    })
})();