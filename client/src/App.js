import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount(){
    this.socket = io();
    this.socket.connect("http://localhost:8000");
    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('removeTask', (taskId) => this.removeTask(taskId));
    this.socket.on('updateData', (tasks) => this.updateTasks(tasks));
  }

  addTask(task){
    this.state.tasks.push(task);
  }

  removeTask(id){
    let taskId = this.state.tasks.findIndex(id);
    this.state.tasks.splice(taskId, 1);
    this.socket.emit('removeTask', taskId);
  }

  submitForm(event){
    event.preventDefault();
    const task = {id: uuidv4(), name: this.state.taskName};
    this.addTask(task);
    this.socket.emit('addTask', task);
  }

  updateTasks(tasks){
    this.setState({
      ...this.state.tasks, // ?
      tasks: tasks,
    });
  }

  updateTaskName(event){
    this.setState({
      taskName: event.target.value,
    });
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map(task => (
              <li key={task.id} className="task">
                {task.name}
                <button className="btn btn--red" onClick={event => {
                  event.preventDefault();
                  this.removeTask(task.id);
                }}>Remove</button>
              </li>
            ))}
          </ul>

          <form id="add-task-form" onSubmit={() => this.submitForm}>
            <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name" /*zakomentowuje, bo nie moge wpisywac wartosci przy podanej value value={this.state.taskName}*/ onChange={() => this.updateTaskName} />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  };
};

export default App;