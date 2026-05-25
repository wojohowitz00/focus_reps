import Foundation
import Combine
import AudioToolbox

public enum TimerPhase: String {
    case setup = "Setup"
    case practice = "Practice"
    case closing = "Closing"
}

public class TimerViewModel: ObservableObject {
    @Published public var phase: TimerPhase = .setup
    @Published public var isRunning: Bool = false
    @Published public var elapsedSeconds: Int = 0
    @Published public var lapseTimestamps: [Int] = []
    
    public let durationMinutes: Int
    private var timer: Timer? = nil
    
    // Constants matching typescript
    public let setupSeconds = 90 // 1.5 minutes
    public let closingSeconds = 60 // 1 minute
    
    public var totalSeconds: Int { durationMinutes * 60 }
    public var practiceSeconds: Int { max(0, totalSeconds - setupSeconds - closingSeconds) }
    
    public var isPracticePhase: Bool {
        elapsedSeconds >= setupSeconds && elapsedSeconds < (totalSeconds - closingSeconds)
    }
    
    public var timeRemaining: Int {
        totalSeconds - elapsedSeconds
    }
    
    public var progress: Double {
        let currentPhaseStart: Double
        let currentPhaseDuration: Double
        
        switch phase {
        case .setup:
            currentPhaseStart = 0
            currentPhaseDuration = Double(setupSeconds)
        case .practice:
            currentPhaseStart = Double(setupSeconds)
            currentPhaseDuration = Double(practiceSeconds)
        case .closing:
            currentPhaseStart = Double(setupSeconds + practiceSeconds)
            currentPhaseDuration = Double(closingSeconds)
        }
        
        let elapsedInPhase = Double(elapsedSeconds) - currentPhaseStart
        return min(max(0, elapsedInPhase / currentPhaseDuration), 1.0)
    }
    
    public init(durationMinutes: Int = 12) {
        self.durationMinutes = durationMinutes
    }
    
    public func start() {
        guard !isRunning else { return }
        isRunning = true
        
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            self?.tick()
        }
    }
    
    public func pause() {
        isRunning = false
        timer?.invalidate()
        timer = nil
    }
    
    public func reset() {
        pause()
        elapsedSeconds = 0
        phase = .setup
        lapseTimestamps.removeAll()
    }
    
    private func tick() {
        guard elapsedSeconds < totalSeconds else {
            completeSession()
            return
        }
        
        elapsedSeconds += 1
        
        // Handle Phase Transitions
        if phase == .setup && elapsedSeconds >= setupSeconds {
            phase = .practice
            playSystemSound(id: 1005) // Bell chime
        } else if phase == .practice && elapsedSeconds >= (setupSeconds + practiceSeconds) {
            phase = .closing
            playSystemSound(id: 1005) // Bell chime
        }
    }
    
    public func markLapse() {
        guard isPracticePhase else { return }
        let practiceElapsed = max(0, elapsedSeconds - setupSeconds)
        
        // Prevent duplicate lapse logging within the same second
        if lapseTimestamps.last != practiceElapsed {
            lapseTimestamps.append(practiceElapsed)
            playSystemSound(id: 1057) // Taptic feedback vibration trigger
        }
    }
    
    public func calculateLongestFocusInterval() -> Int {
        let totalPracticeSec = practiceSeconds
        guard totalPracticeSec > 0 else { return 0 }
        if lapseTimestamps.isEmpty { return totalPracticeSec }
        
        let sorted = lapseTimestamps.sorted()
        var longest = sorted[0]
        var previous = sorted[0]
        
        for i in 1..<sorted.count {
            let interval = sorted[i] - previous
            if interval > longest {
                longest = interval
            }
            previous = sorted[i]
        }
        
        let tailInterval = totalPracticeSec - previous
        if tailInterval > longest {
            longest = tailInterval
        }
        
        return max(0, longest)
    }
    
    private func completeSession() {
        pause()
        playSystemSound(id: 1022) // Completion fanfare chime
    }
    
    private func playSystemSound(id: SystemSoundID) {
        // Triggers standard native iOS chimes and taptics
        AudioServicesPlaySystemSound(id)
    }
}
