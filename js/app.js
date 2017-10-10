var storeAndLoad = {
  store: function (data) {
    localStorage.setItem('todos',JSON.stringify(data));
  },

  load: function () {
    var todos = JSON.parse(localStorage.getItem('todos'))
    if (todos) {
      return todos;
    } else {
      return []; 
    }
  }
}

var router = {
  init: function () {
    new Router({
      '/:filter': function (filter) {
        todoList.filter = filter;
        view.displayTodos();
      }
    }).init('/all');
  }
};

var todoList = {

  generateTodoId: function () {
    return (Math.floor(Math.random() * 4294967296)).toString();
  },

  // generateCheckboxId: function () {
  //   var checkboxID = 'check-';
  //   var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  //   for(var i = 0; i < 16; i++) {
  //     checkboxID += possible.charAt(Math.floor(Math.random() * possible.length));
  //   }
  //   return checkboxID;
  // },

   getIndexByID: function (id) {
    var result;

    this.todos.forEach(function (element, index) {
      if (element.id === id) {
        result = index;
      }  
    });

    return result;
  },

	addTodo: function (title) {
    if (title) {
      this.todos.push({
        title:title.trim(),
        completed:false,
        id: this.generateTodoId()
      });
    }

    view.displayTodos();
    $('#main-input').val('').focus();
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
    view.displayTodos();
  },

  isEverythingChecked: function (todos) {
    var allChecked;

    if (todos.length === 0) {
      allChecked = false;
    } else {
        allChecked = true;
        todos.forEach(function(element, index) {
          if (!element.completed) {
            allChecked = false;
            return;
          }
      });
    }

    if (allChecked) {
      $('#toggle-all').prop('checked', true);
    } else {
      $('#toggle-all').prop('checked', false);
    }
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

  getFilteredTodos: function () {
    if (this.filter === 'active') {
      return this.getActiveTodos();
    }

    if (this.filter === 'completed') {
      return this.getCompletedTodos();
    }

    return this.todos;
  },

  getActiveTodos: function () {
    return this.todos.filter(function(todo) {
      return !todo.completed;
    });
  },

  getCompletedTodos: function () {
    return this.todos.filter(function(todo) {
      return todo.completed;
    });
  }
};

var eventListeners = {
  addListeners: function () {
    var $mainInput = $('#main-input');
    var $addButton = $('#add-button');
    var $todoList = $('#todo-list');
    var $editInput = $('.edit-input');

    $mainInput.focusin(function() {
      $addButton.find('i').text('check');
    });

    $mainInput.focusout(function() {
      $addButton.find('i').text('add');
    });

    $mainInput.keyup(function(event) {
      if (event.which === 13) {
        todoList.addTodo($mainInput.val());  
      } else if (event.which === 27) {
        $(this).blur().val('');
      }
    });

    $addButton.click(function() {
      todoList.addTodo($mainInput.val());
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

    $todoList.on('keyup focusout', '.edit-input', function(event) {
      if (event.which === 13) {

        var id = $(this).parent().attr('id');
        var index = todoList.getIndexByID(id);

        if ($(this).val().trim()) {
          todoList.editTodo(index, $(this).val().trim());

        } else {
            todoList.deleteTodo(index);
        }
      } else if (event.type === 'focusout' || event.which === 27) {
          setTimeout(view.displayTodos, 100);
      }
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

    $('ul.filters').on('click', 'a', function(event) {
      $target = event.target;
      $('.filter-active').removeClass();
      $($target).addClass('filter-active')
    });
  }
};

var view = {
  displayTodos: function () {
    var todos = todoList.getFilteredTodos();
    var $mainInput = $('#main-input');
    var $ul = $('#todo-list');
    $ul.html('');


    var todoTemplate = Handlebars.compile($('#todo-template').html());
    $($ul).html(todoTemplate(todos));
    
    // todos.forEach(function(element, index) {
    //     $('.edit-input').val(element.title)
    // });



    // todos.forEach(function(element, index) {
    //   var id = element.id
    //   var $li = document.createElement('li');
    //   var $label = document.createElement('label');
    //   var $editInput = document.createElement('input');
    //   var $checkbox = document.createElement('input');
    //   var $actions = document.createElement('span');
    //   var $deleteIcon = document.createElement('i');
    //   var $editIcon = document.createElement('i');

    //   var $checkboxID = 'check-' +id;
    //   $($checkbox).attr({
    //     id: $checkboxID,
    //     type: 'checkbox',
    //     class: 'todo-checkbox'
    //   });

    //   if (element.completed) {
    //     $($checkbox).prop('checked', true);
    //   }

    //   $($label).attr('for', $checkboxID).text(element.title);
    //   $($deleteIcon).addClass('material-icons icon-delete').text('delete');
    //   $($editIcon).addClass('material-icons icon-edit').text('edit');
    //   $($actions).addClass('actions').append($editIcon).append($deleteIcon);

    //   $($editInput).addClass('edit-input hidden').val(element.title);
    //   $($li).append($checkbox).append($label).append($editInput).append($actions).addClass('todo');
    //   $li.id = id;
    //   $($ul).append($li);
    // });

    $mainInput.val('');
    todoList.isEverythingChecked(todos);
    $('#add-button').removeClass('hide');
    storeAndLoad.store(todoList.todos);
  },

  editMode: function (todo) {
    $todo = todo;
    $label = $($todo).find('label');
    var $save = document.createElement('i');
    var $actions = $($todo).find('.actions');

    $('#add-button').addClass('hide');
    $($todo).addClass('todo-editing');
    $($label).addClass('hidden');
    $($todo).find('.edit-input').removeClass('hidden').val($($label).text()).focus();
    $($todo).find('.icon-edit').addClass('hidden');
    $($todo).find('.icon-delete').addClass('hidden');

    $($save).addClass('material-icons icon-save').text('check_circle');
    $($actions).append($save);
  }
};

todoList.todos = storeAndLoad.load();
router.init();
eventListeners.addListeners();