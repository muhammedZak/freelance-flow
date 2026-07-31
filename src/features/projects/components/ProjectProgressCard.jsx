import ProgressBar from '@components/common/ProgressBar';
import SectionCard from '@components/common/SectionCard';

function ProjectProgressCard({
  totalTasks,
  completedTasks,
  inProgressTasks,
  progressPercentage,
}) {
  return (
    <SectionCard title='Project Progress'>
      <div className='mb-3 flex items-center justify-between text-sm'>
        <span className='text-slate-600'>
          {completedTasks} of {totalTasks} tasks completed
        </span>
      </div>

      <ProgressBar value={progressPercentage} height='large' showLabel />

      <div className='mt-4 grid grid-cols-3 gap-3 text-center text-sm'>
        <div className='rounded bg-slate-100 p-3'>
          <p className='font-bold text-slate-900'>{totalTasks}</p>

          <p className='text-slate-500'>Total</p>
        </div>

        <div className='rounded bg-slate-100 p-3'>
          <p className='font-bold text-slate-900'>{inProgressTasks}</p>

          <p className='text-slate-500'>Progress</p>
        </div>

        <div className='rounded bg-slate-100 p-3'>
          <p className='font-bold text-slate-900'>{completedTasks}</p>

          <p className='text-slate-500'>Done</p>
        </div>
      </div>
    </SectionCard>
  );
}

export default ProjectProgressCard;
