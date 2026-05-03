import React, { useState } from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addTask, toggleTask, deleteCompleted, setFilter } from '../reducer/reducer';

interface AppProps {}

const App: React.FC<AppProps> = () => {
    const dispatch = useDispatch<AppDispatch>();

    const allTasksOfDay = useSelector((state: RootState) => state.aleksey.allTasksOfDay);
    const filter = useSelector((state: any) => state.aleksey.filter);

    const [textOfTask, setTextOfTask] = useState<string>('');
    const [isLimitReached] = useState<boolean>(false);

    const onChangeTextOfTask = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextOfTask(event.target.value);
    };

    const onAddTask = () => {
        if (textOfTask.trim() === '') return;

        dispatch(addTask(textOfTask));
        setTextOfTask('');
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onAddTask();
        }
    };

    const handleTaskComplete = (id: number) => {
        dispatch(toggleTask(id));
    };

    const handleFilterChange = (newFilter: 'all' | 'active' | 'completed') => {
        dispatch(setFilter(newFilter));
    };

    const filterTasks = () => {
        switch (filter) {
            case 'active':
                return allTasksOfDay.filter((task: any) => !task.isCompleted);
            case 'completed':
                return allTasksOfDay.filter((task: any) => task.isCompleted);
            default:
                return allTasksOfDay;
        }
    };

    const formatTime = (timestamp?: number) => {
        if (!timestamp) return '';

        const date = new Date(timestamp);
        return isNaN(date.getTime())
            ? ''
            : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const showTask = (): React.ReactNode => {
        const filteredTasks = filterTasks();

        if (filteredTasks.length === 0) {
            return <div className="noTaskYetMessage">There's nothing yet</div>;
        }

        return (
            <div className="allTasks">
                {filteredTasks.map((item: any) => (
                    <div
                        key={item.id}
                        className="taskPlace"
                        onClick={() => handleTaskComplete(item.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        {item.isCompleted ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" fill="#64BC69" />
                                <path
                                    d="M6 12.75L10 16.75L18 8.75"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        )}

                        <div className="taskOfDay">
                            <div className={`task ${item.isCompleted ? 'completed' : ''}`}>
                                {item.taskName}
                            </div>
                        </div>

                        <div className="taskTime">
                            {formatTime(item.createdAt)}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="app">
            <div className="allTaskInfo">
                Tasks left: {allTasksOfDay.filter((task: any) => !task.isCompleted).length}
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
                        <div onClick={() => dispatch(deleteCompleted())}>
                            Delete completed
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;