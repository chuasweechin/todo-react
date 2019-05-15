class List extends React.Component {
    render() {
        let completion_dates = [...new Set(this.props.list.map(x => x.target_completion))];

        let element = completion_dates.map( (date, index) => {
            let task = this.props.list
                        .filter( (item) => {
                            return item.target_completion === date;
                        })
                        .map( (item, innerIndex) => {
                            return (
                                <ul key={ item.id }>
                                    <li>Task: { item.task }</li>
                                    <li>
                                        <label>Mark as Done:
                                                <input
                                                    type="checkbox"
                                                    id={ item.id }
                                                    onChange={ (e) => { this.props.markTaskHandler(e) } }
                                                    checked = { item.done }
                                                />
                                        </label>
                                    </li>
                                </ul>
                            );
                        });

            return (
                <div key={ index }>
                    <h2>{ date }</h2>
                    { task }
                </div>
            );
        });

        return (
            <div>
                { element }
            </div>
        );
    }
}

class App extends React.Component {
    constructor(){
        super();

        this.state = {
            list: data
        }

        //this.markTaskHandler = this.markTaskHandler.bind(this);
    }

    submitHandler(e) {
        let valid = true;

        e.preventDefault();
        e.target.elements.task.className = "";
        e.target.elements.completion.className = "";

        if (e.target.elements.task.value.length < 1) {
            e.target.elements.task.className = "warning";
            valid = false;
        }

        if (e.target.elements.completion.value.length < 1) {
            e.target.elements.completion.className = "warning";
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
            <form onSubmit={ (e) => { this.submitHandler(e) } }>
                <div>Task: <input name="task" type="text"/></div>
                <br/>
                <div>To be Completed By: <input name="completion" type="date"/></div>
                <button type="submit">Add New To Do Item</button>
            </form>

            <br/>

            <h1>To Do List</h1>
            <List
                list = { this.state.list }
                markTaskHandler = { (e) => { this.markTaskHandler(e) } }
            />
        </div>
      );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);