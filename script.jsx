class ToDoItem extends React.Component {
    constructor() {
        super();
        this.state = {
            editable: false,
        }
    }

    enableEditHandler() {
        if (this.state.editable === false) {
            this.setState( { editable: true });
        } else {
            this.setState( { editable: false });
        }
    }

    editTaskHandler(e) {
        this.props.updateTaskHandler(e);
        this.enableEditHandler();
    }

    render() {
        let cardDisplayElement = "";

        if(this.state.editable === true) {
            cardDisplayElement = <input autoFocus
                                id={ this.props.item.id }
                                defaultValue={ this.props.item.task }
                                onBlur={ (e) => { this.editTaskHandler(e) } }
                           />
        }
        else {
            cardDisplayElement = <label
                            id={ this.props.item.id }
                            className="taskName"
                            onClick={ () => { this.enableEditHandler() } }
                           >
                                { this.props.item.task }
                           </label>
        }

        return (
            <div className="toDoItemCard">
                <label className="markAsDone">
                    <input
                        type="checkbox"
                        id={ this.props.item.id }
                        onChange={ (e) => { this.props.markTaskHandler(e) } }
                        checked = { this.props.item.done }
                    />
                </label>
                { cardDisplayElement }
            </div>
        );
    }}

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
                                <ToDoItem
                                    markTaskHandler={ (e) => { this.props.markTaskHandler(e) } }
                                    updateTaskHandler= { (e) => { this.props.updateTaskHandler(e) } }
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
            .map( (item) => {
                return (
                    <ToDoItem
                        markTaskHandler= { (e) => { this.props.markTaskHandler(e) } }
                        updateTaskHandler= { (e) => { this.props.updateTaskHandler(e) } }
                        item = { item }
                    />
                );
            });

        if (outstandingTask.length === 0) {
            outstandingTask = "You have no outstanding task :D"
        }

        if (completedTask.length === 0) {
            completedTask = "You have no completed task :("
        }

        return (
            <div>
                <h4>To Do List</h4>
                { outstandingTask }
                <br/>
                <br/>
                <h4>Completed Task</h4>
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
        const newList = [...this.state.list];

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
            newList.push({
                "id": newList + 1,
                "task": e.target.elements.task.value,
                "done": false,
                "target_completion": moment(e.target.elements.completion.value).format("D MMM YYYY"),
                "created_at": moment().format('D MMM YYYY, h:mm:ss a')
            })

            this.setState( { list: newList } );
        }
    }

    markTaskHandler(e) {
        // avoid mutating the state itself
        const newList = [...this.state.list];
        const id = newList.findIndex((item) => { return item.id.toString() === e.target.id });

        if (newList[id].done === false) {
            newList[id].done = true;
        } else {
            newList[id].done = false;
        }

        this.setState({ list: newList })
    }

    updateTaskHandler(e) {
        const newList = [...this.state.list];
        const id = newList.findIndex((item) => { return item.id.toString() === e.target.id });

        newList[id].task = e.target.value;

        this.setState({ list: newList });
    }

    render() {
        return (
            <div>
                <Form submitHandler={ (e) => { this.submitHandler(e) } }/>
                <br/>
                <ItemList
                    markTaskHandler={ (e) => { this.markTaskHandler(e) } }
                    updateTaskHandler={ (e) => { this.updateTaskHandler(e) } }
                    list={ this.state.list }
                />
            </div>
        );
    }
}


ReactDOM.render(
    <App/>,
    document.getElementById('root')
);