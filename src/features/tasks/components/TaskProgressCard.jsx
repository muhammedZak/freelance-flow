import ProgressBar from '@components/common/ProgressBar';

function TaskProgressCard({
  totalTasks,
  todoTasks,
  inProgressTasks,
  completedTasks,
  progressPercentage,
}) {
  return (
    <div className='mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
      <div className='mb-3 flex items-center justify-between gap-3'>
        <h2 className='text-lg font-bold text-slate-900'>Project Progress</h2>
      </div>

      <ProgressBar value={progressPercentage} height='medium' showLabel />

      <p className='mt-2 text-sm text-slate-500'>
        {completedTasks} of {totalTasks} tasks completed
      </p>

      <div className='mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4'>
        <div className='rounded bg-slate-100 p-3 text-center'>
          <p className='text-xl font-bold text-slate-900'>{totalTasks}</p>

          <p className='text-sm text-slate-500'>Total</p>
        </div>

        <div className='rounded bg-slate-100 p-3 text-center'>
          <p className='text-xl font-bold text-slate-900'>{todoTasks}</p>

          <p className='text-sm text-slate-500'>To Do</p>
        </div>

        <div className='rounded bg-slate-100 p-3 text-center'>
          <p className='text-xl font-bold text-slate-900'>{inProgressTasks}</p>

          <p className='text-sm text-slate-500'>In Progress</p>
        </div>

        <div className='rounded bg-slate-100 p-3 text-center'>
          <p className='text-xl font-bold text-slate-900'>{completedTasks}</p>

          <p className='text-sm text-slate-500'>Completed</p>
        </div>
      </div>
    </div>
  );
}

export default TaskProgressCard;
