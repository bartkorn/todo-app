document.addEventListener('DOMContentLoaded', function(){

    var todos = {};

    var queryDatabase = function(){
        var query = firebase.database().ref("todos").orderByKey();
        query.once("value")
            .then(function(snapshot) {
                todos = {};
                snapshot.forEach(function(childSnapshot) {
                    var key = childSnapshot.key;
                    var childData = childSnapshot.val();
                    todos[key] = childData;
                });

                addTodoItems(todos);
            });
    };

    var addTodoItems = function(todos){
        for(timestamp in todos){
            var panel = document.createElement('div');
            switch(todos[timestamp].category){
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
            }

            var cell = document.createElement('div');
            cell.setAttribute('class', 'col-xs-12 col-sm-6 col-md-4');

            var panel_heading = document.createElement('div');
            panel_heading.setAttribute('class', 'panel-heading');

            var panel_title = document.createElement('h3');
            panel_title.setAttribute('class','panel-title');
            var title = document.createTextNode("[" + todos[timestamp].category + "] " + todos[timestamp].title);
            panel_title.appendChild(title);
            panel_heading.appendChild(panel_title);

            var panel_body = document.createElement('div');
            panel_body.setAttribute('class','panel-body');

            var content = "<b>Description: </b>" + todos[timestamp].description + "</br>" +
                          "<b>Created: </b>" + todos[timestamp].created + "</br>" +
                          "<b>Owner: </b>" + todos[timestamp].owner + "</br>";
            panel_body.innerHTML = content;


            panel.appendChild(panel_heading);
            panel.appendChild(panel_body);
            cell.appendChild(panel);
            document.getElementById("main").appendChild(cell);

        }
    };

    document.getElementById("refresh").addEventListener('click', function(){
        document.getElementById("main").innerHTML = '';
        queryDatabase();
    });

    document.getElementById("filterPrivate").addEventListener('click', function(event){
        event.preventDefault();
        var filtered = {};

        for(timestamp in todos)
        {
            if(todos[timestamp].category == "Private"){
                filtered[timestamp] = todos[timestamp];
            }
        }
        document.getElementById("main").innerHTML = '';
        addTodoItems(filtered);
    });

    document.getElementById("sortPriority").addEventListener('click', function(event){
        event.preventDefault();
        var indexes = [];
        for(timestamp in todos){
            indexes.push(timestamp);
        }
        for(var i = 0; i < indexes.length; i++){
            for(var j = 0; j < indexes.length - 1; j++)
            {
                var temp = todos[indexes[j]];
                if(todos[indexes[j]].priority < todos[indexes[j+1]].priority){
                    todos[indexes[j]] = todos[indexes[j+1]];
                    todos[indexes[j+1]] = temp;
                }
            }
        }
        console.log(todos);
        document.getElementById("main").innerHTML = '';
        addTodoItems(todos);

    });


    queryDatabase();
});