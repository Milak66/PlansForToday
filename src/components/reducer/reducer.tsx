import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
    taskName: string;
    id: number;
    isCompleted: boolean;
    createdAt: number;
    remainTime?: number;
}

type FilterType = 'all' | 'active' | 'completed';

interface InitialState {
    allTasksOfDay: Task[];
    filter: FilterType;
}

const loadFromLocalStorage = (): Task[] => {
    try {
        const stored = localStorage.getItem('tasks');
        if (!stored) return [];

        const parsed = JSON.parse(stored);

        return parsed.map((task: any) => ({
            ...task,
            createdAt: task.createdAt || task.id
        }));
    } catch {
        return [];
    }
};

const initialState: InitialState = {
    allTasksOfDay: loadFromLocalStorage(),
    filter: 'all'
};

const save = (state: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(state));
};

const reducer = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (
            state,
            action: PayloadAction<{ taskName: string; remainTime?: number }>
        ) => {
            state.allTasksOfDay.push({
                taskName: action.payload.taskName,
                id: Date.now(),
                isCompleted: false,
                createdAt: Date.now(),
                remainTime: action.payload.remainTime
            });

            save(state.allTasksOfDay);
        },

        toggleTask: (state, action: PayloadAction<number>) => {
            const task = state.allTasksOfDay.find(t => t.id === action.payload);
            if (task) {
                task.isCompleted = !task.isCompleted;
                save(state.allTasksOfDay);
            }
        },

        deleteCompleted: (state) => {
            state.allTasksOfDay = state.allTasksOfDay.filter(t => !t.isCompleted);
            save(state.allTasksOfDay);
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