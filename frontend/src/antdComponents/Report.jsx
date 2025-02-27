function Report({ tasks, taskBoards }) {

    const missedTasks = tasks.filter((task) => (
        task.taskProgress < 10 && new Date(task.taskDeadline) < new Date()
    ));
    return (
        <div className="p-4 text-black">
            <h1 className="text-xl font-bold mb-4">Task Reports</h1>
            <p>Total Task Boards: {taskBoards.length}</p>
            <p>Total Tasks: {tasks.length}</p>
            <br />
            {taskBoards.map((board,index) => (
                <div key={index}>
                    <h2 className="text-lg font-bold">{board}</h2>
                    <p>Total Tasks: {tasks.filter((item) => item.taskStatus === board).length}</p>
                </div>
            ))}
            <br />
            <h2 className="text-lg font-bold text-red-500">Total Missed tasks: {missedTasks.length}</h2>
        </div>
    );
}

export default Report;
