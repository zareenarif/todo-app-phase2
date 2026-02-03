'use client';

import { useState, useMemo, DragEvent } from 'react';
import { Task, PriorityEnum } from '@/lib/types';

type ViewMode = 'month' | 'week' | 'day';

interface CalendarProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onDateClick?: (date: Date) => void;
  onTaskDrop?: (taskId: string, newDate: string) => void;
}

export default function Calendar({ tasks, onTaskClick, onDateClick, onTaskDrop }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  // Get tasks for a specific date
  const getTasksForDate = (date: Date): Task[] => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.due_date === dateStr);
  };

  // Navigation functions
  const navigatePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Format header based on view mode
  const getHeaderText = () => {
    if (viewMode === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (viewMode === 'week') {
      const startOfWeek = getStartOfWeek(currentDate);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  // Drag handlers
  const handleDragStart = (e: DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    // Add a slight delay to show the drag effect
    const target = e.target as HTMLElement;
    setTimeout(() => {
      target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e: DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
    setDraggedTask(null);
    setDragOverDate(null);
  };

  const handleDragOver = (e: DragEvent, dateStr: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(dateStr);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = (e: DragEvent, date: Date) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const newDateStr = date.toISOString().split('T')[0];

    if (taskId && onTaskDrop) {
      onTaskDrop(taskId, newDateStr);
    }

    setDraggedTask(null);
    setDragOverDate(null);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={navigatePrev}
              className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
              aria-label="Previous"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white min-w-[200px] text-center">
              {getHeaderText()}
            </h2>
            <button
              onClick={navigateNext}
              className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
              aria-label="Next"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={goToToday}
              className="ml-2 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
            {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                  viewMode === mode
                    ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Drag hint */}
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <span>💡</span>
          <span>Drag and drop tasks to reschedule them</span>
        </div>
      </div>

      {/* Calendar Body */}
      <div className="p-4">
        {viewMode === 'month' && (
          <MonthView
            currentDate={currentDate}
            tasks={tasks}
            getTasksForDate={getTasksForDate}
            onTaskClick={onTaskClick}
            onDateClick={onDateClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            dragOverDate={dragOverDate}
            draggedTask={draggedTask}
          />
        )}
        {viewMode === 'week' && (
          <WeekView
            currentDate={currentDate}
            tasks={tasks}
            getTasksForDate={getTasksForDate}
            onTaskClick={onTaskClick}
            onDateClick={onDateClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            dragOverDate={dragOverDate}
            draggedTask={draggedTask}
          />
        )}
        {viewMode === 'day' && (
          <DayView
            currentDate={currentDate}
            tasks={tasks}
            getTasksForDate={getTasksForDate}
            onTaskClick={onTaskClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        )}
      </div>
    </div>
  );
}

// Helper functions
function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

function getDaysInMonth(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days: Date[] = [];

  // Add days from previous month to fill the first week
  const startPadding = firstDay.getDay();
  for (let i = startPadding - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push(d);
  }

  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Add days from next month to fill the last week
  const endPadding = 6 - lastDay.getDay();
  for (let i = 1; i <= endPadding; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function isSameMonth(date: Date, currentDate: Date): boolean {
  return date.getMonth() === currentDate.getMonth();
}

// Priority colors for task pills
function getPriorityColor(priority: PriorityEnum | null): string {
  switch (priority) {
    case PriorityEnum.HIGH:
      return 'bg-red-500';
    case PriorityEnum.MEDIUM:
      return 'bg-yellow-500';
    case PriorityEnum.LOW:
      return 'bg-green-500';
    default:
      return 'bg-gray-400';
  }
}

// View Props with drag support
interface ViewProps {
  currentDate: Date;
  tasks: Task[];
  getTasksForDate: (date: Date) => Task[];
  onTaskClick?: (task: Task) => void;
  onDateClick?: (date: Date) => void;
  onDragStart: (e: DragEvent<HTMLDivElement>, task: Task) => void;
  onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: DragEvent<HTMLDivElement>, dateStr: string) => void;
  onDragLeave?: () => void;
  onDrop?: (e: DragEvent<HTMLDivElement>, date: Date) => void;
  dragOverDate?: string | null;
  draggedTask?: Task | null;
}

// Month View Component
function MonthView({
  currentDate,
  getTasksForDate,
  onTaskClick,
  onDateClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  dragOverDate,
  draggedTask
}: ViewProps) {
  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dayTasks = getTasksForDate(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isTodayDate = isToday(date);
          const dateStr = date.toISOString().split('T')[0];
          const isDragOver = dragOverDate === dateStr;

          return (
            <div
              key={index}
              onClick={() => onDateClick?.(date)}
              onDragOver={(e) => onDragOver?.(e, dateStr)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop?.(e, date)}
              className={`min-h-[100px] p-2 rounded-xl border cursor-pointer transition-all ${
                isDragOver
                  ? 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-400 dark:border-indigo-500 border-2 border-dashed scale-[1.02]'
                  : isCurrentMonth
                  ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-50'
              } ${isTodayDate && !isDragOver ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-gray-800' : ''}`}
            >
              {/* Date number */}
              <div className={`text-sm font-semibold mb-1 ${
                isTodayDate
                  ? 'w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center'
                  : isCurrentMonth
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-400 dark:text-gray-600'
              }`}>
                {date.getDate()}
              </div>

              {/* Tasks */}
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, task)}
                    onDragEnd={onDragEnd}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick?.(task);
                    }}
                    className={`text-xs px-2 py-1 rounded-md truncate cursor-grab active:cursor-grabbing hover:opacity-80 transition-all ${
                      task.completed
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 line-through'
                        : `${getPriorityColor(task.priority)} text-white`
                    } ${draggedTask?.id === task.id ? 'opacity-50 scale-95' : ''}`}
                    title={`${task.title} (drag to reschedule)`}
                  >
                    <span className="flex items-center gap-1">
                      <span className="opacity-60">⋮⋮</span>
                      {task.title}
                    </span>
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>

              {/* Drop indicator */}
              {isDragOver && dayTasks.length === 0 && (
                <div className="flex items-center justify-center h-16 text-indigo-500 dark:text-indigo-400 text-sm font-medium">
                  Drop here
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Week View Component
function WeekView({
  currentDate,
  getTasksForDate,
  onTaskClick,
  onDateClick,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  dragOverDate,
  draggedTask
}: ViewProps) {
  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDays.map((date, index) => {
        const dayTasks = getTasksForDate(date);
        const isTodayDate = isToday(date);
        const dateStr = date.toISOString().split('T')[0];
        const isDragOver = dragOverDate === dateStr;

        return (
          <div
            key={index}
            onClick={() => onDateClick?.(date)}
            onDragOver={(e) => onDragOver?.(e, dateStr)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop?.(e, date)}
            className={`min-h-[300px] p-3 rounded-xl border cursor-pointer transition-all ${
              isDragOver
                ? 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-400 dark:border-indigo-500 border-2 border-dashed scale-[1.02]'
                : isTodayDate
                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 hover:shadow-md'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md'
            }`}
          >
            {/* Day header */}
            <div className="text-center mb-3">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`text-2xl font-bold mt-1 ${
                isTodayDate
                  ? 'w-10 h-10 mx-auto bg-indigo-600 text-white rounded-full flex items-center justify-center'
                  : 'text-gray-900 dark:text-white'
              }`}>
                {date.getDate()}
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-2">
              {dayTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, task)}
                  onDragEnd={onDragEnd}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTaskClick?.(task);
                  }}
                  className={`p-2 rounded-lg cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
                    task.completed
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
                  } ${draggedTask?.id === task.id ? 'opacity-50 scale-95' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    <div className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">⋮⋮</div>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getPriorityColor(task.priority)}`} />
                    <div className="min-w-0">
                      <div className={`text-sm font-medium truncate ${
                        task.completed
                          ? 'text-gray-400 dark:text-gray-500 line-through'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {task.title}
                      </div>
                      {task.tags && task.tags.length > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {task.tags[0]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {dayTasks.length === 0 && !isDragOver && (
                <div className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">
                  No tasks
                </div>
              )}
              {isDragOver && (
                <div className="flex items-center justify-center py-4 text-indigo-500 dark:text-indigo-400 text-sm font-medium border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-lg">
                  Drop here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Day View Component
function DayView({
  currentDate,
  getTasksForDate,
  onTaskClick,
  onDragStart,
  onDragEnd
}: Omit<ViewProps, 'onDateClick' | 'onDragOver' | 'onDragLeave' | 'onDrop' | 'dragOverDate' | 'draggedTask'>) {
  const dayTasks = getTasksForDate(currentDate);
  const isTodayDate = isToday(currentDate);

  return (
    <div>
      {/* Day header */}
      <div className={`text-center mb-6 p-4 rounded-xl ${
        isTodayDate ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-gray-50 dark:bg-gray-800'
      }`}>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
          {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
        </div>
        <div className={`text-4xl font-bold mt-1 ${
          isTodayDate ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'
        }`}>
          {currentDate.getDate()}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Tasks for the day */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tasks ({dayTasks.length})
        </h3>
        {dayTasks.length > 0 ? (
          <div className="space-y-3">
            {dayTasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => onDragStart(e, task)}
                onDragEnd={onDragEnd}
                onClick={() => onTaskClick?.(task)}
                className={`p-4 rounded-xl cursor-grab active:cursor-grabbing hover:shadow-lg transition-all border ${
                  task.completed
                    ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-gray-400 dark:text-gray-500 mt-1">⋮⋮</div>
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${getPriorityColor(task.priority)}`} />
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold ${
                      task.completed
                        ? 'text-gray-400 dark:text-gray-500 line-through'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {task.description}
                      </div>
                    )}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {task.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={`px-3 py-1 text-xs font-bold rounded-full ${
                    task.completed
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {task.completed ? 'Done' : 'Pending'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="text-4xl mb-3">📅</div>
            <div className="text-gray-500 dark:text-gray-400">No tasks scheduled for this day</div>
            <div className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Drag tasks from other days to schedule them here
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
