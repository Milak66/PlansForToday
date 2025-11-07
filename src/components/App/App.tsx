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
        <div className="taskPlace" onClick={() => onTaskComplete(id)} style={{cursor: 'pointer'}}>
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
        <div className="taskOfDay">
            <div className={`task ${isCompleted ? 'completed' : ''}`}>
                {nameOfTask}
            </div>
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
    const [textOfTask, setTextOfTask] = React.useState<string>('');
    const [allTasksOfDay, setAllTasksOfDay] = React.useState<AllTasksOfDayProps[]>([]);
    const [isLimitReached, setIsLimitReached] = React.useState<boolean>(false);
    const [filter, setFilter] = React.useState<'all' | 'active' | 'completed'>('all');

    const screenWidth = window.innerHeight;

    const onChangeTextOfTask = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (screenWidth > 768) {
            if (value.length > 100) {
                alert('Длина строки должна быть не больше 100 символов');
            } else {
                setTextOfTask(value);
            }
        } else {
            if (value.length > 50) {
                alert('Длина строки должна быть не больше 50 символов');
            } else {
                setTextOfTask(value);
            }
        }
    };

    const onAddTask = () => {
        const newTask: AllTasksOfDayProps = { taskName: textOfTask, id: Date.now(), isCompleted: false };
        setAllTasksOfDay([...allTasksOfDay, newTask]);
        setTextOfTask('');
        setIsLimitReached(false);
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

        if (filteredTasks.length == 0) {
            return (
                <div className="noTaskYetMessage">Нет заданий</div>
            );
        } else {
            return (
                <div className="allTasks">
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

    return (
        <div className="app">
            <header className="head">
            <div className="todosText">Задания на день</div>
            <div className="headOfMain">
            <input
                className="setPlan"
                type="text"
                placeholder="Введите задание..."
                onChange={onChangeTextOfTask}
                value={textOfTask}
                onKeyDown={handleKeyDown}
                disabled={isLimitReached}
            />
            </div>
            </header>
            <main className="mainContent">
            <div className="main">
                {showTask()}
            </div>
            </main>
            <footer className="footer">
                <div className="menuOfFilter">
                    <div className="numberOfCases">
                        <div>{allTasksOfDay.filter(task => !task.isCompleted).length}</div>
                        <div style={{ marginLeft: '5px' }}>Заданий осталось</div>
                    </div>

                    <div className="mainFilter">
                        <div
                            className={`filter-item ${filter === 'all' ? 'activeFilter' : ''}`}
                            onClick={() => handleFilterChange('all')}
                        >
                            Все
                        </div>
                        <div
                            className={`filter-item ${filter === 'active' ? 'activeFilter' : ''}`}
                            onClick={() => handleFilterChange('active')}
                        >
                            Невыполненные
                        </div>
                        <div
                            className={`filter-item ${filter === 'completed' ? 'activeFilter' : ''}`}
                            onClick={() => handleFilterChange('completed')}
                        >
                            Выполненные
                        </div>
                    </div>

                    <div className="filterClear">
                        <div onClick={() => setAllTasksOfDay(allTasksOfDay.filter(task => !task.isCompleted))}>Удалить выполненые</div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;