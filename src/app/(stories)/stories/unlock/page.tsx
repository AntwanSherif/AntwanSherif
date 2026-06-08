// Hi. Yes, this is in a public repo. Yes, that was intentional.
// The password page is the barrier, not the source code.
// If you're reading this — you're clearly the kind of person I want to talk to.
// linkedin.com/in/antwansherif/

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validate } from '@/lib/stories-password';
import { unlockAction } from './actions';

const COOKIE_NAME = 'stories-auth';

export default async function UnlockPage({
  searchParams
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  // Already authenticated? Don't show the password page — bounce to the listing.
  // This keeps the unlock page out of the way of the back button: after unlocking,
  // pressing back lands on /stories, not on the password screen again.
  const auth = (await cookies()).get(COOKIE_NAME)?.value;
  if (auth && (await validate(process.env.STORIES_SEED ?? '', auth))) {
    redirect('/stories');
  }

  const { from, error } = await searchParams;
  const safeTo = from?.startsWith('/stories/') ? from : '/stories';

  return (
    <main className='fixed inset-0 flex flex-col items-center justify-center px-4 bg-background z-50'>
      <div className='w-full max-w-sm flex flex-col items-center gap-8'>
        {/* Avatar placeholder — a better illustration is coming */}
        <div
          className='w-24 h-24 rounded-full border border-border flex items-center justify-center text-4xl select-none'
          style={{ background: 'color-mix(in srgb, var(--accent-ai) 10%, transparent)' }}
        >
          🤷
        </div>

        {/* Copy */}
        <div className='text-center flex flex-col gap-3 max-w-xs'>
          <h1 className='text-2xl font-bold tracking-tight text-foreground'>Yes, this is a password page.</h1>
          <p className='text-sm text-muted-foreground leading-relaxed'>I&apos;m as surprised as you are.</p>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            I spent a lot of time on what&apos;s behind it, so here we are. The password was in whatever link brought
            you here.
          </p>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            If you arrived via pure curiosity and determination — I respect that.{' '}
            <a
              href='https://www.linkedin.com/in/antwansherif/'
              target='_blank'
              rel='noopener noreferrer'
              className='underline underline-offset-2 hover:text-foreground transition-colors'
            >
              Let&apos;s talk.
            </a>
          </p>
        </div>

        {/* Form */}
        <form action={unlockAction} className='w-full flex flex-col gap-3'>
          <input type='hidden' name='from' value={safeTo} />
          <input
            name='password'
            type='password'
            placeholder='Password'
            autoFocus
            className={[
              'w-full rounded-xl border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50',
              'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-background',
              'transition-colors',
              error ? 'border-red-500/60 focus:ring-red-500/40' : 'border-border focus:ring-(--accent-ai)/40'
            ].join(' ')}
          />
          {error && <p className='text-xs text-red-400 -mt-1'>Wrong password. Try again.</p>}
          <button
            type='submit'
            className='w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90'
            style={{ background: 'var(--accent-ai)' }}
          >
            Let me in
          </button>
        </form>
      </div>
    </main>
  );
}

