import Foundation
import Combine
import AudioToolbox

public enum SartTestState {
    case instructions
    case countdown
    case active
    case results
}

public class SartViewModel: ObservableObject {
    @Published public var state: SartTestState = .instructions
    @Published public var countdown: Int = 3
    @Published public var trialIndex: Int = 0
    @Published public var currentDigit: Int? = nil
    @Published public var showDigit: Bool = false
    
    // Stats
    @Published public var lapses: Int = 0
    @Published public var misses: Int = 0
    @Published public var avgReactionTimeMs: Int = 0
    @Published public var focusScore: Int = 0
    
    private var countdownTimer: Timer? = nil
    private var trialTimer: Timer? = nil
    private var digitHideTimer: Timer? = nil
    
    private var reactionTimes: [Double] = []
    private var trialStartTime: Date = Date()
    private var isDigit3: Bool = false
    private var hasTappedThisTrial: Bool = false
    
    // Game constants
    private let totalTrials = 45
    private let trialDurationSec: Double = 1.2
    private let digitVisibleSec: Double = 0.25
    
    public init() {}
    
    public func startCountdown() {
        state = .countdown
        countdown = 3
        
        countdownTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            if self.countdown <= 1 {
                self.countdownTimer?.invalidate()
                self.countdownTimer = nil
                self.startTest()
            } else {
                self.countdown -= 1
            }
        }
    }
    
    private func startTest() {
        state = .active
        trialIndex = 0
        lapses = 0
        misses = 0
        reactionTimes.removeAll()
        focusScore = 0
        
        runNextTrial()
    }
    
    private func runNextTrial() {
        guard trialIndex < totalTrials else {
            endTest()
            return
        }
        
        trialIndex += 1
        hasTappedThisTrial = false
        
        // Randomly pick a digit (15% probability of digit 3)
        let is3 = Double.random(in: 0...1) < 0.15
        let digit: Int
        if is3 {
            digit = 3
        } else {
            let goDigits = [1, 2, 4, 5, 6, 7, 8, 9]
            digit = goDigits[Int.random(in: 0..<goDigits.count)]
        }
        
        isDigit3 = digit == 3
        currentDigit = digit
        showDigit = true
        trialStartTime = Date()
        
        // Hide digit after 250ms
        digitHideTimer = Timer.scheduledTimer(withTimeInterval: digitVisibleSec, repeats: false) { [weak self] _ in
            self?.showDigit = false
        }
        
        // Schedule next trial after 1200ms
        trialTimer = Timer.scheduledTimer(withTimeInterval: trialDurationSec, repeats: false) { [weak self] _ in
            guard let self = self else { return }
            self.evaluateTrialEnd()
            self.runNextTrial()
        }
    }
    
    private func evaluateTrialEnd() {
        // If it was a GO target (not 3) and user did not tap, it's a MISS
        if !isDigit3 && !hasTappedThisTrial {
            misses += 1
        }
    }
    
    public func handleTap() {
        guard state == .active && !hasTappedThisTrial else { return }
        
        hasTappedThisTrial = true
        let tapTime = Date()
        let rt = tapTime.timeIntervalSince(trialStartTime) * 1000.0 // in milliseconds
        
        if isDigit3 {
            // Commission Error (Lapse)
            lapses += 1
            AudioServicesPlaySystemSound(1057) // Taptic buzz
        } else {
            // Correct tap
            reactionTimes.append(rt)
        }
    }
    
    private func endTest() {
        state = .results
        showDigit = false
        currentDigit = nil
        
        // Calculate average reaction speed
        if !reactionTimes.isEmpty {
            self.avgReactionTimeMs = Int(reactionTimes.reduce(0.0, +) / Double(reactionTimes.count))
        } else {
            self.avgReactionTimeMs = 0
        }
        
        // Focus score calculation matching typescript
        let baseScore = 100 - (lapses * 8) - (misses * 4)
        self.focusScore = max(0, min(100, baseScore))
        
        AudioServicesPlaySystemSound(1022) // native notification chime
    }
    
    public func cleanup() {
        countdownTimer?.invalidate()
        trialTimer?.invalidate()
        digitHideTimer?.invalidate()
    }
}
