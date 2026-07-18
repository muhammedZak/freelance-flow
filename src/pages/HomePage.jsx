import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <div className='marketing-page min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100'>
      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950/90'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8'>
          <Link to='/' className='flex items-center gap-2' onClick={closeMenu}>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white'>
              FF
            </div>

            <span className='text-xl font-bold tracking-tight'>
              FreelanceFlow
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className='hidden items-center gap-8 md:flex'>
            <a
              href='#features'
              className='text-sm font-medium text-slate-600 transition hover:text-slate-900'>
              Features
            </a>

            <a
              href='#workflow'
              className='text-sm font-medium text-slate-600 transition hover:text-slate-900'>
              How it works
            </a>

            <a
              href='#about'
              className='text-sm font-medium text-slate-600 transition hover:text-slate-900'>
              About
            </a>
          </nav>

          {/* Desktop authentication buttons */}
          <div className='hidden items-center gap-3 md:flex'>
            {isAuthenticated ? (
              <>
                <span className='max-w-40 truncate text-sm text-slate-600'>
                  Hi, {user?.name}
                </span>

                <Link
                  to='/dashboard'
                  className='rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700'>
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100'>
                  Login
                </Link>

                <Link
                  to='/register'
                  className='rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700'>
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type='button'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='rounded-lg border border-slate-300 p-2 text-slate-700 md:hidden'
            aria-label='Toggle navigation menu'
            aria-expanded={isMenuOpen}>
            {isMenuOpen ? (
              <svg
                viewBox='0 0 24 24'
                className='h-6 w-6'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'>
                <path d='M6 6l12 12M18 6L6 18' />
              </svg>
            ) : (
              <svg
                viewBox='0 0 24 24'
                className='h-6 w-6'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'>
                <path d='M4 7h16M4 12h16M4 17h16' />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className='border-t border-slate-200 bg-white px-5 py-5 md:hidden'>
            <nav className='flex flex-col gap-1'>
              <a
                href='#features'
                onClick={closeMenu}
                className='rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100'>
                Features
              </a>

              <a
                href='#workflow'
                onClick={closeMenu}
                className='rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100'>
                How it works
              </a>

              <a
                href='#about'
                onClick={closeMenu}
                className='rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100'>
                About
              </a>
            </nav>

            <div className='mt-4 border-t border-slate-200 pt-4'>
              {isAuthenticated ? (
                <Link
                  to='/dashboard'
                  onClick={closeMenu}
                  className='block rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white'>
                  Open Dashboard
                </Link>
              ) : (
                <div className='grid grid-cols-2 gap-3'>
                  <Link
                    to='/login'
                    onClick={closeMenu}
                    className='rounded-lg border border-slate-300 px-4 py-3 text-center text-sm font-medium text-slate-700'>
                    Login
                  </Link>

                  <Link
                    to='/register'
                    onClick={closeMenu}
                    className='rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white'>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero section */}
        <section className='relative overflow-hidden'>
          <div className='absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-slate-100 to-white' />

          <div className='mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8 lg:py-32'>
            <div className='max-w-2xl'>
              <div className='mb-6 inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm'>
                Simple freelance work management
              </div>

              <h1 className='text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl'>
                Keep your freelance work organized in one place.
              </h1>

              <p className='mt-6 max-w-xl text-lg leading-8 text-slate-600'>
                Manage clients, projects, tasks, invoices and payments through
                one clean and easy-to-use dashboard.
              </p>

              <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                {isAuthenticated ? (
                  <Link
                    to='/dashboard'
                    className='rounded-lg bg-slate-900 px-6 py-3.5 text-center font-medium text-white transition hover:bg-slate-700'>
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to='/register'
                      className='rounded-lg bg-slate-900 px-6 py-3.5 text-center font-medium text-white transition hover:bg-slate-700'>
                      Start managing work
                    </Link>

                    <Link
                      to='/login'
                      className='rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-center font-medium text-slate-700 transition hover:bg-slate-100'>
                      Login to account
                    </Link>
                  </>
                )}
              </div>

              <p className='mt-5 text-sm text-slate-500'>
                Built for freelancers who need a simple workflow without
                unnecessary complexity.
              </p>
            </div>

            {/* Dashboard preview */}
            <div className='relative'>
              <div className='absolute -left-6 -top-6 h-28 w-28 rounded-full bg-slate-200 blur-3xl' />
              <div className='absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-blue-100 blur-3xl' />

              <div className='relative rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/70 sm:p-6'>
                <div className='mb-6 flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-slate-500'>Workspace overview</p>
                    <h2 className='mt-1 text-xl font-bold'>
                      Freelancer Dashboard
                    </h2>
                  </div>

                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold'>
                    FF
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <PreviewCard
                    title='Clients'
                    description='Manage client information'
                  />

                  <PreviewCard
                    title='Projects'
                    description='Track active work'
                  />

                  <PreviewCard
                    title='Tasks'
                    description='Follow daily progress'
                  />

                  <PreviewCard
                    title='Invoices'
                    description='Monitor your earnings'
                  />
                </div>

                <div className='mt-4 rounded-xl border border-slate-200 p-4'>
                  <div className='mb-4 flex items-center justify-between'>
                    <div>
                      <p className='font-semibold'>Project progress</p>
                      <p className='text-sm text-slate-500'>
                        Complete tasks step by step
                      </p>
                    </div>

                    <span className='rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700'>
                      Active
                    </span>
                  </div>

                  <div className='h-2 overflow-hidden rounded-full bg-slate-200'>
                    <div className='h-full w-2/3 rounded-full bg-slate-900' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id='features'
          className='border-y border-slate-200 bg-slate-50 py-20 sm:py-24'>
          <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl text-center'>
              <p className='text-sm font-semibold uppercase tracking-widest text-slate-500'>
                Core features
              </p>

              <h2 className='mt-3 text-3xl font-bold tracking-tight sm:text-4xl'>
                Everything needed for a clear freelance workflow
              </h2>

              <p className='mt-4 text-slate-600'>
                FreelanceFlow connects your important work records without
                making the process complicated.
              </p>
            </div>

            <div className='mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
              <FeatureCard
                number='01'
                title='Client management'
                description='Store client contact details and connect each client with their projects and invoices.'
              />

              <FeatureCard
                number='02'
                title='Project tracking'
                description='Create projects, define deadlines and follow the status of ongoing freelance work.'
              />

              <FeatureCard
                number='03'
                title='Task organization'
                description='Break projects into smaller tasks and track project progress as work is completed.'
              />

              <FeatureCard
                number='04'
                title='Invoice management'
                description='Create invoices, calculate totals and monitor paid, unpaid and overdue invoices.'
              />

              <FeatureCard
                number='05'
                title='Payment records'
                description='Record payments and keep a simple history of completed client transactions.'
              />

              <FeatureCard
                number='06'
                title='Role-based views'
                description='Provide suitable access for freelancers, clients and administrators.'
              />
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section id='workflow' className='py-20 sm:py-24'>
          <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
            <div className='grid gap-14 lg:grid-cols-2 lg:items-center'>
              <div>
                <p className='text-sm font-semibold uppercase tracking-widest text-slate-500'>
                  Simple workflow
                </p>

                <h2 className='mt-3 text-3xl font-bold tracking-tight sm:text-4xl'>
                  From a new client to a completed payment
                </h2>

                <p className='mt-5 max-w-xl leading-7 text-slate-600'>
                  FreelanceFlow follows the normal order of freelance work,
                  making each module easy to understand and use.
                </p>
              </div>

              <div className='space-y-4'>
                <WorkflowStep
                  number='1'
                  title='Add a client'
                  description='Save the client’s basic contact and company information.'
                />

                <WorkflowStep
                  number='2'
                  title='Create a project'
                  description='Connect the project to the client and define its deadline and budget.'
                />

                <WorkflowStep
                  number='3'
                  title='Manage project tasks'
                  description='Add tasks and update their status as the work progresses.'
                />

                <WorkflowStep
                  number='4'
                  title='Create an invoice'
                  description='Calculate the project amount and send the invoice for payment.'
                />

                <WorkflowStep
                  number='5'
                  title='Record the payment'
                  description='Add the completed payment and update the invoice status.'
                />
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id='about' className='bg-slate-900 py-20 text-white sm:py-24'>
          <div className='mx-auto max-w-7xl px-5 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-3xl text-center'>
              <p className='text-sm font-semibold uppercase tracking-widest text-slate-400'>
                Built for clarity
              </p>

              <h2 className='mt-4 text-3xl font-bold tracking-tight sm:text-4xl'>
                Spend less time searching for information and more time
                completing work.
              </h2>

              <p className='mx-auto mt-5 max-w-2xl leading-7 text-slate-300'>
                A focused workspace helps freelancers understand what is active,
                what needs attention and which payments are still pending.
              </p>

              <div className='mt-8'>
                {isAuthenticated ? (
                  <Link
                    to='/dashboard'
                    className='inline-block rounded-lg bg-white px-6 py-3.5 font-medium text-slate-900 transition hover:bg-slate-200'>
                    Open your dashboard
                  </Link>
                ) : (
                  <Link
                    to='/register'
                    className='inline-block rounded-lg bg-white px-6 py-3.5 font-medium text-slate-900 transition hover:bg-slate-200'>
                    Create your account
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='border-t border-slate-200 bg-white'>
        <div className='mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8'>
          <div className='flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white'>
              FF
            </div>

            <span className='font-semibold text-slate-700'>FreelanceFlow</span>
          </div>

          <p>Client, project, task, invoice and payment management.</p>
        </div>
      </footer>
    </div>
  );
}

function PreviewCard({ title, description }) {
  return (
    <div className='rounded-xl border border-slate-200 bg-slate-50 p-4'>
      <div className='mb-4 h-8 w-8 rounded-lg bg-slate-900' />

      <p className='font-semibold'>{title}</p>

      <p className='mt-1 text-xs leading-5 text-slate-500'>{description}</p>
    </div>
  );
}

function FeatureCard({ number, title, description }) {
  return (
    <article className='rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg'>
      <span className='text-sm font-bold text-slate-400'>{number}</span>

      <h3 className='mt-5 text-xl font-semibold'>{title}</h3>

      <p className='mt-3 leading-7 text-slate-600'>{description}</p>
    </article>
  );
}

function WorkflowStep({ number, title, description }) {
  return (
    <article className='flex gap-4 rounded-2xl border border-slate-200 bg-white p-5'>
      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white'>
        {number}
      </div>

      <div>
        <h3 className='font-semibold'>{title}</h3>

        <p className='mt-1 text-sm leading-6 text-slate-600'>{description}</p>
      </div>
    </article>
  );
}

export default HomePage;
