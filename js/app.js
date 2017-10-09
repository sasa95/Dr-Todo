var todoList = {
	todos: [],

	addTodo: function (title) {
    if (title) {
      this.todos.push({
        title:title.trim(),
        completed:false,
        id: this.generateTodoId()
      });
    }	
	},

  generateTodoId: function () {
    return (Math.floor(Math.random() * 4294967296)).toString();
  },

  generateCheckboxId: function () {
    var checkboxID = 'check-';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for(var i = 0; i < 16; i++) {
      checkboxID += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return checkboxID;
  },

  deleteTodo: function (index) {
    todoList.todos.splice(index, 1);
    view.displayTodos();
  },

  editTodo: function (index, title) {
    this.todos[index].title = title;
    view.displayTodos();
  },

  toggleCompleted: function (index) {
    this.todos[index].completed = !this.todos[index].completed;
    var allChecked = this.isEverythingChecked();
    if (allChecked) {
      $('#toggle-all').prop('checked', true);
    } else {
      $('#toggle-all').prop('checked', false);
    }
    view.displayTodos();
  },

  toggleAll: function (isChecked) {
    if (isChecked) {
      this.todos.forEach(function(element, index) {
        element.completed = true;
      });
    } else {
       this.todos.forEach(function(element, index) {
        element.completed = false;
      });
    }
    view.displayTodos();
  },

  isEverythingChecked: function () {
    var allChecked = true;
    this.todos.forEach(function(element, index) {
      if (!element.completed) {
        allChecked = false;
        return;
      }
    });
    return allChecked;
  },

  getIndexByID: function (id) {
    var result;
    this.todos.forEach(function (element, index) {
      if (element.id === id) {
        result = index;
      }  
    });
    return result;
  }
};

var eventListeners = {
  addListeners: function () {
    var $mainInput = $('#main-input');
    var $addButton = $('#add-button');
    var $todoList = $('#todo-list');
    var $editInput = $('.edit-input');

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


    $todoList.on('click', function(event) {
      $target = event.target;
      if ($($target).hasClass('icon-delete')) {
        var id = $($target).parents('.todo').attr('id');
        var index = todoList.getIndexByID(id);
        todoList.deleteTodo(index);
      } 

      else if ($($target).hasClass('icon-edit')) {
        view.editMode($($target).parents('.todo'));
      }

      else if ($($target).hasClass('icon-save')) {
        var $todo = $($target).parents('.todo');
        var $id = $($todo).attr('id');
        var $editInputText = $($todo).find('.edit-input').val();
        var index = todoList.getIndexByID($id);
        todoList.editTodo(index, $editInputText);
      }
    });

    $todoList.on('keyup', '.edit-input', function(event) {
      if (event.which === 13) {

        var id = $(this).parent().attr('id');
        var index = todoList.getIndexByID(id);

        if ($(this).val().trim()) {
          todoList.editTodo(index, $(this).val().trim());

        } else {
            todoList.deleteTodo(index);
        }
      } else if (event.which === 27) {
          view.displayTodos();
      }
    });

    $todoList.on('focusout', '.edit-input', function(event) {
      setTimeout(view.displayTodos, 100);
    });

    $todoList.on('change', '.todo-checkbox', function(event) {
      $todo = $(this).parent();
      $todoId = $($todo).attr('id');
      $index = todoList.getIndexByID($todoId);
      todoList.toggleCompleted($index);
    });

    $('#toggle-all').on('change', function() {
      $isChecked = $(this).is(':checked');
      todoList.toggleAll($isChecked);
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
      var $label = document.createElement('label');
      var $editInput = document.createElement('input');
      var $checkbox = document.createElement('input');
      var $actions = document.createElement('span');
      var $deleteIcon = document.createElement('i');
      var $editIcon = document.createElement('i');

      var $checkboxID = todoList.generateCheckboxId();
      $($checkbox).attr({
        id: $checkboxID,
        type: 'checkbox',
        class: 'todo-checkbox'
      });

      if (element.completed) {
        $($checkbox).prop('checked', true);
      }

      $($label).attr('for', $checkboxID).text(element.title);

      $($deleteIcon).addClass('material-icons icon-delete').text('delete');
      $($editIcon).addClass('material-icons icon-edit').text('edit');
      $($actions).addClass('actions').append($editIcon).append($deleteIcon);

      
      $($editInput).addClass('edit-input hidden').val(element.title);
      $($li).append($checkbox).append($label).append($editInput).append($actions).addClass('todo');
      $li.id = element.id;
      $($ul).append($li);
    });
    $mainInput.val('');
    $('#add-button').removeClass('hide');

  },

  editMode: function (todo) {
    $todo = todo;
    var $save = document.createElement('i');
    var $actions = $($todo).find('.actions');
    $('#add-button').addClass('hide');
    $($(todo)).addClass('todo-editing');
    $($todo).find('label').addClass('hidden');
    $($todo).find('.edit-input').removeClass('hidden').focus();
    $($todo).find('.icon-edit').addClass('hidden');
    $($todo).find('.icon-delete').addClass('hidden');

    $($save).addClass('material-icons icon-save').text('check_circle');
    $($actions).append($save);

  }
};

eventListeners.addListeners();