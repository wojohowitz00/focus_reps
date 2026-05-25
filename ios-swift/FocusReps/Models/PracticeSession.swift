import Foundation

public enum PracticeType: String, Codable, CaseIterable, Identifiable {
    case anchorBreath = "anchor-breath"
    case bodySweep = "body-sweep"
    case thoughtTraffic = "thought-traffic"
    case kindnessCircuit = "kindness-circuit"
    
    public var id: String { self.rawValue }
    
    public var name: String {
        switch self {
        case .anchorBreath: return "Find Your Flashlight"
        case .bodySweep: return "Body Scan"
        case .thoughtTraffic: return "River of Thought"
        case .kindnessCircuit: return "Connection Practice"
        }
    }
    
    public var description: String {
        switch self {
        case .anchorBreath: return "Foundational breath awareness reps for sustained attention and return speed."
        case .bodySweep: return "Systematic body scan that trains deliberate attention movement."
        case .thoughtTraffic: return "Meta-awareness practice for observing thoughts without getting swept in."
        case .kindnessCircuit: return "Loving-kindness practice for attention stability and emotional regulation."
        }
    }
    
    public var defaultDuration: Int { 12 }
}

public struct PracticeSession: Codable, Identifiable {
    public var id: String
    public var practiceType: PracticeType
    public var date: Date
    public var duration: Int // actual minutes practiced
    public var scheduledDuration: Int // intended duration
    public var completed: Bool
    public var lapseCount: Int? = nil
    public var longestFocusIntervalSec: Int? = nil
    public var focusQuality: Int? = nil // 1-5
    public var mood: Int? = nil // 1-5
    public var stress: Int? = nil // 1-5
    public var energy: Int? = nil // 1-5
    public var journalEntryId: String? = nil
    
    public init(id: String = UUID().uuidString,
                practiceType: PracticeType,
                date: Date = Date(),
                duration: Int,
                scheduledDuration: Int = 12,
                completed: Bool = true,
                lapseCount: Int? = nil,
                longestFocusIntervalSec: Int? = nil,
                focusQuality: Int? = nil,
                mood: Int? = nil,
                stress: Int? = nil,
                energy: Int? = nil,
                journalEntryId: String? = nil) {
        self.id = id
        self.practiceType = practiceType
        self.date = date
        self.duration = duration
        self.scheduledDuration = scheduledDuration
        self.completed = completed
        self.lapseCount = lapseCount
        self.longestFocusIntervalSec = longestFocusIntervalSec
        self.focusQuality = focusQuality
        self.mood = mood
        self.stress = stress
        self.energy = energy
        self.journalEntryId = journalEntryId
    }
}
