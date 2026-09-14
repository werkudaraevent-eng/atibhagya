import { SectionMark } from '@/components/site/Ornament'
import page from '@/components/site/Page.module.css'
import type { EventContent } from '@/lib/content/types'
import { Lines } from '@/lib/text'
import styles from './EventDays.module.css'

type Props = {
  days: EventContent['days']
  id: string
  number: string
  stage: string
}

/**
 * The dark chapter: one column per day of the event, side by side. A day
 * carries its own list — as a thread that fills while you read, or as
 * numbered rows — two asides, and a closing line.
 */
export function EventDays({ days, id, number, stage }: Props) {
  return (
    <section id={id} className={styles.section} data-stage={stage} data-chapter={number} data-dark>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`${page.container} ${styles.inner}`}>
        <div className={styles.head}>
          <SectionMark number={number} mark="macron" label={stage} align="center" />
          {days.headline ? (
            <h2 className={styles.headline} data-words>
              <Lines text={days.headline} />
            </h2>
          ) : null}
        </div>

        <div className={styles.columns}>
          {days.columns.map((day) => (
            <div key={day.title} className={styles.column}>
              {day.kicker || day.meta ? (
                <div className={styles.kickerRow} data-fade>
                  {day.kicker ? <span className={styles.kicker}>{day.kicker}</span> : null}
                  {day.meta ? <span className={styles.meta}>{day.meta}</span> : null}
                </div>
              ) : null}
              <h3 className={styles.title} data-fade>
                {day.title}
              </h3>
              {day.body ? (
                <p className={styles.body} data-fade>
                  <Lines text={day.body} />
                </p>
              ) : null}

              {day.list.length ? (
                <>
                  {day.listLabel ? (
                    <div className={styles.listLabel} data-fade>
                      {day.listLabel}
                    </div>
                  ) : null}
                  {day.listStyle === 'thread' ? (
                    <ol className={styles.thread}>
                      <span className={styles.track} aria-hidden="true" />
                      <span className={styles.fill} data-procline aria-hidden="true" />
                      {day.list.map((step, i) => (
                        <li key={step.title} className={styles.step} data-fade>
                          <span className={styles.dot} aria-hidden="true" />
                          <div className={styles.stepHead}>
                            <span className={styles.stepN}>{String(i + 1).padStart(2, '0')}</span>
                            <span className={styles.stepTitle}>{step.title}</span>
                          </div>
                          {step.body ? <p className={styles.stepBody}>{step.body}</p> : null}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ol className={styles.rows}>
                      {day.list.map((step, i) => (
                        <li key={step.title} className={styles.row} data-fade>
                          <span className={styles.stepN}>{String(i + 1).padStart(2, '0')}</span>
                          <div>
                            <div className={styles.stepTitle}>{step.title}</div>
                            {step.body ? <p className={styles.stepBody}>{step.body}</p> : null}
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </>
              ) : null}

              {day.notes.length ? (
                <div className={styles.notes} data-fade>
                  {day.notes.map((note) => (
                    <div key={note.title} className={styles.note}>
                      <div className={styles.noteTitle}>{note.title}</div>
                      {note.body ? <p className={styles.noteBody}>{note.body}</p> : null}
                    </div>
                  ))}
                </div>
              ) : null}

              {day.quote ? (
                <blockquote className={styles.quote} data-fade>
                  {day.quoteEyebrow ? <div className={styles.quoteEyebrow}>{day.quoteEyebrow}</div> : null}
                  <p className={styles.quoteText}>{day.quote}</p>
                </blockquote>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
