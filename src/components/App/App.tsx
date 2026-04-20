import React from 'react';
import './App.css';
import { useState } from 'react';

interface TaskOfDayProps {
    nameOfTask: string;
    id: number;
    onTaskComplete: (id: number) => void;
    isCompleted: boolean;
    createdAt: number;
}

const TaskOfDay: React.FC<TaskOfDayProps> = (props) => {
    const { nameOfTask, id, onTaskComplete, isCompleted, createdAt } = props;

    const formatTime = (timestamp?: number) => {
        if (!timestamp) return '';

        const date = new Date(timestamp);
        return isNaN(date.getTime())
            ? ''
            : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="taskPlace" onClick={() => onTaskComplete(id)} style={{ cursor: 'pointer' }}>
            {isCompleted ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#64BC69" />
                    <path d="M6 12.75L10 16.75L18 8.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                </svg>
            )}

            <div className="taskOfDay">
                <div className={`task ${isCompleted ? 'completed' : ''}`}>
                    {nameOfTask}
                </div>
            </div>
            <div className="taskTime">
                    {formatTime(createdAt)}
            </div>
        </div>
    );
};

interface AllTasksOfDayProps {
    taskName: string;
    id: number;
    isCompleted: boolean;
    createdAt: number;
}

interface AppProps { }

const App: React.FC<AppProps> = () => {
    const [textOfTask, setTextOfTask] = useState<string>('');
    const [allTasksOfDay, setAllTasksOfDay] = useState<AllTasksOfDayProps[]>(() => {
        const storedTasks = localStorage.getItem('tasks');

        if (!storedTasks) return [];

        const parsed = JSON.parse(storedTasks);

        const fixedTasks = parsed.map((task: any) => ({
            ...task,
            createdAt: task.createdAt || task.id
        }));

        return fixedTasks;
    });

    const [isLimitReached, setIsLimitReached] = useState<boolean>(false);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    const onChangeTextOfTask = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        
        setTextOfTask(value);
    };

    const onAddTask = () => {
        if (textOfTask.trim() === '') return;

        const newTask: AllTasksOfDayProps = {
            taskName: textOfTask,
            id: Date.now(),
            isCompleted: false,
            createdAt: Date.now()
        };

        const updatedTasks = [...allTasksOfDay, newTask];
        setAllTasksOfDay(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setTextOfTask('');
        setIsLimitReached(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onAddTask();
        }
    };

    const handleTaskComplete = (id: number) => {
        const updatedTasks = allTasksOfDay.map((task) =>
            task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
        );
        setAllTasksOfDay(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
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
            return <div className="noTaskYetMessage">There's nothing yet</div>;
        }

        return (
            <div className="allTasks">
                {filteredTasks.map((item) => (
                    <TaskOfDay
                        key={item.id}
                        nameOfTask={item.taskName}
                        id={item.id}
                        onTaskComplete={handleTaskComplete}
                        isCompleted={item.isCompleted}
                        createdAt={item.createdAt}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="app">
            <div className="allTaskInfo">
                Tasks left: {allTasksOfDay.filter(task => !task.isCompleted).length}
            </div>

            <header className="head">
                <div className="todosText">Plans for today</div>
                <div className="headOfMain">
                    <input
                        className="setPlan"
                        type="text"
                        placeholder="Text..."
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
                            Unfulfilled
                        </div>
                        <div
                            className={`filter-item ${filter === 'completed' ? 'activeFilter' : ''}`}
                            onClick={() => handleFilterChange('completed')}
                        >
                            Completed
                        </div>
                    </div>

                    <div className="filterClear">
                        <div
                            onClick={() => {
                                const remainingTasks = allTasksOfDay.filter(task => !task.isCompleted);
                                setAllTasksOfDay(remainingTasks);
                                localStorage.setItem('tasks', JSON.stringify(remainingTasks));
                            }}
                        >
                            Delete completed
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;