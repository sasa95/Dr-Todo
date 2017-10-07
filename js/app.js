var todoList = {
	todos: [],

	addTodo: function (title) {
    if (title) {}
		this.todos.push({
			title:title.trim(),
			completed:false,
      id: this.generateId()
		});
	},

  generateId: function () {
    return Math.floor(Math.random() * 4294967296);
  }
};

var eventListeners = {
  addListeners: function () {
    var $mainInput = $('#main-input');
    var $addButton = $('#add-button');

    $addButton.click(function() {
      todoList.addTodo($mainInput.val());
      $mainInput.val('').focus();
      view.displayTodos();
    });

    $mainInput.keyup(function(event) {
      if (event.which == 13) {
        todoList.addTodo($mainInput.val());
        view.displayTodos();  
      }
    });

    $mainInput.focusin(function() {
      $addButton.find('i').text('check');
    });

     $mainInput.focusout(function() {
      $addButton.find('i').text('add');
    });
  }
};

var view = {
  displayTodos: function () {
    var $mainInput = $('#main-input');
    var $ul = $('#todos');
    $ul.html('');
    todoList.todos.forEach(function(element, index) {
      var $li = document.createElement('li');
      $li.textContent = element.title;
      $ul.append($li);
    });
    $mainInput.val('');
  }
}

eventListeners.addListeners();
$('#main-input').focus();
