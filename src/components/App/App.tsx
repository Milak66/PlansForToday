import React from "react";
import './App.css';

interface TaskOfDayProps {
    nameOfTask: string;
    id: number;
    onTaskComplete: (id: number) => void;
    isCompleted: boolean;
}

const TaskOfDay: React.FC<TaskOfDayProps> = (props) => {
    const { nameOfTask, id, onTaskComplete, isCompleted } = props;

    return (
        <div className="taskOfDay">
            <div onClick={() => onTaskComplete(id)} style={{cursor: 'pointer'}}>
                {isCompleted ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#64BC69"/>
                        <path d="M6 12.75L10 16.75L18 8.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                )}
            </div>
            <div className={`task ${isCompleted ? 'completed' : ''}`}>
                {nameOfTask}
            </div>
        </div>
    );
};

interface AllTasksOfDayProps {
    taskName: string;
    id: number;
    isCompleted: boolean;
}

interface AppProps { }

const App: React.FC<AppProps> = () => {
    const [isMainOpen, setIsMainOpen] = React.useState<boolean>(false);
    const [textOfTask, setTextOfTask] = React.useState<string>('');
    const [allTasksOfDay, setAllTasksOfDay] = React.useState<AllTasksOfDayProps[]>([]);
    const [isLimitReached, setIsLimitReached] = React.useState<boolean>(false);
    const [filter, setFilter] = React.useState<'all' | 'active' | 'completed'>('all');

    const onOpenMain = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            setIsMainOpen(!isMainOpen);
        }
    };

    const onGetKindArrow = () => {
        if (isMainOpen) {
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        }
        else {
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )
        }
    }

    const onChangeTextOfTask = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
    
        if (value.length > 30) {
            alert('The length of the string should not exceed 50 characters.');
        } else {
            setTextOfTask(value);
        }
    };

    const onAddTask = () => {
        if (allTasksOfDay.length >= 4) {
            setIsLimitReached(true);
            alert('A maximum of 4 tasks can be placed!')
            return;
        }
        if (textOfTask.trim() !== '') {
            const newTask: AllTasksOfDayProps = { taskName: textOfTask, id: Date.now(), isCompleted: false };
            setAllTasksOfDay([...allTasksOfDay, newTask]);
            setTextOfTask('');
            setIsLimitReached(false);
        };
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onAddTask();
        }
    };

    const handleTaskComplete = (id: number) => {
        setAllTasksOfDay(
            allTasksOfDay.map((task) =>
                task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
            )
        );
    };

    const handleRemoveTask = (id: number) => {
        setAllTasksOfDay(allTasksOfDay.filter((task) => task.id !== id));
    };

    const handleFilterChange = (newFilter: 'all' | 'active' | 'completed') => {
        setFilter(newFilter);
    };

    const filterTasks = () => {
        switch (filter) {
            case 'active':
                return allTasksOfDay.filter((task) => !task.isCompleted);
            case 'completed':
                return allTasksOfDay.filter((task) => task.isCompleted);
            default:
                return allTasksOfDay;
        }
    };

    const showTask = (): React.ReactNode => {
        const filteredTasks = filterTasks();

        if (filteredTasks.length === 0) {
            return (
                <div className="noTaskYetMessage">Нет заданий</div>
            );
        } else {
            return (
                <div>
                    {filteredTasks.map((item) => (
                        <TaskOfDay
                            key={item.id}
                            nameOfTask={item.taskName}
                            id={item.id}
                            onTaskComplete={handleTaskComplete}
                            isCompleted={item.isCompleted}
                        />
                    ))}
                </div>
            );
        }
    };

    const showInput = () => {
        if (!isMainOpen) {
            return (
                <input
                className="setPlan"
                type="text"
                placeholder="What needs to be done?"
                onClick={onOpenMain}
                onChange={onChangeTextOfTask}
                value={textOfTask}
                onKeyDown={handleKeyDown}
                disabled={isLimitReached}
            />
            )
        } else {
            return (
                <input
                className="setPlan"
                type="text"
                placeholder="What needs to be done?"
                onChange={onChangeTextOfTask}
                value={textOfTask}
                onKeyDown={handleKeyDown}
                disabled={isLimitReached}
            />
            )
        }
    }

    return (
        <div className="app">
            <div className="todosText">todos</div>
            <div className="headOfMain" onClick={onOpenMain}>
                <div>
                    {onGetKindArrow()}
                </div>
                {showInput()}
            </div>

            <div className="main" style={{ display: isMainOpen ? 'block' : 'none' }}>
                {showTask()}
                {isLimitReached && <div className="limitReachedMessage">Превышен лимит задач!</div>}
                <div className="menuOfFilter">
                    <div className="numberOfCases">
                        <div>{allTasksOfDay.filter(task => !task.isCompleted).length}</div>
                        <div style={{ marginLeft: '5px' }}>items left</div>
                    </div>

                    <div className="mainFilter">
                        <div
                            className={`filter-item ${filter === 'all' ? 'activeFilter' : ''}`}
                            onClick={() => handleFilterChange('all')}
                        >
                            All
                        </div>
                        <div
                            className={`filter-item ${filter === 'active' ? 'activeFilter' : ''}`}
                            onClick={() => handleFilterChange('active')}
                        >
                            Active
                        </div>
                        <div
                            className={`filter-item ${filter === 'completed' ? 'activeFilter' : ''}`}
                            onClick={() => handleFilterChange('completed')}
                        >
                            Completed
                        </div>
                    </div>

                    <div className="filterClear">
                        <div onClick={() => setAllTasksOfDay(allTasksOfDay.filter(task => !task.isCompleted))}>Clear completed</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;