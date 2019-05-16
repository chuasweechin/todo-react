class ToDoItem extends React.Component {
    render() {
        return (
            <div className="toDoItemCard">
                <label>
                    <input type="checkbox"
                        id={ this.props.item.id }
                        onChange={ (e) => { this.props.markTaskHandler(e) } }
                        checked = { this.props.item.done }
                    />
                </label>
                { this.props.item.task }
            </div>
        );
    }
}


class ItemList extends React.Component {
    render() {
        let completion_dates = [...new Set(this.props.list
                                            .filter((item) => {
                                                return item.done === false;
                                            })
                                            .map((x) => {
                                                return x.target_completion;
                                            })
                                )];

        let outstandingTask = completion_dates.sort().map( (date, index) => {
            let task = this.props.list
                        .filter( (item) => {
                            return item.target_completion === date && item.done === false
                        })
                        .map( (item) => {
                            return (
                                <ToDoItem markTaskHandler={ (e) => { this.props.markTaskHandler(e) } }
                                    item = { item } />
                            );
                        });

            return (
                <React.Fragment>
                    <h6>{ task.length } outstanding task for { date }</h6>
                    { task }
                    <br/>
                </React.Fragment>
            );
        });

        let completedTask = this.props.list
            .filter( (item) => {
                return item.done === true;
            })
            .map( (item, innerIndex) => {
                return (
                    <ToDoItem markTaskHandler={ (e) => { this.props.markTaskHandler(e) } }
                        item = { item } />
                );
            });

        return (
            <div>
                <h4>To Do List</h4>
                { outstandingTask }
                <br/>
                <h4>Completed Task: { completedTask.length }</h4>
                { completedTask }
            </div>
        );
    }
}


class Form extends React.Component {
    render() {
        return (
            <form className="addTask" onSubmit={ (e) => { this.props.submitHandler(e) } }>
                <h4>Add Task </h4>
                <div>Task Name: <input className="form-control" name="task" type="text"/></div>
                <br/>
                <div>To be Completed By: <input className="form-control" name="completion" type="date"/></div>
                <br/>
                <button type="submit" className="btn btn-primary btn-sm">Add New Task</button>
            </form>
        );
    }
}


class App extends React.Component {
    constructor() {
        super();

        this.state = {
            list: data
        }
    }

    submitHandler(e) {
        let valid = true;

        e.preventDefault();
        e.target.elements.task.className = "form-control";
        e.target.elements.completion.className = "form-control";

        if (e.target.elements.task.value.length < 1) {
            e.target.elements.task.className = "form-control is-invalid";
            valid = false;
        }

        if (e.target.elements.completion.value.length < 1) {
            e.target.elements.completion.className = "form-control is-invalid";
            valid = false;
        }

        if (valid === true) {
            this.state.list.push({
                "id": this.state.list.length + 1,
                "task": e.target.elements.task.value,
                "done": false,
                "target_completion": moment(e.target.elements.completion.value).format("D MMM YYYY"),
                "created_at": moment().format('D MMM YYYY, h:mm:ss a')
            })

            this.setState( { list: this.state.list } );
        }
    }

    markTaskHandler(e) {
        let id = this.state.list.findIndex((item) => { return item.id.toString() === e.target.id });

        if (this.state.list[id].done === false) {
            this.state.list[id].done = true;
        } else {
            this.state.list[id].done = false;
        }

        this.setState( { list: this.state.list } );
    }

    render() {
        return (
            <div>
                <Form submitHandler = { (e) => { this.submitHandler(e) } }/>
                <br/>
                <ItemList markTaskHandler = { (e) => { this.markTaskHandler(e) } }
                    list = { this.state.list }
                />
            </div>
        );
    }
}


ReactDOM.render(
    <App/>,
    document.getElementById('root')
);