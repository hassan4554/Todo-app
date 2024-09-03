import { MdOutlineDeleteForever } from "react-icons/md";
import { TiEdit } from "react-icons/ti";
import { v4 as uuidv4 } from 'uuid';
import { BiHide } from "react-icons/bi";
import { BiShowAlt } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import './App.css';

function App() {
  const [todo, setTodo] = useState("");
  const [arrTodo, setArrTodo] = useState([]);
  const [editIndex, setEditIndex] = useState(0);
  const [showFinished, setShowFinished] = useState(false);
  const addBtn = useRef(null);
  const saveBtn = useRef(null);
  const showBtn = useRef(null);
  const hideBtn = useRef(null);

  useEffect(() => {
    let todosString = localStorage.getItem('todos');

    if (todosString) {
      let todosJSON = JSON.parse(localStorage.getItem('todos'));
      setArrTodo(todosJSON);
    }
  }, [])

  useEffect(() => {
    if (arrTodo.length != 0) {
      const todosString = JSON.stringify(arrTodo);
      localStorage.setItem('todos', todosString);
    }
  }, [arrTodo]);


  const handleAdd = () => {
    setArrTodo([...arrTodo, { name: todo, isCompleted: false, id: uuidv4() }]);
    setTodo('');
  }

  const handleChange = (e) => {
    let newTodo = e.target.value;
    setTodo(newTodo);
  }

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = arrTodo.findIndex(t => {
      return t.id == id;
    });
    let newArrTodo = [...arrTodo];
    newArrTodo[index].isCompleted = !newArrTodo[index].isCompleted;
    setArrTodo(newArrTodo);
  }

  const handleEdit = (e, id) => {
    addBtn.current.style.display = 'none';
    saveBtn.current.style.display = 'block';
    let index = arrTodo.findIndex(item => {
      return item.id == id;
    });
    let editTodo = arrTodo[index];
    setTodo(editTodo.name);
    setEditIndex(index);
  }

  const handleDelete = (e, id) => {
    let newArr = arrTodo.filter(item => {
      return item.id != id;
    });
    setArrTodo(newArr);
    console.log(arrTodo);
  }

  const handleSave = () => {
    addBtn.current.style.display = 'block';
    saveBtn.current.style.display = 'none';
    arrTodo[editIndex].name = todo;
    arrTodo[editIndex].isCompleted = false;
    setTodo('');
  }

  const handleFinish = () => {
    if (!showFinished) {
      showBtn.current.style.display = 'none';
      hideBtn.current.style.display = 'block';
    }
    else {
      showBtn.current.style.display = 'block';
      hideBtn.current.style.display = 'none';
    }
    setShowFinished(!showFinished);
  }

  return (
    <>
      <nav className='navbar'>
        <h2>Taskly - </h2><p>manage your tasks</p>
        <div className="finish-btns">
          <button className="showFinished" ref={showBtn} onClick={handleFinish}><BiHide /></button>
          <button className="hideFinished" ref={hideBtn} onClick={handleFinish}><BiShowAlt /></button>
        </div>
      </nav>

      <div className="container">
        <div className="container-2">
          <h1 className='main-heading'>To-do List</h1>
          <p className="main-text">Stay organized and productive</p>
          <div className='task-adder'>
            <input type="text" value={todo} className='task-input' placeholder='Add a new task' onChange={handleChange} />
            <button className='add-btn' ref={addBtn} disabled={todo.length < 5} onClick={handleAdd}>Add</button>

            <button className='save-btn' ref={saveBtn} disabled={todo.length < 5} onClick={handleSave}>Save</button>
          </div>

          <div className="task-list">

            {
              arrTodo
                .filter(task => showFinished ? task.isCompleted : !task.isCompleted)
                .map((task) => {
                  return (
                    <div className="task" key={task.id}>
                      <input type="checkbox" name={task.id} checked={task.isCompleted} onChange={handleCheckbox} className="task-checkbox" />
                      <p className={task.isCompleted ? 'line-through task-text' : 'task-text'}>{task.name}</p>
                      <button className="edit-btn" onClick={(e) => handleEdit(e, task.id)} ><TiEdit /></button>
                      <button className="delete-btn" onClick={(e) => handleDelete(e, task.id)}><MdOutlineDeleteForever /></button>
                    </div>
                  )
                })
            }
          </div>
        </div>
      </div >
    </>
  )
}

export default App
