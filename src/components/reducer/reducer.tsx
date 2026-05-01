import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
    taskName: string;
    id: number;
    isCompleted: boolean;
    createdAt: number;
}

type FilterType = 'all' | 'active' | 'completed';

interface InitialState {
    allTasksOfDay: Task[];
    filter: FilterType;
}

const loadFromLocalStorage = (): Task[] => {
    const storedTasks = localStorage.getItem('tasks');
    if (!storedTasks) return [];

    const parsed = JSON.parse(storedTasks);

    return parsed.map((task: any) => ({
        ...task,
        createdAt: task.createdAt || task.id
    }));
};

const initialState: InitialState = {
    allTasksOfDay: loadFromLocalStorage(),
    filter: 'all'
};

const reducer = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<string>) => {
            const newTask: Task = {
                taskName: action.payload,
                id: Date.now(),
                isCompleted: false,
                createdAt: Date.now()
            };

            state.allTasksOfDay.push(newTask);
            localStorage.setItem('tasks', JSON.stringify(state.allTasksOfDay));
        },

        toggleTask: (state, action: PayloadAction<number>) => {
            const task = state.allTasksOfDay.find(t => t.id === action.payload);
            if (task) {
                task.isCompleted = !task.isCompleted;
                localStorage.setItem('tasks', JSON.stringify(state.allTasksOfDay));
            }
        },

        deleteCompleted: (state) => {
            state.allTasksOfDay = state.allTasksOfDay.filter(t => !t.isCompleted);
            localStorage.setItem('tasks', JSON.stringify(state.allTasksOfDay));
        },

        setFilter: (state, action: PayloadAction<FilterType>) => {
            state.filter = action.payload;
        }
    }
});

export const {
    addTask,
    toggleTask,
    deleteCompleted,
    setFilter
} = reducer.actions;

export default reducer.reducer;