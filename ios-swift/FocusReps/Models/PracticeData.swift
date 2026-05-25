import Foundation

public struct Pitfall: Codable, Hashable {
    public var title: String
    public var why: String
    public var truth: String
    public var fix: String
    
    public init(title: String, why: String, truth: String, fix: String) {
        self.title = title
        self.why = why
        self.truth = truth
        self.fix = fix
    }
}

public struct PracticeInstruction: Codable, Identifiable {
    public var id: String { practiceType.rawValue }
    public var practiceType: PracticeType
    public var name: String
    public var description: String
    public var whatYoureTraining: [String]
    public var setup: [String]
    public var practiceSteps: [String]
    public var closing: [String]
    public var criticalNotesIs: [String]
    public var criticalNotesIsNot: [String]
    public var pitfalls: [Pitfall]
    public var keysToSuccess: [String]
    public var researchNotes: String?
    
    public init(practiceType: PracticeType,
                name: String,
                description: String,
                whatYoureTraining: [String],
                setup: [String],
                practiceSteps: [String],
                closing: [String],
                criticalNotesIs: [String],
                criticalNotesIsNot: [String],
                pitfalls: [Pitfall],
                keysToSuccess: [String],
                researchNotes: String? = nil) {
        self.practiceType = practiceType
        self.name = name
        self.description = description
        self.whatYoureTraining = whatYoureTraining
        self.setup = setup
        self.practiceSteps = practiceSteps
        self.closing = closing
        self.criticalNotesIs = criticalNotesIs
        self.criticalNotesIsNot = criticalNotesIsNot
        self.pitfalls = pitfalls
        self.keysToSuccess = keysToSuccess
        self.researchNotes = researchNotes
    }
}

public struct PracticeData {
    public static let instructions: [PracticeType: PracticeInstruction] = [
        .anchorBreath: PracticeInstruction(
            practiceType: .anchorBreath,
            name: "Find Your Flashlight",
            description: "Foundational breath awareness practice. Each redirect to the breath is one successful attention rep.",
            whatYoureTraining: [
                "Orienting system (flashlight): directing attention to a chosen target",
                "Meta-awareness: noticing when the mind has wandered",
                "Cognitive control: disengaging from distractions and returning",
                "Sustained attention over time"
            ],
            setup: [
                "Sit in a stable, alert posture. Chair or cushion both work.",
                "Set a timer for 12 minutes.",
                "Close your eyes or keep a soft downward gaze."
            ],
            practiceSteps: [
                "Choose one breath sensation (nostrils, chest, or belly) and keep that one target for the full session.",
                "Observe natural breathing. Do not control pace or depth.",
                "When attention wanders, notice where it went and gently return to the breath.",
                "Treat each return as a successful rep.",
                "Repeat focus, notice wandering, and redirect until the timer ends."
            ],
            closing: [
                "Notice your current state without judgment.",
                "Take one deliberate breath.",
                "Transition back to the room and open your eyes."
            ],
            criticalNotesIs: [
                "Training to notice wandering and redirect attention",
                "Building tolerance for mind wandering without harsh self-talk",
                "A repetition practice where redirects are the core work"
            ],
            criticalNotesIsNot: [
                "A blank-mind exercise",
                "Breath control or pranayama",
                "A perfection test with zero wandering"
            ],
            pitfalls: [
                Pitfall(title: "Judging yourself for wandering", why: "Attention drift is mistaken for failure", truth: "Wandering is expected. Noticing and returning is the exercise.", fix: "Count redirects as wins, not mistakes."),
                Pitfall(title: "Controlling the breath", why: "Focusing on breathing can trigger breath management", truth: "Natural breathing is the target.", fix: "Observe sensation only and release control attempts."),
                Pitfall(title: "Expecting immediate outcomes", why: "Attention gains are expected instantly", truth: "Neural adaptation requires consistent practice over weeks.", fix: "Prioritize daily completion over short-term feeling changes.")
            ],
            keysToSuccess: [
                "Consistency over perfection",
                "Use the same time and place when possible",
                "Drop session-quality judgments",
                "Track completion to maintain accountability"
            ],
            researchNotes: "Research in high-stress populations found benefit when practice reached at least 12 minutes per day, 5 days per week."
        ),
        .bodySweep: PracticeInstruction(
            practiceType: .bodySweep,
            name: "Body Scan",
            description: "Systematic scan through body regions to train deliberate movement of attention while staying present.",
            whatYoureTraining: [
                "Attention mobility across targets",
                "Interoception (internal body awareness)",
                "Present-moment anchoring through sensation",
                "Disengagement from rumination into direct sensory data"
            ],
            setup: [
                "Sit or lie down in a stable, comfortable posture.",
                "Set a timer for 12 minutes.",
                "Start with 2 to 3 breaths to settle attention."
            ],
            practiceSteps: [
                "Begin by settling attention on the breath.",
                "Start at the feet and notice direct sensation (temperature, pressure, warmth, or no sensation).",
                "Move upward through regions: calves, knees, thighs, hips, abdomen, chest, shoulders, arms, hands, neck, face, head.",
                "Move at a deliberate pace and keep scanning rhythm stable.",
                "If the mind drifts, return to the last zone you remember and continue.",
                "Complete a full sweep and hold whole-body awareness before closing."
            ],
            closing: [
                "Take a whole-body snapshot of present sensation.",
                "Notice overall state without analysis.",
                "Transition back gradually."
            ],
            criticalNotesIs: [
                "Noticing physical sensation, not stories about sensation",
                "Training stable attention while the target moves",
                "Allowing faint or absent sensations without forcing"
            ],
            criticalNotesIsNot: [
                "Searching for dramatic sensations",
                "Diagnosing the body during practice",
                "A rapid checklist pass"
            ],
            pitfalls: [
                Pitfall(title: "Trying to create sensations", why: "Expectation of a target feeling drives forcing", truth: "Whatever is present or absent is valid practice input.", fix: "Observe what is actually there and continue."),
                Pitfall(title: "Getting pulled into explanation", why: "Sensation triggers stories and analysis", truth: "The training target is raw sensation.", fix: "Return to direct descriptors like pressure, warmth, tension, or pulse.")
            ],
            keysToSuccess: [
                "Keep a steady scan pace",
                "Notice rather than analyze",
                "Use breath reset when very lost",
                "Accept pleasant, unpleasant, and neutral sensations equally"
            ],
            researchNotes: "Body-based attention practices support emotional regulation and reduce rumination by anchoring attention in present-moment physical signals."
        ),
        .thoughtTraffic: PracticeInstruction(
            practiceType: .thoughtTraffic,
            name: "River of Thought",
            description: "Meta-awareness practice for observing thoughts, emotions, and sensations as passing mental events.",
            whatYoureTraining: [
                "Meta-awareness of ongoing mental content",
                "Decentering from thoughts and emotions",
                "Non-reactivity under cognitive pull",
                "Pattern recognition in mental habits"
            ],
            setup: [
                "Use a seated, stable posture and set 12 minutes.",
                "Start with brief breath awareness to settle.",
                "Establish a river visualization with you as observer on the shore."
            ],
            practiceSteps: [
                "Observe thoughts, emotions, sensations, and sounds as objects moving down the river.",
                "Stay on the shore as observer rather than entering the stream of content.",
                "When swept into thought, notice it, step back to observer position, and continue.",
                "Do not edit, suppress, or judge content; allow full flow.",
                "If overwhelmed, use breath for stabilization and then resume."
            ],
            closing: [
                "Release the visualization.",
                "Notice current mental state with neutrality.",
                "Transition back gradually."
            ],
            criticalNotesIs: [
                "Observing mental events rather than identifying with them",
                "Returning to observer stance when pulled in",
                "Allowing all content categories equally"
            ],
            criticalNotesIsNot: [
                "A thought-suppression exercise",
                "A demand for a calm or empty mind",
                "A content-analysis session"
            ],
            pitfalls: [
                Pitfall(title: "Getting repeatedly swept into thought", why: "Habitual identification with thought is strong", truth: "Noticing and stepping back is the core rep.", fix: "Normalize frequent resets and continue."),
                Pitfall(title: "Trying to control river contents", why: "Unpleasant content triggers suppression", truth: "Control efforts increase reactivity.", fix: "Let content pass without interference.")
            ],
            keysToSuccess: [
                "Embrace all content categories",
                "Use breath as a lifeline when overloaded",
                "Track how quickly you detect attentional hijacking",
                "Treat each return to shore as progress"
            ],
            researchNotes: "Meta-awareness practices reduce rumination and improve early detection of attentional hijacking, enabling faster recovery to task-relevant focus."
        ),
        .kindnessCircuit: PracticeInstruction(
            practiceType: .kindnessCircuit,
            name: "Connection Practice",
            description: "Loving-kindness practice that directs well-wishes to self and others to stabilize attention and reduce reactivity.",
            whatYoureTraining: [
                "Directed attention toward people as intentional targets",
                "Emotional regulation under stress and self-criticism",
                "Interpersonal connection and prosocial orientation",
                "Self-compassion as a stability foundation"
            ],
            setup: [
                "Use a comfortable seated posture and set 12 minutes.",
                "Take 3 to 4 breaths to settle.",
                "Prepare phrases such as: 'May I/you be happy, healthy, safe, and live with ease.'"
            ],
            practiceSteps: [
                "Phase 1 (Self): direct phrases toward yourself for 2 to 3 minutes.",
                "Phase 2 (Loved one): hold one person in mind and repeat phrases for 2 to 3 minutes.",
                "Phase 3 (Neutral person): extend phrases to someone neutral for 2 to 3 minutes.",
                "Phase 4 (Optional difficult person): choose a mildly difficult person and continue phrases with care.",
                "Close by widening intention: 'May all beings be happy, healthy, safe, and live with ease.'"
            ],
            closing: [
                "Notice emotional tone without forcing interpretation.",
                "Return to one grounding breath.",
                "Open your eyes and transition gently."
            ],
            criticalNotesIs: [
                "Directing attention and intention, not forcing emotion",
                "Practicing self-compassion as the first phase",
                "Building non-reactive social-emotional capacity"
            ],
            criticalNotesIsNot: [
                "Condoning harmful behavior from difficult people",
                "A requirement to feel warm or loving every session",
                "A reason to skip self-directed compassion"
            ],
            pitfalls: [
                Pitfall(title: "Harsh self-judgment in self phase", why: "Self-directed well-wishing can feel unfamiliar", truth: "Resistance is expected and part of the work.", fix: "Notice judgment and continue with simple phrases."),
                Pitfall(title: "Trying to force positive feeling", why: "Emotional output becomes the scorecard", truth: "Attention direction and intention are the primary reps.", fix: "Focus on sincere phrasing, not emotional intensity.")
            ],
            keysToSuccess: [
                "Return to self-phase when overloaded",
                "Start with uncomplicated loved-one targets",
                "Use vivid but simple imagery for each target",
                "Track where resistance is strongest to guide future training"
            ],
            researchNotes: "Loving-kindness practice increases positive affect and social connection while reducing self-criticism and reactive interpersonal attention hijacks."
        )
    ]
}
