const BACKEND_PORT = 5000;
var Ingredient_List = '';
var user_email;
var contributor_name = '';
var Recipe_list = '';
// var curr_recipe;

document.getElementById("button-go-login").addEventListener('click', function() {
    document.getElementById("form-login").style.display = 'block';
    document.getElementById("form-register").style.display = 'none';
});

document.getElementById("button-go-register").addEventListener('click', function() {
    document.getElementById("form-login").style.display = 'none';
    document.getElementById("form-register").style.display = 'block';
});


document.getElementById('button-login').addEventListener("click", login);
function login() {
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    if (email === '') {
        alert('Please enter email');
        return;
    }
    if (password === '') {
        alert('Please enter password');
        return;
    }
    user_email = email;

    const resource = `http://localhost:${BACKEND_PORT}/auth/login`;

    const requestBody = {
        email: email,
        password: password,
    };

    const init = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };

    fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            Ingredient_List = data;
            const key = Object.keys(Ingredient_List);
            const value = Object.values(Ingredient_List);
            console.log(key, value);
            SetIngredient(key, value);
            location.hash = 'feed';
            alert('login successful');
        }
    }).catch((err) => {
        alert(err);
    });
}

function SetIngredient(key, value) {
    for (var k = 0; k < key.length; k++) {
        const a = document.createElement('div');
        a.className = 'ingredient-category-item';
        a.id = key[k];
        a.innerHTML = '<p style="text-align:center;">' + key[k] + '</p><div class="section-divider"></div>';
        const IngredientList = document.createElement('div');
        IngredientList.className = 'ingredients-category-list';

        for (var i = 0; i < value[k].length; i++) {
            const input = document.createElement('input');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('class', 'btn-check');
            input.setAttribute('id', value[k][i]);
            input.setAttribute('autocomplete', 'off');
            IngredientList.appendChild(input);
            const label = document.createElement('label');
            label.setAttribute('class', 'btn btn-outline-primary');
            label.setAttribute('for', value[k][i]);
            label.setAttribute('style', 'margin-left: 10px; margin-top: 5px');
            label.innerHTML = value[k][i];
            IngredientList.appendChild(label);
        }
        a.appendChild(IngredientList);
        document.getElementById('IngredientCategory').append(a);
    }
}

document.getElementById('button-logout').addEventListener("click", logout);
function logout() {
    location.hash = 'login';
    location.reload();
}

document.getElementById('button-register').addEventListener("click", register);
function register() {
    const email = document.getElementById('R_Email').value;
    const name = document.getElementById('R_Name').value;
    const password = document.getElementById('R_Password').value;
    const confirmPassword = document.getElementById('R_Confirm_Password').value;

    if (!email || !name || !password || !confirmPassword) {
        alert("Form items cannot be null");
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords not match');
        return;
    }

    if (password.length < 5) {
        alert('Passwords is too short, the minimum is 6');
        return;
    }
    if (password.length > 13) {
        alert('Passwords is too long, the maximum is 12');
        return;
    }

    const resource = `http://localhost:${BACKEND_PORT}/auth/register`;

    const requestBody = {
        email: email,
        password: password,
        name: name,
    };

    const init = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };

    fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            // localStorage.setItem('token', data.token);
            alert('register succesful');           
        }
    }).catch((err) => {
        alert(err);
    })
}

function goLoginPage() {
    location.hash = 'login';
    document.getElementById('feed_page').style.display = 'none';
    document.getElementById('main_page').style.display = 'block';
}

function goFeedPage() {
    location.hash = 'feed';
    document.getElementById('main_page').style.display = 'none';
    document.getElementById('feed_page').style.display = 'block';
    
}

function showCurrentPage() {
    const hash = location.hash;
    switch (hash) {
        case '#login': {
          goLoginPage();
          break;
        }
        
        case '#feed': {
            goFeedPage();
            break;
        }

        default: {
          goLoginPage();
          break;
        }
    }
}

window.onhashchange = function() {
    console.log("page change!");
    showCurrentPage();
}

window.onload = function() {
    if (location.href.indexOf('?') === -1) {
        location.href = `${location.href}?`;
    }
    showCurrentPage();
}

document.getElementById('button-logout').addEventListener('click', logoutbutton);
function logoutbutton() {
    console.log('logout')
}

document.getElementById('addIngredient').addEventListener('click', addIngredient);
function addIngredient() {
    const name = document.getElementById('search1').value;
    const list = document.getElementsByClassName('btn-check');
    for (var i = 0; i< list.length; i++) {
        if (name === list[i].id && !list[i].checked) {
            list[i].checked = true;
            return;
        } else if (name === list[i].id && list[i].checked) {
            alert('You have chosen it');
            return;
        }
    }
    alert('Please input correct name');
}

let list_button = document.getElementById("list_show")
list_button.addEventListener('click', searchListShow);
function searchListShow() {
    var L = [];
    const list = document.getElementsByClassName('btn-check');
    for (var i = 0; i < list.length; i++) {
        if (list[i].checked) {
            L.push(list[i].id);
        }
    };
    addHtml('Search List', 'searchList');
    const body = document.getElementById('searchList');
    if (L !== []) {
        for (var i = 0; i < L.length; i++) {
            const option = document.createElement('div');
            option.style = 'margin-top:10px';
            option.setAttribute('class', 'testFor');
            option.innerHTML = L[i];
            const button = document.createElement('button');
            button.style = 'float:right';
            button.setAttribute('value', L[i]);
            button.innerHTML = 'remove';
            button.addEventListener('click', ()=>removeIngredient(event));
            option.append(button);
            body.append(option);
        }
    }
}

function addHtml(header, type) {
    const module = document.createElement('div');
    module.setAttribute('class', "modal fade show");
    module.setAttribute('id', 'searchIngredient');
    module.setAttribute('style', "display: block;");
    module.setAttribute('aria-modal', 'true');
    module.setAttribute('role', 'dialog');
    const dialog = document.createElement('div');
    dialog.setAttribute('class', 'modal-dialog');
    const content = document.createElement('div');
    content.setAttribute('class', 'modal-content');
    content.setAttribute('id', 'ingredient-search');
    dialog.append(content);
    module.append(dialog);
    document.body.prepend(module);

    const head = document.createElement('div');
    head.setAttribute('class', 'modal-header');
    head.setAttribute('id', 'listHeader');
    head.innerHTML = `<h5 class="modal-title">${header}</h5>`;
    content.append(head);

    const body = document.createElement('div');
    body.setAttribute('class',' modal-body');
    body.setAttribute('id', 'searchList');
    content.append(body);

    const footer = document.createElement('div');
    footer.setAttribute('class', 'modal-footer');
    const close = document.createElement('button');
    close.setAttribute('type', 'button');
    close.setAttribute('class', 'btn btn-secondary');
    close.innerHTML = 'Close';
    footer.appendChild(close);
    close.addEventListener('click', ()=>closeSearchList());
    if (type === 'UpdateIngredient' || type === 'UploadRecipe') {
        let close_button = document.createElement('button');
        close_button.setAttribute('type', 'button');
        close_button.setAttribute('id', 'closeButton');
        close_button.setAttribute('class', 'btn btn-secondary');
        close_button.innerHTML = 'Confirm and Upload';
        if (type === 'UpdateIngredient') {
            close_button.addEventListener('click', ()=>UpdateIngre());
        } else if (type === 'UploadRecipe') {
            close_button.addEventListener('click', ()=>UpdateRecipe());
        }
        footer.appendChild(close_button);
    }
    content.appendChild(footer);
}

function removeIngredient(ingredient) {
    const value = ingredient.target.value;
    const list = document.getElementsByClassName('btn-check');
    for (var i = 0; i < list.length; i++) {
        if (list[i].id === value && list[i].checked) {
            list[i].checked = false;
        }
    }
    const L = document.getElementsByClassName('testFor');
    for (var i = 0; i < L.length; i++) {
        if (L[i].innerHTML.includes(value)) {
            L[i].remove();
        }
    }
}

function closeSearchList() {
    document.getElementById('searchIngredient').remove();
}

function UpdateIngre() {
    const type = document.getElementById('selectIngredient').value;
    const value = document.getElementById('inputIngredient').value;
    const resource = `http://localhost:${BACKEND_PORT}/upload/ingredient`;
    const requestBody = {
        category: type,
        name: value
    };
    const init = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };

    fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            alert('upload ingredient succesfully');           
        }
    }).catch((err) => {
        alert(err);
    })
    const category = document.getElementById('selectIngredient').value;
    const values = document.getElementById('inputIngredient').value;
    var index = '';
    const categoryList = document.getElementsByClassName('ingredient-category-item');
    for (var i = 0; i< categoryList.length; i++) {
        if (categoryList[i].id === category) {
            index = i;
        }
    };
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('class', 'btn-check');
    input.setAttribute('id', values);
    input.setAttribute('autocomplete', 'off');
    document.getElementsByClassName('ingredients-category-list')[index].appendChild(input);
    const label = document.createElement('label');
    label.setAttribute('class', 'btn btn-outline-primary');
    label.setAttribute('for', values);
    label.setAttribute('style', 'margin-left: 10px; margin-top: 5px');
    label.innerHTML = values;
    document.getElementsByClassName('ingredients-category-list')[index].appendChild(label);

    document.getElementById('searchIngredient').remove();
}

function UpdateRecipe() {
    const recipeName = document.getElementById('RecipeInput').value;
    const ingredientList = document.getElementById('IngredientInput').value;
    const Link = document.getElementById('RecipeLinkInput').value;
    const type = document.getElementById('selectMeal').value
    if (recipeName === '' || ingredientList === '' || Link === '') {
        alert('Please input correctly');
        return
    };
    if (type === 'none') {
        alert('Please select meal type');
        return;
    }
    const inlist = document.getElementsByClassName('btn-check');
    const l1 = ingredientList.split(',');
    var l2 = [];
    for (var i = 0; i < inlist.length; i++) {
        l2.push(inlist[i].id);
    }
    for (var i = 0; i < l1.length; i++) {
        if (!l2.includes(l1[i])) {
            alert('The ingredients you entered do not exist');
            return;
        }
    }
    const resource = `http://localhost:${BACKEND_PORT}/upload/recipe`;
    const requestBody = {
        name: recipeName,
        ingredients_list: ingredientList,
        contributor_email: user_email,
        link: Link,
        category: type
    };
    console.log(requestBody)
    const init = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };
    fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error)
            return;
        } else {
            alert('Recipe uploaded successfully');
        }
    }).catch((err) => {
        alert(err);
    });
    document.getElementById('searchIngredient').remove();
}

document.getElementById('UploadIngredient').addEventListener('click', UpdateIngredient);
function UpdateIngredient() {
    addHtml('Which new ingredient you want to upload?', 'UpdateIngredient');
    const select =  document.createElement('select');
    select.setAttribute('id', 'selectIngredient');
    const categoryList = document.getElementsByClassName('ingredient-category-item');
    for (var i = 0; i< categoryList.length; i++) {
        var options = document.createElement('option');
        options.setAttribute('value', categoryList[i].id);
        options.innerHTML = categoryList[i].id;
        select.append(options);
    }
    document.getElementById('searchList').append(select);

    const input = document.createElement('input');
    input.setAttribute('id', 'inputIngredient');
    input.setAttribute('type', 'search');
    input.setAttribute('style', 'margin-left: 40px');
    document.getElementById('searchList').append(input)
}

document.getElementById('UploadRecipe').addEventListener('click', UploadRecipe);
function UploadRecipe() {

    const resource = `http://localhost:${BACKEND_PORT}/upload/recipe`;
    const init = {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
        },
    };
    fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            console.log(data);
            if (data.length > 0) {
                document.getElementById('input1').value = data[0].ingredients_set;
            }
            if (data.length > 1) {
                document.getElementById('input2').value = data[1].ingredients_set;
            }
            if (data.length > 2) {
                document.getElementById('input3').value = data[2].ingredients_set;
            }
        }
    }).catch((err) => {
        alert(err);
    })

    addHtml('Which new recipe you want to upload?', 'UploadRecipe');
    const body = document.getElementById('searchList');
    
    const RecipeName = document.createElement('div');
    RecipeName.style = 'margin-top:10px';
    RecipeName.innerHTML = 'Enter recipe name';
    const nameInput = document.createElement('input');
    nameInput.style = 'float:right';
    nameInput.id = 'RecipeInput';
    RecipeName.appendChild(nameInput)
    body.append(RecipeName);

    const ingredientName = document.createElement('div');
    ingredientName.style = 'margin-top:10px';
    ingredientName.innerHTML = 'Enter ingredients name';
    const ingredientInput = document.createElement('input');
    ingredientInput.style = 'float:right';
    ingredientInput.id = 'IngredientInput';
    ingredientName.appendChild(ingredientInput);
    body.append(ingredientName);

    const RecipeLink = document.createElement('div');
    RecipeLink.style = 'margin-top:10px';
    RecipeLink.innerHTML = 'Enter recipe link';
    const RecipeLinkInput = document.createElement('input');
    RecipeLinkInput.style = 'float:right';
    RecipeLinkInput.id = 'RecipeLinkInput';
    RecipeLink.appendChild(RecipeLinkInput);
    body.append(RecipeLink);

    const selectType = document.createElement('div');
    selectType.style = 'margin-top:10px';
    selectType.innerHTML = 'Select Meal type';
    const select = document.createElement('select');
    select.id = 'selectMeal'
    select.style = 'float:right; margin-top:5px'
    select.innerHTML = '<option value="none">None</option><option value="breakfast">Breakfast</option>'
    +'<option value="lunch">Lunch</option><option value="dinner">Dinner</option>';
    selectType.appendChild(select);
    body.append(selectType);

    const ingredients = document.createElement('div');
    ingredients.style = 'margin-top:30px; margin-left:80px';
    ingredients.innerHTML = '<p>The most popular group of ingredients</p>';
    const a = document.createElement('textarea');
    a.rows = 1;
    a.cols = 40;
    a.id = 'input1';
    a.setAttribute('readonly', "true");
    ingredients.appendChild(a);
    const b = document.createElement('textarea');
    b.rows = 1;
    b.cols = 40;
    b.id = 'input2';
    b.style = 'margin-top:5px';
    b.setAttribute('readonly', "true");
    ingredients.appendChild(b);
    const c = document.createElement('textarea');
    c.rows = 1;
    c.cols = 40;
    c.id = 'input3';
    c.style = 'margin-top:5px';
    c.setAttribute('readonly', "true");
    ingredients.appendChild(c);
    body.append(ingredients);
}

document.getElementById('getrecipes').addEventListener('click', GetRecipeByIngredients);
async function GetRecipeByIngredients() {
    var L = [];
    const list = document.getElementsByClassName('btn-check');
    for (var i = 0; i < list.length; i++) {
        if (list[i].checked) {
            L.push(list[i].id);
        }
    };
    L = L.join();
    const resource = `http://localhost:${BACKEND_PORT}/search/by_list`;
    const requestBody = {
        ingredients_list: L
    };
    const init = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };
    var recipeList = '';
    await fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            console.log(data);
            Recipe_list = data;
            recipeList = data;
            document.getElementById('YouCanMakeRecipe').innerHTML = `You can make ${recipeList.length} recipes`;
            const a = document.getElementById('RecommendIngredient');
            a.innerHTML = '';
            const Recipes = document.getElementById('recipeList');
            Recipes.innerHTML = '';
            for (var i = 0; i < recipeList.length; i++) {
                if (recipeList[i].missing !== null) {
                    const ingre = document.createElement('input');
                    ingre.type = 'checkbox';
                    ingre.className = 'btn-check';
                    ingre.id = recipeList[i].missing;
                    ingre.autocomplete = 'off';
                    a.append(ingre);
                    const label = document.createElement('label');
                    label.className = 'btn btn-outline-primary';
                    label.setAttribute('for', recipeList[i].missing);
                    label.setAttribute('style', 'margin-left: 10px; margin-top: 5px');
                    label.innerHTML = recipeList[i].missing;
                    a.append(label);
                }
                const card = document.createElement('div');
                card.className = 'card';
                card.style = 'width: 18rem; margin-left: 10px';
                const body = document.createElement('div');
                body.className = 'card-body';
                body.innerHTML = `<h5 class="card-title">${recipeList[i].name}</h5><p2>Rate: ${recipeList[i].rate}</p2>`;
                const text = document.createElement('p');
                text.className = 'card-text';
                if (recipeList[i].missing !== null) {
                    text.innerHTML = `You lack ${recipeList[i].missing}`;
                    text.style = 'color: red';
                } else {
                    text.innerHTML = `You have ${recipeList[i].n_ingredients} ingredients`;
                }
                const button = document.createElement('button');
                button.type = 'button';
                button.style = 'float:right';
                button.setAttribute('value', recipeList[i].name);
                button.innerHTML = 'View details';
                button.addEventListener('click', ()=>ViewDetail(event));
                body.appendChild(text);
                body.appendChild(button);
                card.appendChild(body);
                Recipes.append(card);
            };
            if (data.length === 0) {
                alert('Do not find any recipes');
            }
        }
    }).catch((err) => {
        alert(err);
    })
}

function ViewDetail(recipe) {
    const recipeName = recipe.target.value;
    const resource = `http://localhost:${BACKEND_PORT}/search/by_name`;
    const requestBody = {
        name: recipeName,
        email: user_email
    };
    const init = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };
    fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            console.log(data);
            createRecipeNode(data);      
        }
    }).catch((err) => {
        alert(err);
    })
}

// submit rate
function sendRate(rate, recipeName) {
    const resource = `http://localhost:${BACKEND_PORT}/mark/rate`;

    const requestBody = {
        name: recipeName,
        mark: rate
    };

    const init = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };

    fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            alert('rate this recipe success!');     
        }
    }).catch((err) => {
        alert(err);
    })

}

// getUserName
function getUserName(comment, recipeName) {
    const resource = `http://localhost:${BACKEND_PORT}/mark/comment?email=${user_email}`;

    fetch(resource).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            console.log(data);
            let userName = data;
            sendComment(userName, comment, recipeName)      
        }
    }).catch((err) => {
        alert(err);
    })
}

// sendComment
function sendComment(userName, comment, recipeName) {
    let message = userName + ":" + comment;
    const resource = `http://localhost:${BACKEND_PORT}/mark/comment`;

    const requestBody = {
        recipe_name: recipeName,
        text: message
    };

    const init = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };

    fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            alert('make comment success! Please reopen the recipe to see your comment.');     
        }
    }).catch((err) => {
        alert(err);
    })

}

document.getElementById('button-addon2').addEventListener("click", getRecipeByName);
function getRecipeByName() {
    const recipeName = document.getElementById('recipeSearch').value;
    const resource = `http://localhost:${BACKEND_PORT}/search/by_name`;

    const requestBody = {
        name: recipeName,
        email: user_email
    };

    const init = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };

    fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            console.log(data);
            createRecipeNode(data);      
        }
    }).catch((err) => {
        alert(err);
    })
}

function createRecipeNode(data) {
    let nodeA = document.createElement('div');
    nodeA.setAttribute("class", "modal fade");
    nodeA.setAttribute("id", `RecipeModal`);
    nodeA.setAttribute("tabindex", "-1");
    nodeA.setAttribute("aria-labelledby", "exampleModalLabel");
    nodeA.setAttribute("aria-hidden", "true");

    let nodeB = document.createElement('div');
    nodeB.setAttribute("class", "modal-dialog");
    nodeA.appendChild(nodeB);

    let nodeC = document.createElement('div');
    nodeC.setAttribute("class", "modal-content");
    nodeB.appendChild(nodeC);

    let nodeD = document.createElement('div');
    nodeD.setAttribute("class", "modal-header");
    nodeC.appendChild(nodeD);

    let nodeE = document.createElement('h5');
    nodeE.setAttribute("class", "modal-title");
    nodeE.setAttribute("id", `exampleModalLabel`);
    nodeE.innerText = 'Recipe Details';
    nodeD.appendChild(nodeE);
    let closeButton = document.createElement('button');
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("class", "btn-close");
    closeButton.setAttribute("data-bs-dismiss", "modal");
    closeButton.setAttribute("aria-label", "Close");
    nodeD.appendChild(closeButton)

    let nodeF = document.createElement('div');
    nodeF.setAttribute("class", "modal-body");
    nodeC.appendChild(nodeF);

    let cardNode = document.createElement('div');
    cardNode.setAttribute("class", "card");
    cardNode.setAttribute("style", "width: 30rem;");
    nodeF.appendChild(cardNode)

    let cardBodyNode = document.createElement('div');
    cardBodyNode.setAttribute("class", "card-body");
    cardNode.appendChild(cardBodyNode);
    
    let cardTitleNode = document.createElement('h5');
    cardTitleNode.setAttribute("class", "card-title");
    cardTitleNode.innerText = data.recipe_name;
    const Button = document.createElement('button');
    Button.type = 'button';
    Button.id = 'likeButton';
    if (!data.is_favourite) {
        Button.innerHTML = 'Like';
        Button.addEventListener('click', LikeRecipe);
    } else {
        Button.innerHTML = 'Unlike';
        Button.addEventListener('click', LikeRecipes);
    }
    Button.style = "width: 50px; height: 50px; border-radius:50%;border: none;float:right";
    cardTitleNode.appendChild(Button);
    cardBodyNode.appendChild(cardTitleNode);

    let listNode = document.createElement('ul');
    listNode.setAttribute("class", "list-group list-group-flush");
    listNode.style = 'style="margin-top:25px"';
    cardBodyNode.appendChild(listNode);

    let creatorNode = document.createElement('li');
    creatorNode.setAttribute("class", "list-group-item");
    let nameNode = document.createElement('span');
    nameNode.innerText = data.contributor.name;
    contributor_name = data.contributor.email;
    creatorNode.innerText = "Create by: ";
    creatorNode.appendChild(nameNode);
    const button = document.createElement('button');
    button.style = 'margin-left: 30px';
    if (!data.contributor.is_followed) {
        button.innerHTML = 'Follow';
        button.addEventListener('click', FollowAuthor);
    } else {
        button.innerHTML = 'Unfollow';
        button.addEventListener('click', UnFollowAuthor);
    }
    creatorNode.appendChild(button);
    listNode.appendChild(creatorNode);

    let rateNode = document.createElement('li');
    rateNode.setAttribute("class", "list-group-item");
    let numNode = document.createElement('span');
    numNode.innerText = data.rate;
    rateNode.innerText = "Rate: ";
    rateNode.appendChild(numNode);
    let makeRate = document.createElement('div');
    makeRate.innerText = "Select your rate: "
    let selectNode = document.createElement('select');
    selectNode.setAttribute("id", "selectRate");
    makeRate.appendChild(selectNode);
    let option1 = document.createElement('option');
    option1.setAttribute("value", "1");
    option1.innerText = "1";
    selectNode.appendChild(option1);
    let option2 = document.createElement('option');
    option2.setAttribute("value", "2");
    option2.innerText = "2";
    selectNode.appendChild(option2);
    let option3 = document.createElement('option');
    option3.setAttribute("value", "3");
    option3.innerText = "3";
    selectNode.appendChild(option3);
    let option4 = document.createElement('option');
    option4.setAttribute("value", "4");
    option4.innerText = "4";
    selectNode.appendChild(option4);
    let option5 = document.createElement('option');
    option5.setAttribute("value", "5");
    option5.innerText = "5";
    selectNode.appendChild(option5);
    let submitBtn = document.createElement('button');
    submitBtn.setAttribute("style", "margin-left: 5px;")
    submitBtn.innerText = 'Submit';
    makeRate.appendChild(submitBtn);
    rateNode.appendChild(makeRate);
    listNode.appendChild(rateNode);

    submitBtn.onclick = function () {
        sendRate(Number(selectNode.value), data.recipe_name);
    }


    let linkNode = document.createElement('li');
    linkNode.setAttribute("class", "list-group-item");
    linkNode.innerText = "More details: "
    let addrNode = document.createElement('a');
    addrNode.setAttribute("href", "//" + data.external_link);
    addrNode.setAttribute("target", "_blank");
    addrNode.setAttribute("class", "card-link");
    addrNode.innerText = "External_Link";
    linkNode.appendChild(addrNode);
    listNode.appendChild(linkNode);

    let cardTextNode = document.createElement('p');
    cardTextNode.setAttribute("class", "card-text");
    let string = ""
    for (let j = 0;j < data.ingredients.length;j++)
    {
        if (j != data.ingredients.length - 1)
        {
            string = string + data.ingredients[j] + ", ";
        }
        else
        {
            string = string + data.ingredients[j];
        }
    }
    cardTextNode.innerText = "Ingredients: " + string;
    cardBodyNode.appendChild(cardTextNode);

    // commentBox
    let commentBox = document.createElement('div');
    commentBox.setAttribute("class", "card-commentBox");
    commentBox.setAttribute("id", "CommentBox");
    let commentTitle = document.createElement('h5');
    commentTitle.setAttribute("class", "card-commentTitle");
    commentTitle.innerText = "Comments:";
    commentBox.appendChild(commentTitle);
    for (let n = 0;n < data.comments.length;n++)
    {
        let userName = data.comments[n].split(":")[0];
        let text = data.comments[n].split(":")[1];

        let commentNode = document.createElement('div');
        commentNode.setAttribute("class", "card-comment");
        commentNode.setAttribute("style", "margin: 0px 13px;");
        let userNameNode = document.createElement('span');
        userNameNode.innerText = userName;
        let textNode = document.createElement('span');
        textNode.innerText = ": " + text;
        commentNode.appendChild(userNameNode);
        commentNode.appendChild(textNode);
        let replyEnter = document.createElement('input');
        replyEnter.setAttribute("style", "margin-left: 5px;");
        replyEnter.setAttribute("placeholder", "reply user here");
        commentNode.appendChild(replyEnter);
        let replyNode = document.createElement('button');
        replyNode.setAttribute("style", "margin-left: 5px;")
        replyNode.innerText = "Reply";
        commentNode.appendChild(replyNode);
        commentBox.appendChild(commentNode);

        replyNode.onclick = function() {
            let replyContent = "reply@" + userName + " " + replyEnter.value;
            getUserName(replyContent, data.recipe_name);

        }
    }
    if (data.comments.length != 0)
    {
        cardNode.appendChild(commentBox);
    }

    let commentTypeBox = document.createElement('div');
    commentTypeBox.setAttribute("class", "card-commentTypeBox");
    commentTypeBox.setAttribute("style", "display: flex; flex-direction: column; justify-content: center; align-items: center;");
    let commentType = document.createElement('textarea');
    commentType.setAttribute("class", "card-commentType");
    commentType.setAttribute("rows", "4");
    commentType.setAttribute("placeholder", "type your comment for recipe here");
    commentType.setAttribute("style", "width: 60%; margin-top: 5px;");
    commentTypeBox.appendChild(commentType);
    let commentButtonArea = document.createElement('div');
    commentButtonArea.setAttribute("style", "text-align:center");
    let commentButton = document.createElement('button');
    commentButton.innerText = "add comment";
    commentButtonArea.appendChild(commentButton);
    commentTypeBox.appendChild(commentButtonArea);
    cardNode.appendChild(commentTypeBox);

    commentButton.onclick = function() {
        let comment = commentType.value;
        getUserName(comment, data.recipe_name);
    }
    let nodeO = document.createElement('div');
    nodeO.setAttribute("class", "modal-footer");
    nodeC.appendChild(nodeO);
    let nodeP = document.createElement('button');
    nodeP.setAttribute("type", "button");
    nodeP.setAttribute("class", "btn btn-secondary");
    nodeP.setAttribute("data-bs-dismiss", "modal");
    nodeP.innerText = "Close";
    nodeO.appendChild(nodeP);

    let myProfileModal2 = new bootstrap.Modal(nodeA, {keyboard: true});
    myProfileModal2.show();

}

function FollowAuthor() {
    var name = contributor_name;
    const resource = `http://localhost:${BACKEND_PORT}/user/personal`;
    const requestBody = {
        item: name,
        email: user_email,
        action: 'follow'
    };
    console.log(requestBody);
    const init = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };
    fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            console.log(data);
            alert('You have follow the contributor'); 
        }
    }).catch((err) => {
        alert(err);
    });
}

function UnFollowAuthor() {
    var name = contributor_name;
    const resource = `http://localhost:${BACKEND_PORT}/user/personal`;
    const requestBody = {
        item: name,
        email: user_email,
        action: 'follow'
    };
    const init = {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };
    fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            console.log(data);
            alert('You have unfollowed the contributor')    
        }
    }).catch((err) => {
        alert(err);
    });
    if (document.getElementById('listHeader').innerHTML.includes('Following')) {
        document.getElementById('searchIngredient').remove();
    }
}

function LikeRecipes() {
    var name = document.getElementsByClassName('card-title')[document.getElementsByClassName('card-title').length-1].innerHTML.split('<');
    const resource = `http://localhost:${BACKEND_PORT}/user/personal`;
    const requestBody = {
        item: name[0],
        email: user_email,
        action: 'favourite'
    };
    const init = {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };
    fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            console.log(data);
            alert('Has removed changes to the recipe carried I like')   
        }
    }).catch((err) => {
        alert(err);
    });
}

function LikeRecipe() {
    var name = document.getElementsByClassName('card-title')[document.getElementsByClassName('card-title').length-1].innerHTML.split('<');
    const resource = `http://localhost:${BACKEND_PORT}/user/personal`;
    const requestBody = {
        item: name[0],
        email: user_email,
        action: 'favourite'
    };
    const init = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };
    fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            console.log(data);
            alert('Has added changes to the recipe carried I like')    
        }
    }).catch((err) => {
        alert(err);
    });
}

function removeRecipe(recipeName) {
    const resource = `http://localhost:${BACKEND_PORT}/upload/recipe`;

    const requestBody = {
        name: recipeName
    };

    const init = {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };

    fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            alert("The system have deleted your recipe success!"); 
        }
    }).catch((err) => {
        alert(err);
    })
}

function editRecipe(newIngre, newLink, recipeName) {
    const resource = `http://localhost:${BACKEND_PORT}/user/recipes`;

    const inlist = document.getElementsByClassName('btn-check');
    const l1 = newIngre.split(',');
    var l2 = [];
    for (var i = 0; i < inlist.length; i++) {
        l2.push(inlist[i].id);
    }
    for (var i = 0; i < l1.length; i++) {
        if (!l2.includes(l1[i])) {
            alert('The ingredients you entered do not exist');
            return;
        }
    }
    const requestBody = {
        ingredients: newIngre,
        link: newLink,
        name: recipeName,
    };

    const init = {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };

    fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            alert("edit recipe success!"); 
        }
    }).catch((err) => {
        alert(err);
    })
}


document.getElementById("myupload").addEventListener('click', getMyUpload);
function getMyUpload() {
    const resource = `http://localhost:${BACKEND_PORT}/user/recipes`;

    const requestBody = {
        email: user_email
    };

    const init = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };

    fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            console.log(data);
            createMyUploadNode(data);      
        }
    }).catch((err) => {
        alert(err);
    })
}


function createMyUploadNode(data)
{
    let nodeA = document.createElement('div');
    nodeA.setAttribute("class", "modal fade");
    nodeA.setAttribute("id", `myUploadModal`);
    nodeA.setAttribute("tabindex", "-1");
    nodeA.setAttribute("aria-labelledby", "exampleModalLabel");
    nodeA.setAttribute("aria-hidden", "true");

    let nodeB = document.createElement('div');
    nodeB.setAttribute("class", "modal-dialog");
    nodeA.appendChild(nodeB);

    let nodeC = document.createElement('div');
    nodeC.setAttribute("class", "modal-content");
    nodeB.appendChild(nodeC);

    let nodeD = document.createElement('div');
    nodeD.setAttribute("class", "modal-header");
    nodeC.appendChild(nodeD);

    let closeButton = document.createElement('button')
    closeButton.setAttribute("type", "button")
    closeButton.setAttribute("class", "btn-close")
    closeButton.setAttribute("data-bs-dismiss", "modal")
    closeButton.setAttribute("aria-label", "Close")
    nodeD.appendChild(closeButton)

    let nodeF = document.createElement('div');
    nodeF.setAttribute("class", "modal-body");
    nodeC.appendChild(nodeF);

    let cardNode = document.createElement('div');
    cardNode.setAttribute("class", "card");
    cardNode.setAttribute("style", "width: 30rem;");
    nodeF.appendChild(cardNode)

    let cardBodyNode = document.createElement('div');
    cardBodyNode.setAttribute("class", "card-body");
    cardNode.appendChild(cardBodyNode);

    let cardTitleNode = document.createElement('h5');
    cardTitleNode.setAttribute("class", "card-title");
    cardTitleNode.innerText = "My Upload Recipe";
    cardBodyNode.appendChild(cardTitleNode);

    let listNode = document.createElement('ul');
    listNode.setAttribute("class", "list-group list-group-flush");
    listNode.setAttribute("id", "nameList");
    cardBodyNode.appendChild(listNode);

    for (let j = 0;j < data.recipeNames.length;j++)
    {
        let recipeNode = document.createElement('li');
        recipeNode.setAttribute("class", "list-group-item");
        recipeNode.setAttribute("id", data.recipeNames[j]);
        recipeNode.innerText = data.recipeNames[j];
        listNode.appendChild(recipeNode);

        let deleteButton = document.createElement('button');
        deleteButton.innerText = "Delete";
        deleteButton.setAttribute("type", "button");
        deleteButton.setAttribute("class", "btn btn-primary");
        recipeNode.appendChild(deleteButton);
        deleteButton.onclick = function () {
            let father = document.getElementById("nameList");
            let son = document.getElementById(data.recipeNames[j]);
            father.removeChild(son);
            removeRecipe(data.recipeNames[j]);
        }

        let editButton = document.createElement('button');
        editButton.innerText = "Edit";
        editButton.setAttribute("type", "button");
        editButton.setAttribute("class", "btn btn-success");
        recipeNode.appendChild(editButton);
        editButton.onclick = function () {
            let NodeB = document.createElement('div');
            NodeB.setAttribute("class", "modal-dialog");
            nodeA.appendChild(NodeB);

            let NodeC = document.createElement('div');
            NodeC.setAttribute("class", "modal-content");
            NodeB.appendChild(NodeC);

            let NodeD = document.createElement('div');
            NodeD.setAttribute("class", "modal-header");
            NodeC.appendChild(NodeD);

            let CloseButton = document.createElement('button');
            CloseButton.setAttribute("type", "button");
            CloseButton.setAttribute("class", "btn-close");
            CloseButton.setAttribute("data-bs-dismiss", "modal");
            CloseButton.setAttribute("aria-label", "Close");
            NodeD.appendChild(CloseButton);

            let NodeF = document.createElement('div');
            NodeF.setAttribute("class", "modal-body");
            NodeC.appendChild(NodeF);

            let NodeG = document.createElement('div');
            NodeG.setAttribute("class", "mb-3");
            NodeF.appendChild(NodeG);
            let NodeH = document.createElement('span');
            NodeH.innerText = "Modify Ingredients: ";
            let NodeI = document.createElement('input');
            NodeI.setAttribute("type", "text");
            NodeI.setAttribute("id", "fixed_ingredients");
            NodeG.appendChild(NodeH);
            NodeG.appendChild(NodeI);
            
            let NodeJ = document.createElement('div');
            NodeJ.setAttribute("class", "mb-3");
            NodeF.appendChild(NodeJ);
            let NodeK = document.createElement('span');
            NodeK.innerText = "Modify Recipe Link: ";
            let NodeL = document.createElement('input');
            NodeL.setAttribute("type", "text");
            NodeL.setAttribute("id", "fixed_link");
            NodeJ.appendChild(NodeK);
            NodeJ.appendChild(NodeL);

            let NodeM = document.createElement('div');
            NodeM.setAttribute("class", "modal-footer");
            NodeC.appendChild(NodeM);

            let NodeN = document.createElement('button')
            NodeN.innerText = "Close"
            NodeN.setAttribute("type", "button")
            NodeN.setAttribute("class", "btn btn-secondary")
            NodeN.setAttribute("data-bs-dismiss", "modal")
            NodeM.appendChild(NodeN)

            let NodeO = document.createElement('button')
            NodeO.innerText = "Save"
            NodeO.setAttribute("type", "button")
            NodeO.setAttribute("class", "btn btn-secondary")
            NodeO.setAttribute("data-bs-dismiss", "modal")
            NodeM.appendChild(NodeO)
            NodeO.onclick = function () {
                let new_ingre = document.getElementById('fixed_ingredients').value;
                let new_link = document.getElementById('fixed_link').value;
                editRecipe(new_ingre, new_link, data.recipeNames[j]);
            }
        }
    }

    let nodeO = document.createElement('div');
    nodeO.setAttribute("class", "modal-footer");
    nodeC.appendChild(nodeO);
    let nodeP = document.createElement('button');
    nodeP.setAttribute("type", "button");
    nodeP.setAttribute("class", "btn btn-secondary");
    nodeP.setAttribute("data-bs-dismiss", "modal");
    nodeP.innerText = "Close";
    nodeO.appendChild(nodeP);

    let myProfileModal2 = new bootstrap.Modal(nodeA, {keyboard: true});
    myProfileModal2.show();
}

document.getElementById('history').addEventListener('click', historybutton);
async function historybutton() {
    var recipes = '';
    const resource = `http://localhost:${BACKEND_PORT}/user/personal?email=${user_email}&action=explore`;
    await fetch(resource).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            recipes = data;
        }
    }).catch((err) => {
        alert(err);
    });
    addHtml('History', 'GetRecipes');
    var list = [];
    for (var i = 0; i < recipes.length; i++) {
        if (!list.includes(recipes[i])) {
            list.push(recipes[i]);
            const body = document.getElementById('searchList');
            var button = document.createElement('button');
            button.innerHTML = recipes[i];
            button.style = 'margin-left: 220px; margin-top: 10px';
            button.value = recipes[i];
            button.addEventListener('click', ()=>checkRecipe(event));
            body.append(button);
        }
    }
}

function checkRecipe(e) {
    const recipeName = e.target.value;
    const resource = `http://localhost:${BACKEND_PORT}/search/by_name`;

    const requestBody = {
        name: recipeName,
        email: user_email
    };
    const init = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };
    fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            createRecipeNode(data);      
        }
    }).catch((err) => {
        alert(err);
    })
}

document.getElementById('favority').addEventListener('click', favoritybutton);
async function favoritybutton() {
    var recipes = '';
    const resource = `http://localhost:${BACKEND_PORT}/user/personal?email=${user_email}&action=favourite`;
    await fetch(resource).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            recipes = data;
        }
    }).catch((err) => {
        alert(err);
    });
    addHtml('Favority', 'GetRecipes');
    var list = [];
    for (var i = 0; i < recipes.length; i++) {
        if (!list.includes(recipes[i])) {
            list.push(recipes[i]);
            const body = document.getElementById('searchList');
            var button = document.createElement('button');
            button.innerHTML = recipes[i];
            button.style = 'margin-left: 220px; margin-top: 10px';
            button.value = recipes[i];
            button.addEventListener('click', ()=>checkRecipe(event));
            body.append(button);
        }
    }
}

document.getElementById('myfollow').addEventListener('click', myfollowbutton);
async function myfollowbutton() {
    var recipes = '';
    const resource = `http://localhost:${BACKEND_PORT}/user/personal?email=${user_email}&action=follow`;
    await fetch(resource).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            console.log(data);
            recipes = data;
        }
    }).catch((err) => {
        alert(err);
    });
    addHtml('Following Contributors', 'GetRecipes');
    var list = [];
    for (var i = 0; i < recipes.length; i++) {
        if (!list.includes(recipes[i])) {
            list.push(recipes[i]);
            var name = '';
            var url = `http://localhost:${BACKEND_PORT}/mark/comment?email=${recipes[i]}`;
            await fetch(url).then((response) => {
                return response.json();
            }).then((data) => {
                if (data.error) {
                    alert(data.error);
                    return;
                } else {
                    name = data;
                }
            }).catch((err) => {
                alert(err);
            });
            const body = document.getElementById('searchList');
            var button = document.createElement('button');
            button.innerHTML = name;
            button.style = 'margin-left: 220px; margin-top: 10px';
            button.value = recipes[i];
            button.addEventListener('click', ()=>checkContributor(event));
            body.append(button);
        }
    }
}

async function checkContributor(e) {
    const email = e.target.value;
    const contri = document.createElement('div');
    contri.className = 'modal-dialog';
    contri.id = 'contributorShow';
    const content = document.createElement('div');
    content.className = 'modal-content';
    const head = document.createElement('div');
    head.className = 'modal-header';
    const h = document.createElement('h5');
    h.className = 'modal-title';
    h.innerHTML = 'Contributors name';
    head.appendChild(h);
    const bu = document.createElement('button');
    bu.type = 'button';
    bu.style = 'margin-left:10px';
    bu.innerHTML = 'Follow';
    contributor_name = email;
    bu.addEventListener('click', UnFollowAuthor);
    head.appendChild(bu);
    const button = document.createElement('div');
    button.className = 'btn-close';
    button.type = 'button';
    button.addEventListener('click', function(e) {
        document.getElementById('contributorShow').remove();
    });
    head.append(button);
    content.appendChild(head);
    const body = document.createElement('div');
    body.className = 'modal-body';
    var list = [];
    const resource = `http://localhost:${BACKEND_PORT}/user/recipes`;
    const requestBody = {
        email: email
    };
    const init = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    };
    await fetch(resource, init).then((response) => {
        return response.json();
    }).then((data) => {
        if (data.error) {
            alert(data.error);
            return;
        } else {
            console.log(data);
            list = data.recipeNames; 
        }
    }).catch((err) => {
        alert(err);
    })
    for (var i = 0; i < list.length; i++) {
        var buttons = document.createElement('button');
        buttons.innerHTML = list[i];
        buttons.style = 'margin-left: 220px; margin-top: 10px';
        buttons.value = list[i];
        buttons.addEventListener('click', ViewDetail);
        body.appendChild(buttons);
    }
    content.appendChild(body);
    contri.appendChild(content);
    document.getElementById('searchIngredient').append(contri);
}

document.getElementById('SelectMealType').addEventListener('change', changeMealType);
function changeMealType() {
    if (Recipe_list !== '') {
        const type = document.getElementById('SelectMealType').value;
        const Recipes = document.getElementById('recipeList');
        Recipes.innerHTML = '';
        var num = 0;
        if (type === 'none') {
            for (var i = 0; i < Recipe_list.length; i++) {
                num += 1;
                SetRecipes(Recipe_list, i, Recipes);
            }
        }
        for (var i = 0; i < Recipe_list.length; i++) {
            if (Recipe_list[i].category === type) {
                num += 1;
                SetRecipes(Recipe_list, i, Recipes);
            }
        }
        document.getElementById('YouCanMakeRecipe').innerHTML = `You can make ${num} recipes`;
    }
}

function SetRecipes(Recipe_list, i, Recipes) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style = 'width: 18rem; margin-left: 10px';
    const body = document.createElement('div');
    body.className = 'card-body';
    body.innerHTML = `<h5 class="card-title">${Recipe_list[i].name}</h5><p2>Rate: ${Recipe_list[i].rate}</p2>`;
    const text = document.createElement('p');
    text.className = 'card-text';
    if (Recipe_list[i].missing !== null) {
        text.innerHTML = `You lack ${Recipe_list[i].missing}`;
        text.style = 'color: red';
    } else {
        text.innerHTML = `You have ${Recipe_list[i].n_ingredients} ingredients`;
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.style = 'float:right';
    button.setAttribute('value', Recipe_list[i].name);
    button.innerHTML = 'View details';
    button.addEventListener('click', ()=>ViewDetail(event));
    body.appendChild(text);
    body.appendChild(button);
    card.appendChild(body);
    Recipes.append(card);

    const a = document.getElementById('RecommendIngredient');
    a.innerHTML = '';
    if (Recipe_list[i].missing !== null) {
        const ingre = document.createElement('input');
        ingre.type = 'checkbox';
        ingre.className = 'btn-check';
        ingre.id = Recipe_list[i].missing;
        ingre.autocomplete = 'off';
        a.append(ingre);
        const label = document.createElement('label');
        label.className = 'btn btn-outline-primary';
        label.setAttribute('for', Recipe_list[i].missing);
        label.setAttribute('style', 'margin-left: 10px; margin-top: 5px');
        label.innerHTML = Recipe_list[i].missing;
        a.append(label);
    }
}