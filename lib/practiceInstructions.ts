/**
 * Structured practice instructions for Focus Reps.
 */

export interface PracticeInstruction {
  id: string;
  name: string;
  description: string;
  whatYoureTraining: string[];
  setup: string[];
  practiceSteps: string[];
  closing: string[];
  criticalNotes: {
    is: string[];
    isNot: string[];
  };
  pitfalls: Array<{
    title: string;
    why: string;
    truth: string;
    fix: string;
  }>;
  keysToSuccess: string[];
  researchNotes?: string;
}

export const practiceInstructions: Record<string, PracticeInstruction> = {
  'anchor-breath': {
    id: 'anchor-breath',
    name: 'Find Your Flashlight',
    description: 'Foundational breath awareness practice. Each redirect to the breath is one successful attention rep.',
    whatYoureTraining: [
      'Orienting system (flashlight): directing attention to a chosen target',
      'Meta-awareness: noticing when the mind has wandered',
      'Cognitive control: disengaging from distractions and returning',
      'Sustained attention over time'
    ],
    setup: [
      'Sit in a stable, alert posture. Chair or cushion both work.',
      'Set a timer for 12 minutes.',
      'Close your eyes or keep a soft downward gaze.'
    ],
    practiceSteps: [
      'Choose one breath sensation (nostrils, chest, or belly) and keep that one target for the full session.',
      'Observe natural breathing. Do not control pace or depth.',
      'When attention wanders, notice where it went and gently return to the breath.',
      'Treat each return as a successful rep.',
      'Repeat focus, notice wandering, and redirect until the timer ends.'
    ],
    closing: [
      'Notice your current state without judgment.',
      'Take one deliberate breath.',
      'Transition back to the room and open your eyes.'
    ],
    criticalNotes: {
      is: [
        'Training to notice wandering and redirect attention',
        'Building tolerance for mind wandering without harsh self-talk',
        'A repetition practice where redirects are the core work'
      ],
      isNot: [
        'A blank-mind exercise',
        'Breath control or pranayama',
        'A perfection test with zero wandering'
      ]
    },
    pitfalls: [
      {
        title: 'Judging yourself for wandering',
        why: 'Attention drift is mistaken for failure',
        truth: 'Wandering is expected. Noticing and returning is the exercise.',
        fix: 'Count redirects as wins, not mistakes.'
      },
      {
        title: 'Controlling the breath',
        why: 'Focusing on breathing can trigger breath management',
        truth: 'Natural breathing is the target.',
        fix: 'Observe sensation only and release control attempts.'
      },
      {
        title: 'Expecting immediate outcomes',
        why: 'Attention gains are expected instantly',
        truth: 'Neural adaptation requires consistent practice over weeks.',
        fix: 'Prioritize daily completion over short-term feeling changes.'
      },
      {
        title: 'Late detection of mind wandering',
        why: 'Meta-awareness is initially weak',
        truth: 'Detection speed improves with repetitions.',
        fix: 'Return immediately once noticed, regardless of how long you drifted.'
      },
      {
        title: 'Turning practice into a chore',
        why: 'Session length feels demanding at first',
        truth: 'Consistency matters more than perfect subjective quality.',
        fix: 'Anchor practice to a stable daily cue (time and location).'
      }
    ],
    keysToSuccess: [
      'Consistency over perfection',
      'Use the same time and place when possible',
      'Drop session-quality judgments',
      'Track completion to maintain accountability'
    ],
    researchNotes: 'Research in high-stress populations found benefit when practice reached at least 12 minutes per day, 5 days per week.'
  },
  'body-sweep': {
    id: 'body-sweep',
    name: 'Body Scan',
    description: 'Systematic scan through body regions to train deliberate movement of attention while staying present.',
    whatYoureTraining: [
      'Attention mobility across targets',
      'Interoception (internal body awareness)',
      'Present-moment anchoring through sensation',
      'Disengagement from rumination into direct sensory data'
    ],
    setup: [
      'Sit or lie down in a stable, comfortable posture.',
      'Set a timer for 12 minutes.',
      'Start with 2 to 3 breaths to settle attention.'
    ],
    practiceSteps: [
      'Begin by settling attention on the breath.',
      'Start at the feet and notice direct sensation (temperature, pressure, movement, or no clear sensation).',
      'Move upward through regions: calves, knees, thighs, hips, abdomen, chest, shoulders, arms, hands, neck, face, head.',
      'Move at a deliberate pace and keep scanning rhythm stable.',
      'If the mind drifts, return to the last zone you remember and continue.',
      'Complete a full sweep and hold whole-body awareness before closing.'
    ],
    closing: [
      'Take a whole-body snapshot of present sensation.',
      'Notice overall state without analysis.',
      'Transition back gradually.'
    ],
    criticalNotes: {
      is: [
        'Noticing physical sensation, not stories about sensation',
        'Training stable attention while the target moves',
        'Allowing faint or absent sensations without forcing'
      ],
      isNot: [
        'Searching for dramatic sensations',
        'Diagnosing the body during practice',
        'A rapid checklist pass'
      ]
    },
    pitfalls: [
      {
        title: 'Trying to create sensations',
        why: 'Expectation of a target feeling drives forcing',
        truth: 'Whatever is present or absent is valid practice input.',
        fix: 'Observe what is actually there and continue.'
      },
      {
        title: 'Getting pulled into explanation',
        why: 'Sensation triggers stories and analysis',
        truth: 'The training target is raw sensation.',
        fix: 'Return to direct descriptors like pressure, warmth, tension, or pulse.'
      },
      {
        title: 'Scanning too quickly',
        why: 'Completion urgency replaces training quality',
        truth: 'Steady pacing builds sustained attention.',
        fix: 'Slow down and spend meaningful time per region.'
      },
      {
        title: 'Falling asleep',
        why: 'Low arousal plus lying posture reduces alertness',
        truth: 'Alert stability is part of the training target.',
        fix: 'Switch to seated posture or earlier practice time.'
      },
      {
        title: 'Reactive discomfort handling',
        why: 'Discomfort triggers immediate avoidance',
        truth: 'Mild discomfort can be observed without instant reaction.',
        fix: 'Adjust only when pain is sharp or concerning; otherwise observe response patterns.'
      }
    ],
    keysToSuccess: [
      'Keep a steady scan pace',
      'Notice rather than analyze',
      'Use breath reset when very lost',
      'Accept pleasant, unpleasant, and neutral sensations equally'
    ],
    researchNotes: 'Body-based attention practices support emotional regulation and reduce rumination by anchoring attention in present-moment physical signals.'
  },
  'thought-traffic': {
    id: 'thought-traffic',
    name: 'River of Thought',
    description: 'Meta-awareness practice for observing thoughts, emotions, and sensations as passing mental events.',
    whatYoureTraining: [
      'Meta-awareness of ongoing mental content',
      'Decentering from thoughts and emotions',
      'Non-reactivity under cognitive pull',
      'Pattern recognition in mental habits'
    ],
    setup: [
      'Use a seated, stable posture and set 12 minutes.',
      'Start with brief breath awareness to settle.',
      'Establish a river visualization with you as observer on the shore.'
    ],
    practiceSteps: [
      'Observe thoughts, emotions, sensations, and sounds as objects moving down the river.',
      'Stay on the shore as observer rather than entering the stream of content.',
      'When swept into thought, notice it, step back to observer position, and continue.',
      'Do not edit, suppress, or judge content; allow full flow.',
      'If overwhelmed, use breath for stabilization and then resume.'
    ],
    closing: [
      'Release the visualization.',
      'Notice current mental state with neutrality.',
      'Transition back gradually.'
    ],
    criticalNotes: {
      is: [
        'Observing mental events rather than identifying with them',
        'Returning to observer stance when pulled in',
        'Allowing all content categories equally'
      ],
      isNot: [
        'A thought-suppression exercise',
        'A demand for a calm or empty mind',
        'A content-analysis session'
      ]
    },
    pitfalls: [
      {
        title: 'Getting repeatedly swept into thought',
        why: 'Habitual identification with thought is strong',
        truth: 'Noticing and stepping back is the core rep.',
        fix: 'Normalize frequent resets and continue.'
      },
      {
        title: 'Trying to control river contents',
        why: 'Unpleasant content triggers suppression',
        truth: 'Control efforts increase reactivity.',
        fix: 'Let content pass without interference.'
      },
      {
        title: 'Analyzing meaning of thoughts',
        why: 'Insight-seeking overrides attention training',
        truth: 'Analysis is additional mental content to observe.',
        fix: 'Return to observer stance and continue flow tracking.'
      },
      {
        title: 'Frustration with a busy mind',
        why: 'Turbulence is interpreted as failed practice',
        truth: 'Any river state can be trained with.',
        fix: 'Measure reps by recovery, not calmness.'
      },
      {
        title: 'Losing visualization structure',
        why: 'Attention drifts away from support image',
        truth: 'Visualization is a support tool and can be reset any time.',
        fix: 'Re-establish shore-and-river framing without judgment.'
      }
    ],
    keysToSuccess: [
      'Embrace all content categories',
      'Use breath as a lifeline when overloaded',
      'Track how quickly you detect attentional hijacking',
      'Treat each return to shore as progress'
    ],
    researchNotes: 'Meta-awareness practices reduce rumination and improve early detection of attentional hijacking, enabling faster recovery to task-relevant focus.'
  },
  'kindness-circuit': {
    id: 'kindness-circuit',
    name: 'Connection Practice',
    description: 'Loving-kindness practice that directs well-wishes to self and others to stabilize attention and reduce reactivity.',
    whatYoureTraining: [
      'Directed attention toward people as intentional targets',
      'Emotional regulation under stress and self-criticism',
      'Interpersonal connection and prosocial orientation',
      'Self-compassion as a stability foundation'
    ],
    setup: [
      'Use a comfortable seated posture and set 12 minutes.',
      'Take 3 to 4 breaths to settle.',
      'Prepare phrases such as: "May I/you be happy, healthy, safe, and live with ease."'
    ],
    practiceSteps: [
      'Phase 1 (Self): direct phrases toward yourself for 2 to 3 minutes.',
      'Phase 2 (Loved one): hold one person in mind and repeat phrases for 2 to 3 minutes.',
      'Phase 3 (Neutral person): extend phrases to someone neutral for 2 to 3 minutes.',
      'Phase 4 (Optional difficult person): choose a mildly difficult person and continue phrases with care.',
      'Close by widening intention: "May all beings be happy, healthy, safe, and live with ease."'
    ],
    closing: [
      'Notice emotional tone without forcing interpretation.',
      'Return to one grounding breath.',
      'Open your eyes and transition gently.'
    ],
    criticalNotes: {
      is: [
        'Directing attention and intention, not forcing emotion',
        'Practicing self-compassion as the first phase',
        'Building non-reactive social-emotional capacity'
      ],
      isNot: [
        'Condoning harmful behavior from difficult people',
        'A requirement to feel warm or loving every session',
        'A reason to skip self-directed compassion'
      ]
    },
    pitfalls: [
      {
        title: 'Harsh self-judgment in self phase',
        why: 'Self-directed well-wishing can feel unfamiliar',
        truth: 'Resistance is expected and part of the work.',
        fix: 'Notice judgment and continue with simple phrases.'
      },
      {
        title: 'Mechanical phrase repetition',
        why: 'Speed and routine disconnect words from intention',
        truth: 'Intention quality matters more than phrase count.',
        fix: 'Slow down and let each phrase land.'
      },
      {
        title: 'Choosing someone too difficult too early',
        why: 'Over-challenging triggers shutdown or strong reactivity',
        truth: 'Difficulty should be gradual like other training loads.',
        fix: 'Start with mildly difficult targets.'
      },
      {
        title: 'Trying to force positive feeling',
        why: 'Emotional output becomes the scorecard',
        truth: 'Attention direction and intention are the primary reps.',
        fix: 'Focus on sincere phrasing, not emotional intensity.'
      },
      {
        title: 'Getting lost in stories',
        why: 'People-focused practice can trigger narrative recall',
        truth: 'Narratives are distractions from intentional practice.',
        fix: 'Return to visualization and phrases.'
      }
    ],
    keysToSuccess: [
      'Return to self-phase when overloaded',
      'Start with uncomplicated loved-one targets',
      'Use vivid but simple imagery for each target',
      'Track where resistance is strongest to guide future training'
    ],
    researchNotes: 'Loving-kindness practice increases positive affect and social connection while reducing self-criticism and reactive interpersonal attention hijacks.'
  }
};

export function getPracticeInstruction(practiceType: string): PracticeInstruction | undefined {
  return practiceInstructions[practiceType];
}

export function getAllPracticeInstructions(): PracticeInstruction[] {
  return Object.values(practiceInstructions);
}
