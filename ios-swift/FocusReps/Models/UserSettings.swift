import Foundation

public enum UserPath: String, Codable, CaseIterable {
    case deepWork = "deep_work"
    case overwhelm = "overwhelm"
    case burnout = "burnout"
    
    public var title: String {
        switch self {
        case .deepWork: return "Deep Work Path"
        case .overwhelm: return "Digital Overwhelm Path"
        case .burnout: return "Burnout & Fog Path"
        }
    }
}

public enum GymLevel: String, Codable, CaseIterable, Comparable {
    case L1
    case L2
    case L3
    
    public var title: String {
        switch self {
        case .L1: return "Level 1: Baseline"
        case .L2: return "Level 2: Expansion"
        case .L3: return "Level 3: Mastery"
        }
    }
    
    // Support Comparable
    public static func < (lhs: GymLevel, rhs: GymLevel) -> Bool {
        switch (lhs, rhs) {
        case (.L1, .L2), (.L1, .L3), (.L2, .L3): return true
        default: return false
        }
    }
}

public struct UserSettings: Codable {
    public var reminderTime: String = "08:00"
    public var defaultDuration: Int = 12
    public var soundEnabled: Bool = true
    public var notificationsEnabled: Bool = true
    public var userPath: UserPath? = nil
    public var currentLevel: GymLevel = .L1
    public var weeklyReminderEnabled: Bool = false
    public var weeklyReminderDay: Int = 0
    public var weeklyReminderTime: String = "19:00"
    public var customPracticeSet: [PracticeType]? = nil
    
    public init() {}
}
