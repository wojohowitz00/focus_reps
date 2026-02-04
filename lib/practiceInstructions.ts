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
    name: 'Anchor Breath',
    description: 'Foundational focus reps using the breath as a steady anchor. Each return is a rep that strengthens sustained attention and recovery from lapses.',
    whatYoureTraining: [
      'Sustained focus on a single target',
      'Lapse detection (noticing drift quickly)',
      'Rapid recovery back to the anchor',
      'Consistency under mild distraction'
    ],
    setup: [
      'Sit upright with a stable posture. Relax the shoulders and jaw.',
      'Set a timer for 12 minutes.',
      'Choose one breath sensation to anchor on (nostrils, chest, or belly).'
    ],
    practiceSteps: [
      'Place attention on the chosen breath sensation.',
      'Stay with the sensation for as long as you can without forcing the breath.',
      'When you notice your mind has drifted, label it softly (e.g., "thinking", "planning") and return to the breath.',
      'Count each return as a rep. The goal is not zero lapses but faster detection and recovery.',
      'Repeat the cycle until the timer ends.'
    ],
    closing: [
      'Notice your current state without judging it.',
      'Take one full breath intentionally.',
      'Open your eyes and transition back to the room.'
    ],
    criticalNotes: {
      is: [
        'A repetition practice focused on noticing and returning',
        'Training recovery speed, not perfect stillness',
        'Gentle redirection without self-criticism'
      ],
      isNot: [
        'Breath control or slow-breathing technique',
        'A test of willpower or suppression of thoughts',
        'A relaxation hack (calm may happen, but it is not the target)'
      ]
    },
    pitfalls: [
      {
        title: 'Trying to force a clear mind',
        why: 'We equate focus with no thoughts at all',
        truth: 'Thoughts will appear; the rep is the return.',
        fix: 'Measure success by how quickly you notice and return.'
      },
      {
        title: 'Controlling the breath',
        why: 'Focusing on breath can turn into breath management',
        truth: 'Natural breathing is the target.',
        fix: 'Let the breath do what it does. Track sensation only.'
      },
      {
        title: 'Harsh self-talk after lapses',
        why: 'We treat lapses as failures',
        truth: 'Lapses are the training stimulus.',
        fix: 'Use neutral labels and return without commentary.'
      }
    ],
    keysToSuccess: [
      'Keep the anchor consistent for the full session',
      'Aim for quick detection and calm resets',
      'Practice at a consistent time to build momentum',
      'Log your estimated lapse count after the session'
    ],
    researchNotes: 'Progress is reflected in fewer lapses and faster recovery, not in eliminating thoughts.'
  },
  'body-sweep': {
    id: 'body-sweep',
    name: 'Body Sweep',
    description: 'Deliberate attention shifts through the body to train controlled movement of focus without losing stability.',
    whatYoureTraining: [
      'Smooth attention transitions',
      'Sensory discrimination and precision',
      'Stability while moving the focus target',
      'Recovery after drift during transitions'
    ],
    setup: [
      'Sit or lie down with a stable, comfortable posture.',
      'Set a timer for 12 minutes.',
      'Start with two calm breaths to settle attention.'
    ],
    practiceSteps: [
      'Direct attention to the feet. Notice any sensation or the absence of it.',
      'Move attention upward in zones: feet, calves, knees, thighs, hips, abdomen, chest, shoulders, arms, hands, neck, face, crown.',
      'Pause 2-3 breaths per zone. Keep the pace steady.',
      'If the mind drifts, return to the last zone you remember and continue.',
      'Complete the sweep or repeat a shorter loop if time remains.'
    ],
    closing: [
      'Take a full-body snapshot of sensation.',
      'Notice overall energy and tone.',
      'Open your eyes and end the session.'
    ],
    criticalNotes: {
      is: [
        'Moving attention with control',
        'Noticing direct sensation as it is',
        'Staying present even when sensation is faint'
      ],
      isNot: [
        'Chasing strong sensations',
        'Analyzing or diagnosing the body',
        'Rushing through the scan to finish'
      ]
    },
    pitfalls: [
      {
        title: 'Rushing the scan',
        why: 'We want to finish the list quickly',
        truth: 'The training is the pace and steadiness.',
        fix: 'Slow down and keep a consistent cadence.'
      },
      {
        title: 'Searching for a specific feeling',
        why: 'We assume there is a correct sensation to find',
        truth: 'Any sensation or absence is valid data.',
        fix: 'Note what is present and move on.'
      },
      {
        title: 'Getting stuck in analysis',
        why: 'Sensations trigger stories or interpretations',
        truth: 'The target is raw sensation, not explanation.',
        fix: 'Return to texture: pressure, temperature, movement.'
      }
    ],
    keysToSuccess: [
      'Use a steady zone-by-zone rhythm',
      'Treat transitions as the rep',
      'Reset to breath if you lose the thread',
      'Keep the session light and curious'
    ]
  },
  'thought-traffic': {
    id: 'thought-traffic',
    name: 'Thought Traffic',
    description: 'Open monitoring practice that treats thoughts as passing traffic. You stay on the curb, noticing categories without jumping into the flow.',
    whatYoureTraining: [
      'Meta-awareness of mental events',
      'Reduced reactivity to thought content',
      'Quick recognition of being pulled in',
      'Flexible attention with a stable observer stance'
    ],
    setup: [
      'Sit upright and set a 12-minute timer.',
      'Take 1 minute of Anchor Breath to settle.',
      'Soften your focus and allow thoughts to arise.'
    ],
    practiceSteps: [
      'Notice a thought as it appears. Label it lightly ("planning", "memory", "worry").',
      'Let it pass without following it. Return to a neutral observer stance.',
      'If you get pulled into a story, take one breath as a reset and resume observing.',
      'Continue labeling and releasing thoughts for the remainder of the session.'
    ],
    closing: [
      'Drop labels and rest for two breaths.',
      'Notice how busy or calm the mind feels.',
      'End the session with a deliberate inhale and exhale.'
    ],
    criticalNotes: {
      is: [
        'Observing thoughts as events, not facts',
        'Maintaining a stable observer position',
        'Practicing non-reactivity'
      ],
      isNot: [
        'Trying to stop thoughts',
        'Analyzing or solving the content',
        'Forcing a blank mind'
      ]
    },
    pitfalls: [
      {
        title: 'Chasing the story',
        why: 'Interesting thoughts pull attention in',
        truth: 'The rep is noticing the pull and returning.',
        fix: 'Use a short label and let it pass.'
      },
      {
        title: 'Suppressing thoughts',
        why: 'We think success means silence',
        truth: 'Thoughts are normal; observation is the skill.',
        fix: 'Allow thoughts, but keep your distance.'
      }
    ],
    keysToSuccess: [
      'Keep labels short and neutral',
      'Use a single breath as a reset when lost',
      'Notice the gaps between thoughts too',
      'Log a simple estimate of how often you were pulled in'
    ]
  },
  'kindness-circuit': {
    id: 'kindness-circuit',
    name: 'Kindness Circuit',
    description: 'Direct attention through a circuit of people to cultivate stable, prosocial attention and soften self-criticism.',
    whatYoureTraining: [
      'Sustained focus on a chosen person',
      'Emotional regulation through intention',
      'Resilience when the mind drifts or resists',
      'Balance between focus and warmth'
    ],
    setup: [
      'Sit comfortably and set a 12-minute timer.',
      'Choose a simple phrase (e.g., "May you be steady and well").',
      'Pick four targets: self, ally, neutral person, difficult person.'
    ],
    practiceSteps: [
      'Start with yourself. Repeat the phrase slowly for 1-2 minutes.',
      'Move to an ally. Hold their image and repeat the phrase.',
      'Shift to a neutral person. Keep the phrase steady.',
      'If appropriate, include a mildly difficult person. Keep it light and brief.',
      'Finish with a wide-field wish for all people.'
    ],
    closing: [
      'Notice the tone of your mind and body.',
      'Return to one full breath.',
      'End the session gently.'
    ],
    criticalNotes: {
      is: [
        'Intentional attention with warmth',
        'Training steadiness in emotional contexts',
        'Returning to the phrase after drift'
      ],
      isNot: [
        'Forcing a specific feeling',
        'Excusing harmful behavior',
        'Skipping self-care to "be good" for others'
      ]
    },
    pitfalls: [
      {
        title: 'Picking a too-difficult person',
        why: 'We want to prove we can handle it',
        truth: 'This is training, not a test.',
        fix: 'Choose a mildly difficult person and keep it brief.'
      },
      {
        title: 'Reciting without intention',
        why: 'The phrase becomes mechanical',
        truth: 'The rep is the felt intention, not the words.',
        fix: 'Slow down and re-engage the meaning.'
      },
      {
        title: 'Skipping self focus',
        why: 'We think it is selfish',
        truth: 'Self-kindness stabilizes attention for the rest of the circuit.',
        fix: 'Always start with self, even briefly.'
      }
    ],
    keysToSuccess: [
      'Use one short phrase for the whole circuit',
      'Keep imagery simple and clear',
      'Return to the phrase after each drift',
      'Note which target was hardest for future reflection'
    ]
  }
};

export function getPracticeInstruction(practiceType: string): PracticeInstruction | undefined {
  return practiceInstructions[practiceType];
}

export function getAllPracticeInstructions(): PracticeInstruction[] {
  return Object.values(practiceInstructions);
}
