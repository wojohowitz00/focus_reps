import Foundation
import Combine

public class GymManager: ObservableObject {
    @Published public var settings: UserSettings = UserSettings()
    @Published public var sessions: [PracticeSession] = []
    @Published public var sartHistory: [SartTestResult] = []
    @Published public var resilienceShield: Int = 0
    @Published public var currentStreak: Int = 0
    @Published public var longestStreak: Int = 0
    
    private let settingsKey = "@peak_mind:settings"
    private let sessionsKey = "@peak_mind:sessions"
    private let sartHistoryKey = "@peak_mind:sart_history"
    
    public init() {
        loadData()
    }
    
    public func loadData() {
        let decoder = JSONDecoder()
        
        // Load settings
        if let data = UserDefaults.standard.data(forKey: settingsKey),
           let decoded = try? decoder.decode(UserSettings.self, from: data) {
            self.settings = decoded
        } else {
            self.settings = UserSettings()
        }
        
        // Load sessions
        if let data = UserDefaults.standard.data(forKey: sessionsKey),
           let decoded = try? decoder.decode([PracticeSession].self, from: data) {
            self.sessions = decoded
        } else {
            self.sessions = []
        }
        
        // Load SART history
        if let data = UserDefaults.standard.data(forKey: sartHistoryKey),
           let decoded = try? decoder.decode([SartTestResult].self, from: data) {
            self.sartHistory = decoded
        } else {
            self.sartHistory = []
        }
        
        calculateMetrics()
    }
    
    public func saveSettings() {
        let encoder = JSONEncoder()
        if let encoded = try? encoder.encode(settings) {
            UserDefaults.standard.set(encoded, forKey: settingsKey)
        }
    }
    
    public func addSession(_ session: PracticeSession) {
        sessions.append(session)
        let encoder = JSONEncoder()
        if let encoded = try? encoder.encode(sessions) {
            UserDefaults.standard.set(encoded, forKey: sessionsKey)
        }
        calculateMetrics()
    }
    
    public func addSartResult(_ result: SartTestResult) {
        sartHistory.append(result)
        let encoder = JSONEncoder()
        if let encoded = try? encoder.encode(sartHistory) {
            UserDefaults.standard.set(encoded, forKey: sartHistoryKey)
        }
        calculateMetrics()
    }
    
    public func calculateMetrics() {
        // 1. Calculate Rolling 7-day Active Days & Resilience Shield
        let now = Date()
        let calendar = Calendar.current
        guard let sevenDaysAgo = calendar.date(byAdding: .day, value: -7, to: now) else { return }
        
        let recentCompletedSessions = sessions.filter {
            $0.completed && $0.date >= sevenDaysAgo && $0.date <= now
        }
        
        let uniqueDaysString = Set(recentCompletedSessions.map {
            let components = calendar.dateComponents([.year, .month, .day], from: $0.date)
            return "\(components.year!)-\(components.month!)-\(components.day!)"
        })
        
        let activeDaysCount = uniqueDaysString.count
        self.resilienceShield = min(100, activeDaysCount * 20)
        
        // 2. Dynamic Level Advancement Promotion
        var activeLevel = settings.currentLevel
        var promoted = false
        
        if activeDaysCount >= 5 && activeLevel == .L1 {
            activeLevel = .L2
            promoted = true
        }
        if activeDaysCount >= 6 && (activeLevel == .L1 || activeLevel == .L2) {
            activeLevel = .L3
            promoted = true
        }
        
        if promoted {
            settings.currentLevel = activeLevel
            saveSettings()
        }
        
        // 3. Streak Calculations
        calculateStreakValues()
    }
    
    private func calculateStreakValues() {
        let completedSessions = sessions.filter { $0.completed }.sorted { $0.date > $1.date }
        if completedSessions.isEmpty {
            self.currentStreak = 0
            self.longestStreak = 0
            return
        }
        
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        
        // Check if user practiced today or yesterday to continue streak
        let lastSessionDate = calendar.startOfDay(for: completedSessions[0].date)
        let daysDiff = calendar.dateComponents([.day], from: lastSessionDate, to: today).day ?? 0
        
        if daysDiff > 1 {
            self.currentStreak = 0
        } else {
            var streak = 0
            var checkDate = lastSessionDate
            var sessionIndex = 0
            
            while sessionIndex < completedSessions.count {
                let sessionDate = calendar.startOfDay(for: completedSessions[sessionIndex].date)
                
                if sessionDate == checkDate {
                    streak += 1
                    checkDate = calendar.date(byAdding: .day, value: -1, to: checkDate)!
                    sessionIndex += 1
                } else if sessionDate < checkDate {
                    break // Gap found
                } else {
                    sessionIndex += 1 // Skip duplicates on same day
                }
            }
            self.currentStreak = streak
        }
        
        // Calculate Longest Streak
        var longest = 0
        var current = 0
        var lastDate: Date? = nil
        let ascendingSessions = completedSessions.sorted { $0.date < $1.date }
        
        for session in ascendingSessions {
            let sessionDate = calendar.startOfDay(for: session.date)
            guard let previous = lastDate else {
                current = 1
                lastDate = sessionDate
                continue
            }
            
            let daysBetween = calendar.dateComponents([.day], from: previous, to: sessionDate).day ?? 0
            if daysBetween == 1 {
                current += 1
            } else if daysBetween > 1 {
                longest = max(longest, current)
                current = 1
            }
            lastDate = sessionDate
        }
        self.longestStreak = max(longest, current)
    }
    
    // Dynamic Practice Selector mapping Path & Level unlocks
    public func getRecommendedPractice() -> PracticeType {
        guard let path = settings.userPath else { return .anchorBreath }
        let level = settings.currentLevel
        
        let calendar = Calendar.current
        let day = calendar.component(.weekday, from: Date()) // 1-7
        
        switch level {
        case .L1:
            if path == .burnout {
                return .bodySweep // Somatic grounding focus
            }
            return .anchorBreath
            
        case .L2:
            switch path {
            case .deepWork:
                return day % 2 == 1 ? .anchorBreath : .bodySweep
            case .overwhelm:
                return day % 2 == 1 ? .anchorBreath : .thoughtTraffic
            case .burnout:
                return day % 2 == 1 ? .bodySweep : .kindnessCircuit
            }
            
        case .L3:
            if let custom = settings.customPracticeSet, !custom.isEmpty {
                let idx = (day - 1) % custom.count
                return custom[idx]
            }
            switch path {
            case .deepWork:
                return day % 3 == 0 ? .thoughtTraffic : day % 3 == 1 ? .anchorBreath : .bodySweep
            case .overwhelm:
                return day % 3 == 0 ? .kindnessCircuit : day % 3 == 1 ? .anchorBreath : .thoughtTraffic
            case .burnout:
                return day % 3 == 0 ? .kindnessCircuit : day % 3 == 1 ? .bodySweep : .thoughtTraffic
            }
        }
    }
    
    public func isPracticeUnlocked(_ type: PracticeType) -> Bool {
        if settings.currentLevel == .L1 {
            return type == .anchorBreath || type == .bodySweep
        }
        return true
    }
}
