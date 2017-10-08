var todoList = {
	todos: [],

	addTodo: function (title) {
    if (title) {
      this.todos.push({
        title:title.trim(),
        completed:false,
        id: this.generateId()
      });
    }	
	},

  generateId: function () {
    return (Math.floor(Math.random() * 4294967296)).toString();
  },

  deleteTodo: function (id) {
    this.todos.forEach(function(element, index) {
      if (element.id === id) {
        todoList.todos.splice(index, 1);
      }  
    });
    view.displayTodos();
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
      if (event.which === 13) {
        todoList.addTodo($mainInput.val());
        view.displayTodos();  
      } else if (event.which === 27) {
        $(this).blur().val('');
      }
    });

    $mainInput.focusin(function() {
      $addButton.find('i').text('check');
    });

    $mainInput.focusout(function() {
      $addButton.find('i').text('add');
    });

    $('#todo-list').click(function(event) {
      $target = event.target;
      if ($($target).hasClass('icon-delete')) {
        todoList.deleteTodo($($target).parents('.todo').attr('id'));
      }
    });
  }
};

var view = {
  displayTodos: function () {
    var $mainInput = $('#main-input');
    var $ul = $('#todo-list');
    $ul.html('');

    todoList.todos.forEach(function(element, index) {
      var $li = document.createElement('li');
      var $xMark = document.createElement('span');
      var $deleteIcon = document.createElement('i');
      
      $($xMark).addClass('x-mark');
      $($deleteIcon).addClass('material-icons icon-delete');
      $($deleteIcon).text('delete');
      $($xMark).append($deleteIcon);
      $($li).text(element.title);
      $($li).append($xMark);
      $li.id = element.id;
      $($li).addClass('todo');
      $($ul).append($li);
    });
    $mainInput.val('');
  }
}

eventListeners.addListeners();