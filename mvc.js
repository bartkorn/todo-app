function Model(database) {

    this._todos = {};
    this._database = database;
    this._query = database.ref("todos").orderByKey();
    this._dataloaded = false;
    this._lastAddedResponse;

}

Model.prototype = {

    loadTodos: function(){
        var _this = this;
        this._query.once("value")
            .then(function(snapshot){
                snapshot.forEach(function(childSnapshot){
                    var key = childSnapshot.key;
                    var childData = childSnapshot.val();
                    _this._todos[key] = childData;
                });
                _this._dataloaded = true;
            });
    },
    addTodo: function(todo){
        var _this = this;
        this._lastAddedResponse = 0;
        this._database.ref('todos/'+ todo.timestamp).set({
            title: todo.title,
            description: todo.description,
            owner: todo.owner,
            category: todo.category,
            priority: todo.priority,
            created: todo.added.toString()
        }).then(function(){
            _this._lastAddedResponse = 1;
        }).catch(function(){
            _this._lastAddedResponse = 2;
        });
    },
    getTodos: function(){
        return this._todos;
    },
    orderByPriority: function(){
        var indexes = [];
        for(timestamp in this._todos){
            indexes.push(timestamp);
        }
        for(var i = 0; i < indexes.length; i++){
            for(var j = 0; j < indexes.length - 1; j++)
            {
                var temp = this._todos[indexes[j]];
                if(this._todos[indexes[j]].priority < this._todos[indexes[j+1]].priority){
                    this._todos[indexes[j]] = this._todos[indexes[j+1]];
                    this._todos[indexes[j+1]] = temp;
                }
            }
        }
    },
    filterPrivate: function(){
        var filtered = {};

        for(timestamp in this._todos)
        {
            if(this._todos[timestamp].category == "Private"){
                filtered[timestamp] = this._todos[timestamp];
            }
        }

        return filtered
    },
    dataLoaded: function(){
        return this._dataloaded;
    }
};

function View(parentNode){

    this._parentNode = parentNode;

}

View.prototype = {

    _renderTodo: function(todo){
        var panel = document.createElement('div');
        switch(todo.category){
            case "Private":
                panel.setAttribute('class', 'panel panel-default');
                break;
            case "Job":
                panel.setAttribute('class', 'panel panel-primary');
                break;
            case "Sport":
                panel.setAttribute('class', 'panel panel-info');
                break;
            case "Shopping":
                panel.setAttribute('class', 'panel panel-warning');
                break;
            case "Learning":
                panel.setAttribute('class', 'panel panel-success');
                break;
            default:
                panel.setAttribute('class', 'panel panel-default');
                break;
        };
        //to do cell
        var cell = document.createElement('div');
        cell.setAttribute('class', 'col-xs-12 col-sm-6 col-md-4');
        //panel heading
        var panel_heading = document.createElement('div');
        panel_heading.setAttribute('class', 'panel-heading');
        var panel_title = document.createElement('h3');
        panel_title.setAttribute('class','panel-title');
        var title = document.createTextNode("[" + todo.category + "] " + todo.title);
        panel_title.appendChild(title);
        panel_heading.appendChild(panel_title);
        //panel body
        var panel_body = document.createElement('div');
        panel_body.setAttribute('class','panel-body');
        var content = "<b>Description: </b>" + todo.description + "</br>" +
            "<b>Created: </b>" + todo.created + "</br>" +
            "<b>Owner: </b>" + todo.owner + "</br>";
        panel_body.innerHTML = content;

        panel.appendChild(panel_heading);
        panel.appendChild(panel_body);
        cell.appendChild(panel);
        this._parentNode.appendChild(cell);
    },
    render: function(todos){
        this._parentNode.innerHTML = '';
        for(var timestamp in todos){
            this._renderTodo(todos[timestamp]);
        }
    }
};

function Controller(view, model){

    this._view = view;
    this._model = model;
}

Controller.prototype = {

    loadData: function(){

        this._model.loadTodos();
        _this = this;
        var interval = setInterval(function(){
            if(_this._model.dataLoaded()){
                _this.renderTodos();
                clearInterval(interval);
            }
        },50);

    },
    renderTodos: function(option){

        if (option == 'sortPriority'){
            this._model.orderByPriority();
            this._view.render(this._model.getTodos());
        }
        else if (option == 'filterPrivate'){
            this._view.render(this._model.filterPrivate());
        }
        else{
            this._view.render(this._model.getTodos());
        }

    },
    addTodo: function(fields_data){
        var todo = new ToDo(
            fields_data.title,
            fields_data.owner,
            fields_data.description,
            fields_data.category,
            fields_data.priority,
            new Date()
        );
        this._model.addTodo(todo);
    }
};

document.addEventListener('DOMContentLoaded', function(){

    var config = {
        apiKey: "AIzaSyDq3UVYVdnDDEQpKfKjh0AQSoEa1S0YUPE",
        authDomain: "todo-app-1db3d.firebaseapp.com",
        databaseURL: "https://todo-app-1db3d.firebaseio.com",
        storageBucket: "todo-app-1db3d.appspot.com",
        messagingSenderId: "175395064195"
    };
    firebase.initializeApp(config);

    var model = new Model(firebase.database());
    var view = new View(document.getElementById('main'));
    var controller = new Controller(view, model);

    controller.loadData();

    var interval = setInterval(function(){

        if(controller._model.dataLoaded()){
            controller.renderTodos();
            clearInterval(interval);
        }
    },50);

    document.getElementById('add').addEventListener('click', function(event){

        controller.addTodo({
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            owner: document.getElementById("owner").value,
            category: document.getElementById("category").value,
            priority: document.getElementById("priority").value
        });

        var interval = setInterval(function(){

            if(controller._model._lastAddedResponse == 1){
                document.getElementById("addTodoSuccess").style.display = "block";
                clearInterval(interval)
            }
            if(controller._model._lastAddedResponse == 2){
                document.getElementById("addTodoWarning").style.display = "block";
                clearInterval(interval);
            }
        },50);

    });

    document.getElementById('refresh').addEventListener('click', function(){
        controller.loadData();
    });

    document.getElementById('sortPriority').addEventListener('click', function(){
        controller.renderTodos('sortPriority');
    });

    document.getElementById('filterPrivate').addEventListener('click', function(){
        controller.renderTodos('filterPrivate');
    });

});