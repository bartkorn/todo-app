document.addEventListener('DOMContentLoaded', function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDq3UVYVdnDDEQpKfKjh0AQSoEa1S0YUPE",
        authDomain: "todo-app-1db3d.firebaseapp.com",
        databaseURL: "https://todo-app-1db3d.firebaseio.com",
        storageBucket: "todo-app-1db3d.appspot.com",
        messagingSenderId: "175395064195"
    };
    firebase.initializeApp(config);

    document.getElementById("add").addEventListener('click', function(event){
        var title = document.getElementById("title").value;
        var description = document.getElementById("description").value;
        var owner = document.getElementById("owner").value;
        var category = document.getElementById("category").value;
        var priority = document.getElementById("priority").value;
        var created = new Date();
        var timestamp = created.getTime();

        firebase.database().ref('todos/' + timestamp).set({
            title: title,
            description: description,
            owner: owner,
            category: category,
            priority: priority,
            created: created.toString()
        })
            .then(function() {
                //$('#confirmationModal').modal();
                document.getElementById("addTodoSuccess").style.display = "block";
        })
            .catch(function(error) {
                document.getElementById("addTodoWarning").style.display = "block";
            });
    });
});

function closeSuccessMessage(){
    document.getElementById("addTodoSuccess").style.display = "none";
}

function closeWarningMessage(){
    document.getElementById("addTodoWarning").style.display = "none";
}
