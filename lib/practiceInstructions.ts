/**
 * Structured practice instructions extracted from Peak Mind Practice Guide
 * Based on Dr. Amishi Jha's research and practices
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
  'find-your-flashlight': {
    id: 'find-your-flashlight',
    name: 'Find Your Flashlight',
    description: 'The foundational practice of breath awareness. This concentrative meditation trains you to repeatedly orient attention to a target (breath sensations), notice when attention wanders, and redirect it back to the target. This is the "push-up" for your attention system.',
    whatYoureTraining: [
      'Orienting system (Flashlight): Directing attention to a chosen target',
      'Meta-awareness: Noticing when your mind has wandered',
      'Cognitive control: Disengaging from distractions and redirecting attention',
      'Sustained attention: Maintaining focus over time'
    ],
    setup: [
      'Find a comfortable seated position. This can be in a chair with feet flat on the floor or cross-legged on a cushion. The key is stability and alertness—not so relaxed you\'ll fall asleep, not so uncomfortable you can\'t sit still.',
      'Set a timer for 12 minutes. Having a defined endpoint helps you commit fully to the practice.',
      'Close your eyes or maintain a soft downward gaze.'
    ],
    practiceSteps: [
      'Find a breath sensation: Direct your attention to a physical sensation associated with breathing. Common locations: the cool air entering and warm air leaving your nostrils, the rise and fall of your chest, or the expansion and contraction of your belly. Choose ONE location and stick with it for the entire session.',
      'Notice the breath: You\'re not trying to breathe in any special way—no deep breathing, no breath control. Simply observe the breath as it naturally occurs. Notice the texture, temperature, rhythm, and quality of each breath.',
      'When your mind wanders (and it will—frequently): Notice that it has wandered without judgment, acknowledge where it went (planning, remembering, daydreaming), and gently redirect attention back to the breath sensation. This redirect is NOT a failure—it\'s the actual exercise. Each time you notice wandering and return is one successful "rep."',
      'Repeat: Continue this cycle—focus, notice wandering, redirect—for the entire 12 minutes.'
    ],
    closing: [
      'Before opening your eyes, take a moment to notice your current state',
      'Gradually transition back to your environment',
      'Open your eyes when ready'
    ],
    criticalNotes: {
      is: [
        'Training to notice when attention has wandered',
        'Strengthening the ability to redirect attention',
        'Building tolerance for the wandering mind',
        'Cultivating non-judgmental awareness'
      ],
      isNot: [
        'Achieving a blank mind or stopping thoughts',
        'Breath control or pranayama',
        'Relaxation training (though it may be calming)',
        'A way to "fix" or eliminate mind-wandering'
      ]
    },
    pitfalls: [
      {
        title: 'Judging yourself for mind-wandering',
        why: 'We think we\'re "bad" at meditation when the mind wanders',
        truth: 'Mind-wandering is not failure—it\'s what minds do. The practice is noticing and redirecting.',
        fix: 'Treat each redirect as a success. You\'re building the muscle of awareness.'
      },
      {
        title: 'Controlling or forcing the breath',
        why: 'Focusing on breathing makes us want to manage it',
        truth: 'Natural breathing is the target. You\'re observing, not controlling.',
        fix: 'If you notice yourself controlling the breath, simply note it and return to observing natural breathing.'
      },
      {
        title: 'Expecting immediate results',
        why: 'We want quick fixes for attention problems',
        truth: 'Neural changes take time. Research shows benefits emerge after 4 weeks of consistent practice.',
        fix: 'Trust the process. Focus on showing up daily, not on outcomes.'
      }
    ],
    keysToSuccess: [
      'Consistency over perfection: Show up daily even when you don\'t feel like it',
      'Start small if needed: If 12 minutes feels overwhelming initially, start with 5 and gradually increase',
      'Same time, same place: Anchor practice to a specific time and location',
      'Remove judgment: Each session is complete just by doing it—there are no "good" or "bad" sessions',
      'Track your practice: Use the provided schedule or a simple calendar to maintain accountability'
    ],
    researchNotes: 'Participants who practiced breath awareness for 12+ minutes daily showed protection against working memory degradation during high-stress intervals. Those who practiced less than 12 minutes showed no protective effect.'
  },
  'body-scan': {
    id: 'body-scan',
    name: 'Body Scan',
    description: 'Moves your focused attention (flashlight) systematically through different parts of your body, noticing physical sensations. While Find Your Flashlight keeps attention on a single target, Body Scan trains you to smoothly move the beam of attention while maintaining focus.',
    whatYoureTraining: [
      'Attention mobility: Moving focused attention deliberately',
      'Interoception: Awareness of internal bodily states',
      'Present-moment awareness: Anchoring in direct physical experience',
      'Disengagement from mental content: Redirecting from thoughts to sensations'
    ],
    setup: [
      'Find a comfortable seated or lying position. Many people prefer lying down for body scan, but if you tend to fall asleep, sitting is better.',
      'Set timer for 12 minutes',
      'Close your eyes'
    ],
    practiceSteps: [
      'Begin with breath: Start with 2-3 cycles of breath awareness to settle attention',
      'Move to the feet: Direct attention to your feet. Notice any sensations: temperature, pressure, texture, movement, or the absence of sensation. You\'re not looking for anything specific—just noticing what\'s actually present.',
      'Systematically scan upward: Feet and toes (1-2 minutes), lower legs and calves, knees, upper legs and thighs, hips and pelvis, lower back and abdomen, upper back and chest, shoulders, arms and hands, neck, face and head',
      'When your mind wanders: Notice you\'re thinking rather than sensing, return to the last body region you remember, and continue the scan',
      'Move deliberately: Don\'t rush. The pace should be like a searchlight slowly sweeping a landscape. You\'re training sustained attention while in motion.'
    ],
    closing: [
      'Take a moment to notice your whole body as a complete unit',
      'Notice the overall quality of your present-moment experience',
      'Gradually transition back'
    ],
    criticalNotes: {
      is: [
        'Noticing physical sensations, not thoughts about your body',
        'Maintaining attention on body regions whether sensation is present or absent'
      ],
      isNot: [
        'Trying to create sensations',
        'Analyzing or thinking about bodily sensations',
        'Rushing through body regions'
      ]
    },
    pitfalls: [
      {
        title: 'Trying to create sensations',
        why: 'We think we need to feel something specific',
        truth: 'You\'re observing, not manufacturing. Whatever is present (or absent) is what you work with.',
        fix: 'Accept whatever sensations arise, or the absence of sensation'
      },
      {
        title: 'Getting lost in thoughts about bodily sensations',
        why: 'We start analyzing what we notice',
        truth: 'The practice is noticing the sensation itself, not the story about it',
        fix: 'Notice the sensation itself (tightness, pressure), not the story about it'
      }
    ],
    keysToSuccess: [
      'Maintain the same pace throughout: Don\'t rush through "boring" areas',
      'Notice, don\'t analyze: The moment you start analyzing sensations, you\'ve left direct experience',
      'Use the breath as anchor: If you get very lost, return to breath awareness before resuming the scan',
      'Accept whatever arises: Some areas feel clear, others vague, some pleasant, some unpleasant. All are valid.'
    ]
  },
  'river-of-thought': {
    id: 'river-of-thought',
    name: 'River of Thought',
    description: 'Shifts the focus of attention from external targets (breath, body) to the mind itself. You visualize your mind as a flowing river and observe thoughts, emotions, and sensations as they arise and pass like objects floating by. This develops meta-awareness—the ability to take explicit note of and monitor the contents of your conscious experience.',
    whatYoureTraining: [
      'Meta-awareness: Observing the observing mind',
      'Decentering: Creating psychological distance from mental content',
      'Non-reactivity: Noticing thoughts and emotions without getting caught up in them',
      'Understanding mental patterns: Recognizing how your mind habitually operates'
    ],
    setup: [
      'Seated position is recommended for this practice',
      'Set timer for 12 minutes',
      'Close your eyes or maintain soft downward gaze'
    ],
    practiceSteps: [
      'Begin with breath (1-2 minutes): Establish stable attention with breath awareness',
      'Establish the visualization: Picture yourself standing at the bank of a river. The river is flowing steadily in front of you. You can see the water moving, objects floating by. You are the observer on the shore, not in the river.',
      'Observe mental events as river objects: When a thought arises, visualize it as an object floating past. When an emotion arises, see it flowing by. When a physical sensation captures attention, watch it pass. The key: You remain on the shore, watching. You are not in the river.',
      'If you get "swept into the river" (lost in thought): Notice you\'re thinking rather than observing, recognize you\'ve been pulled from the shore into the river, step back onto the shore (return to the observer position), and resume watching the river flow',
      'No editing, no judging: Don\'t try to control what appears in the river. Don\'t judge contents as good or bad. Don\'t push away difficult thoughts or cling to pleasant ones. Just watch them all float by.'
    ],
    closing: [
      'Release the visualization',
      'Notice your current mental state',
      'Gradually transition back'
    ],
    criticalNotes: {
      is: [
        'Observing thoughts as mental events',
        'Maintaining the observer position',
        'Creating space between you and your thoughts'
      ],
      isNot: [
        'Trying to stop thoughts or empty the mind',
        'Getting engaged with thought content',
        'Analyzing or judging thoughts'
      ]
    },
    pitfalls: [
      {
        title: 'Getting repeatedly swept into the river',
        why: 'The mind is habituated to identifying with thoughts',
        truth: 'Each time you notice you\'re swept in and step back out, that\'s a successful rep. This is the exercise.',
        fix: 'Recognize that getting swept in is part of the practice. The moment you notice, step back to shore.'
      },
      {
        title: 'Trying to control river contents',
        why: 'We want only calm thoughts',
        truth: 'Let the river be what it is. Your job is only to observe from the shore.',
        fix: 'Accept all thoughts—calm, chaotic, pleasant, unpleasant—as equal river objects'
      }
    ],
    keysToSuccess: [
      'Embrace all content: Difficult thoughts, pleasant thoughts, boring thoughts—all are equal in the river',
      'Notice patterns: Over time, you\'ll see which thoughts repeat, when they tend to arise, how they cluster',
      'Don\'t fight the river: Resistance creates suffering. Observation creates space.',
      'Use the breath as lifeline: If you get very lost, return to breath before re-establishing river visualization',
      'Recognize small wins: Each moment you notice you\'re in the river and return to shore is progress'
    ]
  },
  'connection-practice': {
    id: 'connection-practice',
    name: 'Connection Practice',
    description: 'Systematically directs well-wishes toward yourself, loved ones, neutral people, and difficult people. Unlike the previous practices that train attention regulation, Connection Practice trains both attention and the quality of mental states—cultivating positive emotions and reducing self-criticism and interpersonal tension.',
    whatYoureTraining: [
      'Directed attention toward people: Using imagery and phrases to establish others as attention targets',
      'Emotional regulation: Generating positive states even when mind wanders or self-criticism arises',
      'Interpersonal connection: Building neural patterns that support prosocial feelings',
      'Self-compassion: Extending kindness to yourself, especially during difficulty'
    ],
    setup: [
      'Comfortable seated position',
      'Set timer for 12 minutes',
      'Close your eyes'
    ],
    practiceSteps: [
      'Phase 1 - Self (2-3 minutes): Begin with breath, establish self as target, recite phrases silently: "May I be happy", "May I be healthy", "May I be safe", "May I live with ease". Say them slowly with genuine intention. Repeat 4-5 times.',
      'Phase 2 - Loved One (2-3 minutes): Choose one person you love deeply. Visualize them. Recite phrases: "May you be happy", "May you be healthy", "May you be safe", "May you live with ease". Generate the wish genuinely. Repeat 4-5 cycles.',
      'Phase 3 - Neutral Person (2-3 minutes): Choose someone you don\'t know well. Recognize their humanity. Visualize and recite phrases. Notice any difference in difficulty.',
      'Phase 4 - Difficult Person (2-3 minutes, optional): Choose someone mildly difficult. You\'re not condoning behavior, but recognizing their humanity. Visualize and recite phrases. Work with resistance if it arises.',
      'Closing: Expand awareness to all beings everywhere. "May all beings be happy, healthy, safe, and live with ease."'
    ],
    closing: [
      'Expand awareness to all beings everywhere',
      '"May all beings be happy, healthy, safe, and live with ease"',
      'Notice your current emotional state',
      'Gradually open eyes'
    ],
    criticalNotes: {
      is: [
        'Directing attention and intention toward well-wishing',
        'Cultivating self-compassion as foundation',
        'Recognizing shared humanity'
      ],
      isNot: [
        'Trying to force loving feelings',
        'Condoning harmful behavior',
        'Self-indulgence (self-compassion is not self-indulgence)'
      ]
    },
    pitfalls: [
      {
        title: 'Harsh self-judgment during self-phase',
        why: 'We think self-compassion is selfish or undeserved',
        truth: 'Self-compassion is foundational. You can\'t genuinely wish well for others from a place of harsh self-judgment.',
        fix: 'Notice the judgment as mental content. Continue the phrases. This resistance is often where the most important work happens.'
      },
      {
        title: 'Saying phrases mechanically without meaning',
        why: 'We rush through the phrases',
        truth: 'The practice is the intention, not just the words',
        fix: 'Slow down. Say each phrase once, let it resonate, then move to the next. Quality over quantity.'
      },
      {
        title: 'Choosing someone TOO difficult',
        why: 'We want to challenge ourselves',
        truth: 'Start with mildly annoying people, not deep betrayals or trauma',
        fix: 'Build the muscle gradually. Start with easy loved ones and mildly difficult people.'
      }
    ],
    keysToSuccess: [
      'Return to self when needed: If other phases feel too difficult, it\'s fine to spend the whole session on self-compassion',
      'Start with easy loved ones: Don\'t choose complicated relationships initially',
      'Use visualization: The more vividly you can picture the person, the more engaged attention becomes',
      'Track resistance: Notice which phase is hardest—this reveals important information about your relationship to self and others',
      'Don\'t skip self-phase: This is the foundation. Without self-compassion, wishing well for others becomes performative.'
    ]
  }
};

export function getPracticeInstruction(practiceType: string): PracticeInstruction | undefined {
  return practiceInstructions[practiceType];
}

export function getAllPracticeInstructions(): PracticeInstruction[] {
  return Object.values(practiceInstructions);
}
