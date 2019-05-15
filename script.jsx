class List extends React.Component {
  render() {
      let list = this.props.list.map( (item, index) => {
        return <li key={ index }>{ item.task }</li>
      });

      return (
        <ul>
            { list }
        </ul>
      );
  }
}

class App extends React.Component {
  constructor() {
    super()
  }

  state = {
    list : [
        {
          "task": "Eat laksa",
          "done": false,
          "created_at": "31 Mar 2019, 2:44:28 am",
          "updated_at": ""
        },
        {
          "task": "Buy fruit juice",
          "done": false,
          "created_at": "31 Mar 2019, 6:44:28 am",
          "updated_at": ""
        }
    ]
  }

  submitHandler(e) {
    e.preventDefault();

    this.state.list.push({
        "task": e.target.elements.task.value,
        "done": "false",
        "created_at": moment().format('D MMMM YYYY, h:mm:ss a'),
        "updated_at": ""
    })

    this.setState({ list: this.state.list });
  }

  render() {
      // render the list with a map() here

      return (
        <div>
            <form onSubmit={ (e) => { this.submitHandler(e) } }>
              Task: <input name="task" type="text"/>
              <button type="submit">Add Item</button>
            </form>

            <br/>

            <h1>To Do List</h1>
            <List list = { this.state.list }/>
        </div>
      );
  }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);