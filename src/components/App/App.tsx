import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addTask, toggleTask, deleteCompleted, setFilter } from '../reducer/reducer';

interface AppProps {}

const App: React.FC<AppProps> = () => {
    const dispatch = useDispatch<AppDispatch>();

    const allTasksOfDay = useSelector(
        (state: RootState) => state.aleksey.allTasksOfDay
    );

    const filter = useSelector(
        (state: RootState) => state.aleksey.filter
    );

    const [textOfTask, setTextOfTask] = useState<string>('');
    const [isLimitReached] = useState<boolean>(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [minutes, setMinutes] = useState<number | ''>('');

    const [currentTime, setCurrentTime] = useState(Date.now());

    const firedTasks = useRef<Set<number>>(new Set());

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio('/alarm.mp3');
        audioRef.current.loop = false;
    }, []);

    useEffect(() => {
        if ('Notification' in window) {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
    
            allTasksOfDay.forEach((task: any) => {
                const shouldFire =
                    task.remainTime &&
                    task.remainTime <= now &&
                    !task.isCompleted &&
                    !firedTasks.current.has(task.id);
    
                if (shouldFire) {
                    firedTasks.current.add(task.id);
    
                    if (Notification.permission === 'granted') {
                        navigator.serviceWorker.ready.then((registration) => {
                            registration.showNotification('⏰ Task time!', {
                                body: task.taskName,
                                icon: '/icon.png'
                            });
                        });
                    }
    
                    const audio = audioRef.current;
                    if (audio) {
                        audio.currentTime = 0; 
                        audio.play().catch(() => {});
                    }
                }
            });
        }, 1000);
    
        return () => clearInterval(interval);
    }, [allTasksOfDay]);

    const onChangeTextOfTask = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextOfTask(event.target.value);
    };

    const onAddTask = () => {
        if (textOfTask.trim() === '') return;

        dispatch(addTask({ taskName: textOfTask }));
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
                return allTasksOfDay.filter(task => !task.isCompleted);
            case 'completed':
                return allTasksOfDay.filter(task => task.isCompleted);
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

    const getRemainingTime = (remainTime?: number) => {
        if (!remainTime) return '';

        const diff = Math.max(0, remainTime - currentTime);

        if (diff === 0) return 'Time is up';

        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);

        return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                        <div className='circle'>
                        {item.isCompleted ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" fill="#64BC69" />
                                <path
                                    d="M6 12.75L10 16.75L18 8.75"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        )}
                        </div>

                        <div className="taskOfDay">
                            <div className={`task ${item.isCompleted ? 'completed' : ''}`}>
                                {item.taskName}
                            </div>
                        </div>

           
                            {item.remainTime
                                ? <div className="remainTime">{getRemainingTime(item.remainTime)}</div>
                                : <div className="taskTime">{formatTime(item.createdAt)}</div>}
                    </div>
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

                    <div className="plusTime">
                        <button
                            className="plusTimeBtn"
                            onClick={() => setIsModalOpen(true)}
                        >
                            +Time
                        </button>
                    </div>
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

            {isModalOpen && (
                <div className="modalOverlay">
                    <div className="modal">
                        <h3>Set time (minutes)</h3>

                        <input
                            type="number"
                            value={minutes}
                            onChange={(e) =>
                                setMinutes(e.target.value === '' ? '' : Number(e.target.value))
                            }
                            placeholder="Minutes"
                        />

                        <div className="modalButtons">
                            <button onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </button>

                            <button
                                onClick={() => {
                                    if (
                                        minutes === '' ||
                                        minutes <= 0 ||
                                        textOfTask.trim() === ''
                                    )
                                        return;

                                    const remainTime =
                                        Date.now() + minutes * 60000;

                                    dispatch(
                                        addTask({
                                            taskName: textOfTask,
                                            remainTime
                                        })
                                    );

                                    setTextOfTask('');
                                    setMinutes('');
                                    setIsModalOpen(false);
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;