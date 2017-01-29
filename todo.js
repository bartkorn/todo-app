
function ToDo (title, owner, description, category, priority, added){
    this.title = title;
    this.owner = owner;
    this.description = description;
    this.category = category;
    this.priority = priority;
    this.added = added;
    this.timestamp = added.getTime();
    this.status = "New";
    this.updateStatus = function(newStatus){
        this.status = newStatus;
    }
}