/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setError(null);
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (error === null) {
      return;
    }

    setTimeout(() => {
      setError(null);
    }, 3000);
  }, [error]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  let visibleTodos = todos;

  if (filter === 'active') {
    visibleTodos = todos.filter(todo => !todo.completed);
  }

  if (filter === 'completed') {
    visibleTodos = todos.filter(todo => todo.completed);
  }

  if (filter === 'active') {
    visibleTodos = todos.filter(todo => !todo.completed);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Title should not be empty');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => {
              return (
                <div
                  data-cy="Todo"
                  className={classNames('todo', { completed: todo.completed })}
                  key={todo.id}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {todo.title}
                  </span>

                  {/* Remove button appears only on hover */}
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>

                  {/* overlay will cover the todo while it is being deleted or updated */}
                  <div data-cy="TodoLoader" className="modal overlay">
                    <div
                      className={'modal-background has-background-white-ter'}
                    />
                    <div className="loader" />
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: error === null },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );

  // return (
  //   <div className="todoapp">
  //     <h1 className="todoapp__title">todos</h1>

  //     <div className="todoapp__content">
  //       <header className="todoapp__header">
  //         {/* this button should have `active` class only if all todos are completed */}
  //         <button
  //           type="button"
  //           className="todoapp__toggle-all active"
  //           data-cy="ToggleAllButton"
  //         />

  //         {/* Add a todo on form submit */}
  //         <form>
  //           <input
  //             data-cy="NewTodoField"
  //             type="text"
  //             className="todoapp__new-todo"
  //             placeholder="What needs to be done?"
  //           />
  //         </form>
  //       </header>

  //       <section className="todoapp__main" data-cy="TodoList">
  //         {/* This is a completed todo */}
  //         <div data-cy="Todo" className="todo completed">
  //           <label className="todo__status-label">
  //             <input
  //               data-cy="TodoStatus"
  //               type="checkbox"
  //               className="todo__status"
  //               checked
  //             />
  //           </label>

  //           <span data-cy="TodoTitle" className="todo__title">
  //             Completed Todo
  //           </span>

  //           {/* Remove button appears only on hover */}
  //           <button type="button" className="todo__remove" data-cy="TodoDelete">
  //             ×
  //           </button>

  //           {/* overlay will cover the todo while it is being deleted or updated */}
  //           <div data-cy="TodoLoader" className="modal overlay">
  //             <div className="modal-background has-background-white-ter" />
  //             <div className="loader" />
  //           </div>
  //         </div>

  //         {/* This todo is an active todo */}
  //         <div data-cy="Todo" className="todo">
  //           <label className="todo__status-label">
  //             <input
  //               data-cy="TodoStatus"
  //               type="checkbox"
  //               className="todo__status"
  //             />
  //           </label>

  //           <span data-cy="TodoTitle" className="todo__title">
  //             Not Completed Todo
  //           </span>
  //           <button type="button" className="todo__remove" data-cy="TodoDelete">
  //             ×
  //           </button>

  //           <div data-cy="TodoLoader" className="modal overlay">
  //             <div className="modal-background has-background-white-ter" />
  //             <div className="loader" />
  //           </div>
  //         </div>

  //         {/* This todo is being edited */}
  //         <div data-cy="Todo" className="todo">
  //           <label className="todo__status-label">
  //             <input
  //               data-cy="TodoStatus"
  //               type="checkbox"
  //               className="todo__status"
  //             />
  //           </label>

  //           {/* This form is shown instead of the title and remove button */}
  //           <form>
  //             <input
  //               data-cy="TodoTitleField"
  //               type="text"
  //               className="todo__title-field"
  //               placeholder="Empty todo will be deleted"
  //               value="Todo is being edited now"
  //             />
  //           </form>

  //           <div data-cy="TodoLoader" className="modal overlay">
  //             <div className="modal-background has-background-white-ter" />
  //             <div className="loader" />
  //           </div>
  //         </div>

  //         {/* This todo is in loadind state */}
  //         <div data-cy="Todo" className="todo">
  //           <label className="todo__status-label">
  //             <input
  //               data-cy="TodoStatus"
  //               type="checkbox"
  //               className="todo__status"
  //             />
  //           </label>

  //           <span data-cy="TodoTitle" className="todo__title">
  //             Todo is being saved now
  //           </span>

  //           <button type="button" className="todo__remove" data-cy="TodoDelete">
  //             ×
  //           </button>

  //           {/* 'is-active' class puts this modal on top of the todo */}
  //           <div data-cy="TodoLoader" className="modal overlay is-active">
  //             <div className="modal-background has-background-white-ter" />
  //             <div className="loader" />
  //           </div>
  //         </div>
  //       </section>

  //       {/* Hide the footer if there are no todos */}
  //       <footer className="todoapp__footer" data-cy="Footer">
  //         <span className="todo-count" data-cy="TodosCounter">
  //           3 items left
  //         </span>

  //         {/* Active link should have the 'selected' class */}
  //         <nav className="filter" data-cy="Filter">
  //           <a
  //             href="#/"
  //             className="filter__link selected"
  //             data-cy="FilterLinkAll"
  //           >
  //             All
  //           </a>

  //           <a
  //             href="#/active"
  //             className="filter__link"
  //             data-cy="FilterLinkActive"
  //           >
  //             Active
  //           </a>

  //           <a
  //             href="#/completed"
  //             className="filter__link"
  //             data-cy="FilterLinkCompleted"
  //           >
  //             Completed
  //           </a>
  //         </nav>

  //         {/* this button should be disabled if there are no completed todos */}
  //         <button
  //           type="button"
  //           className="todoapp__clear-completed"
  //           data-cy="ClearCompletedButton"
  //         >
  //           Clear completed
  //         </button>
  //       </footer>
  //     </div>

  //     {/* DON'T use conditional rendering to hide the notification */}
  //     {/* Add the 'hidden' class to hide the message smoothly */}
  //     <div
  //       data-cy="ErrorNotification"
  //       className="notification is-danger is-light has-text-weight-normal"
  //     >
  //       <button data-cy="HideErrorButton" type="button" className="delete" />
  //       {/* show only one message at a time */}
  //       Unable to load todos
  //       <br />
  //       Title should not be empty
  //       <br />
  //       Unable to add a todo
  //       <br />
  //       Unable to delete a todo
  //       <br />
  //       Unable to update a todo
  //     </div>
  //   </div>
  // );
};
