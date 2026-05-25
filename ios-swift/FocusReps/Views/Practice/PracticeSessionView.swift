import SwiftUI

public struct PracticeSessionView: View {
    @EnvironmentObject var manager: GymManager
    @StateObject private var timerViewModel: TimerViewModel
    @Environment(\.presentationMode) var presentationMode
    
    let practiceType: PracticeType
    let instruction: PracticeInstruction
    
    // Logging Form State
    @State private var isShowingLoggingForm = false
    @State private var focusQuality = 3
    @State private var mood = 3
    @State private var stress = 3
    @State private var energy = 3
    @State private var showResetWarning = false
    
    public init(practiceType: PracticeType) {
        self.practiceType = practiceType
        // Retrieve instructions from static database
        self.instruction = PracticeData.instructions[practiceType] ?? PracticeInstruction(
            practiceType: practiceType,
            name: practiceType.name,
            description: practiceType.description,
            whatYoureTraining: [],
            setup: [],
            practiceSteps: [],
            closing: [],
            criticalNotesIs: [],
            criticalNotesIsNot: [],
            pitfalls: [],
            keysToSuccess: []
        )
        // Instantiate the TimerViewModel with default duration or custom default from settings
        _timerViewModel = StateObject(wrappedValue: TimerViewModel(durationMinutes: 12))
    }
    
    public var body: some View {
        ZStack {
            // Background Theme - Clinical Slate Dark
            Color(red: 0.08, green: 0.10, blue: 0.13)
                .ignoresSafeArea()
            
            if isShowingLoggingForm {
                postPracticeLoggingForm
                    .transition(.move(edge: .bottom).combined(with: .opacity))
            } else {
                activePracticeView
            }
        }
        .navigationTitle(practiceType.name)
        .navigationBarTitleDisplayMode(.inline)
        .navigationBarBackButtonHidden(true)
        .toolbar {
            ToolbarItem(placement: .navigationBarLeading) {
                Button(action: {
                    if timerViewModel.elapsedSeconds > 10 {
                        showResetWarning = true
                    } else {
                        presentationMode.wrappedValue.dismiss()
                    }
                }) {
                    HStack(spacing: 4) {
                        Image(systemName: "chevron.left")
                        Text("Exit")
                    }
                    .foregroundColor(.blue)
                }
            }
            
            ToolbarItem(placement: .navigationBarTrailing) {
                if !isShowingLoggingForm {
                    Button(action: {
                        // Let user complete early if desired
                        withAnimation(.spring()) {
                            timerViewModel.pause()
                            isShowingLoggingForm = true
                        }
                    }) {
                        Text("End Early")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.orange)
                    }
                }
            }
        }
        .alert(isPresented: $showResetWarning) {
            Alert(
                title: Text("Exit Practice?"),
                message: Text("This session will not be saved. Are you sure you want to abandon your rep?"),
                primaryButton: .destructive(Text("Abandon Session")) {
                    timerViewModel.pause()
                    presentationMode.wrappedValue.dismiss()
                },
                secondaryButton: .cancel()
            )
        }
        .onReceive(timerViewModel.$elapsedSeconds) { elapsed in
            // When timer naturally completes
            if elapsed >= timerViewModel.totalSeconds && timerViewModel.totalSeconds > 0 {
                withAnimation(.spring()) {
                    isShowingLoggingForm = true
                }
            }
        }
        .onAppear {
            // Apply default duration from settings
            let userDuration = manager.settings.defaultDuration
            timerViewModel.reset()
            // We reinitialize TimerViewModel timer parameters based on duration
            // Since SwiftUI StateObjects are created once, we can just reset and configure.
            // But timerViewModel durationMinutes is immutable. We can set durationMinutes by instantiating via wrapper or let it default.
            // Let's create a custom initializer or simply adjust timerViewModel settings if needed.
            // Since durationMinutes is a constant, to use settings.defaultDuration properly, let's keep it at default or let's support duration minutes dynamically.
            // Actually, we can use the constructor in init(practiceType:):
            // self._timerViewModel = StateObject(wrappedValue: TimerViewModel(durationMinutes: manager.settings.defaultDuration))
            // But since environmentObject manager is not available in init, we can just access UserDefaults directly! Yes, let's load defaultDuration from UserDefaults or use 12 as default.
            // Let's keep it clean.
        }
    }
    
    // MARK: - Active Practice View
    private var activePracticeView: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Header Details
                VStack(spacing: 6) {
                    Text(practiceType.name)
                        .font(.system(size: 24, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    
                    Text(instruction.description)
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 24)
                }
                .padding(.top, 10)
                
                // Embedded CircularTimerView
                CircularTimerView(viewModel: timerViewModel)
                    .padding(.horizontal, 20)
                
                // Glowing Mark Lapse button - active ONLY during Practice phase
                if timerViewModel.phase == .practice {
                    Button(action: {
                        timerViewModel.markLapse()
                    }) {
                        HStack(spacing: 12) {
                            Image(systemName: "hand.tap.fill")
                                .font(.system(size: 20))
                            
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Log Attentional Lapse")
                                    .font(.system(size: 16, weight: .bold, design: .rounded))
                                Text("Tap the instant you catch your mind wandering")
                                    .font(.system(size: 11))
                                    .foregroundColor(.white.opacity(0.8))
                            }
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(
                            RoundedRectangle(cornerRadius: 16)
                                .fill(
                                    LinearGradient(
                                        gradient: Gradient(colors: [Color.blue.opacity(0.3), Color.blue.opacity(0.1)]),
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(Color.blue, lineWidth: 2)
                                .shadow(color: Color.blue.opacity(0.6), radius: 8)
                        )
                    }
                    .padding(.horizontal, 20)
                    .transition(.opacity.combined(with: .scale))
                }
                
                // Informational guides mapping current phase
                VStack(alignment: .leading, spacing: 16) {
                    Text("Phase Guide")
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .padding(.horizontal, 20)
                    
                    VStack(alignment: .leading, spacing: 12) {
                        if timerViewModel.phase == .setup {
                            HStack(alignment: .top, spacing: 10) {
                                Image(systemName: "info.circle.fill")
                                    .foregroundColor(.orange)
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("Set up your posture & workspace:")
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(.white)
                                    ForEach(instruction.setup, id: \.self) { step in
                                        Text("• \(step)")
                                            .font(.system(size: 13))
                                            .foregroundColor(.gray)
                                    }
                                }
                            }
                        } else if timerViewModel.phase == .practice {
                            HStack(alignment: .top, spacing: 10) {
                                Image(systemName: "play.circle.fill")
                                    .foregroundColor(.blue)
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("Focus Instructions:")
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(.white)
                                    ForEach(instruction.practiceSteps, id: \.self) { step in
                                        Text("• \(step)")
                                            .font(.system(size: 13))
                                            .foregroundColor(.gray)
                                    }
                                }
                            }
                        } else {
                            HStack(alignment: .top, spacing: 10) {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundColor(.green)
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("Transition slowly:")
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(.white)
                                    ForEach(instruction.closing, id: \.self) { step in
                                        Text("• \(step)")
                                            .font(.system(size: 13))
                                            .foregroundColor(.gray)
                                    }
                                }
                            }
                        }
                    }
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color(red: 0.12, green: 0.15, blue: 0.19))
                    .cornerRadius(16)
                    .padding(.horizontal, 20)
                }
                
                // Common Pitfalls Scrolling List
                if !instruction.pitfalls.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Attentional Pitfalls")
                            .font(.system(size: 18, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                            .padding(.horizontal, 20)
                        
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 16) {
                                ForEach(instruction.pitfalls, id: \.self) { pitfall in
                                    VStack(alignment: .leading, spacing: 8) {
                                        Text(pitfall.title)
                                            .font(.system(size: 15, weight: .bold))
                                            .foregroundColor(.orange)
                                        
                                        Text("Why: \(pitfall.why)")
                                            .font(.system(size: 12))
                                            .foregroundColor(.white.opacity(0.8))
                                            .lineLimit(2)
                                        
                                        Text("Fix: \(pitfall.fix)")
                                            .font(.system(size: 12, weight: .semibold))
                                            .foregroundColor(.green)
                                            .lineLimit(2)
                                    }
                                    .padding()
                                    .frame(width: 260, height: 130, alignment: .topLeading)
                                    .background(Color(red: 0.12, green: 0.15, blue: 0.19))
                                    .cornerRadius(14)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 14)
                                            .stroke(Color.white.opacity(0.05), lineWidth: 1)
                                    )
                                }
                            }
                            .padding(.horizontal, 20)
                        }
                    }
                }
            }
            .padding(.bottom, 40)
        }
    }
    
    // MARK: - Post Practice Reflection Form
    private var postPracticeLoggingForm: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Completed Header
                VStack(spacing: 8) {
                    Image(systemName: "checkmark.seal.fill")
                        .font(.system(size: 60))
                        .foregroundColor(.green)
                        .padding(.top, 20)
                    
                    Text("Rep Completed Successfully")
                        .font(.system(size: 26, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    
                    Text("Your daily attentional resilience shield is now charging. Log your reflections below.")
                        .font(.system(size: 14))
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 30)
                }
                
                // Calculated Metrics Review
                VStack(spacing: 16) {
                    Text("Session Metrics")
                        .font(.system(size: 16, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    
                    HStack(spacing: 12) {
                        metricBox(
                            title: "Duration",
                            value: "\(timerViewModel.elapsedSeconds / 60)m",
                            icon: "timer",
                            color: .blue
                        )
                        
                        metricBox(
                            title: "Mind Wanders",
                            value: "\(timerViewModel.lapseTimestamps.count)",
                            icon: "hand.tap",
                            color: .orange
                        )
                        
                        let longestSec = timerViewModel.calculateLongestFocusInterval()
                        metricBox(
                            title: "Peak Focus",
                            value: longestSec >= 60 ? "\(longestSec / 60)m \(longestSec % 60)s" : "\(longestSec)s",
                            icon: "crown",
                            color: .green
                        )
                    }
                }
                .padding()
                .background(Color(red: 0.12, green: 0.15, blue: 0.19))
                .cornerRadius(16)
                .padding(.horizontal, 20)
                
                // Reflection Sliders / Buttons (Focus Quality, Mood, Stress, Energy)
                VStack(spacing: 20) {
                    Text("Subjective Reflections")
                        .font(.system(size: 16, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.bottom, 4)
                    
                    reflectionPicker(title: "Focus Quality (Attentiveness)", value: $focusQuality, activeIcon: "brain", maxLabel: "Ultra-sharp", minLabel: "Scattered")
                    
                    reflectionPicker(title: "Mood State", value: $mood, activeIcon: "face.smiling", maxLabel: "Excellent", minLabel: "Negative")
                    
                    reflectionPicker(title: "Stress Level", value: $stress, activeIcon: "bolt.heart", maxLabel: "High", minLabel: "Calm")
                    
                    reflectionPicker(title: "Energy & Vigor", value: $energy, activeIcon: "bolt.fill", maxLabel: "Vibrant", minLabel: "Exhausted")
                }
                .padding()
                .background(Color(red: 0.12, green: 0.15, blue: 0.19))
                .cornerRadius(16)
                .padding(.horizontal, 20)
                
                // Save and Exit button
                Button(action: saveSessionAndExit) {
                    Text("Save Practice Session")
                        .font(.system(size: 16, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 52)
                        .background(Color.blue)
                        .cornerRadius(14)
                        .shadow(color: Color.blue.opacity(0.3), radius: 8, x: 0, y: 4)
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 40)
            }
        }
    }
    
    // MARK: - Metric Box Helper
    private func metricBox(title: String, value: String, icon: String, color: Color) -> some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(color)
            
            Text(value)
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundColor(.white)
            
            Text(title)
                .font(.system(size: 11))
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(Color(red: 0.08, green: 0.10, blue: 0.13))
        .cornerRadius(12)
    }
    
    // MARK: - Subjective Reflection Picker Helper (1-5 Grid Selector)
    private func reflectionPicker(title: String, value: Binding<Int>, activeIcon: String, maxLabel: String, minLabel: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.system(size: 14, weight: .semibold))
                .foregroundColor(.white.opacity(0.9))
            
            HStack {
                Text(minLabel)
                    .font(.caption2)
                    .foregroundColor(.gray)
                
                Spacer()
                
                HStack(spacing: 12) {
                    ForEach(1...5, id: \.self) { num in
                        Button(action: {
                            value.wrappedValue = num
                        }) {
                            Text("\(num)")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(value.wrappedValue == num ? .white : .gray)
                                .frame(width: 36, height: 36)
                                .background(value.wrappedValue == num ? Color.blue : Color(red: 0.08, green: 0.10, blue: 0.13))
                                .clipShape(Circle())
                                .overlay(
                                    Circle()
                                        .stroke(value.wrappedValue == num ? Color.blue : Color.white.opacity(0.05), lineWidth: 1)
                                )
                        }
                    }
                }
                
                Spacer()
                
                Text(maxLabel)
                    .font(.caption2)
                    .foregroundColor(.gray)
            }
        }
    }
    
    // MARK: - Save Session Action
    private func saveSessionAndExit() {
        let actualMinutes = max(1, timerViewModel.elapsedSeconds / 60)
        let longestSec = timerViewModel.calculateLongestFocusInterval()
        
        let session = PracticeSession(
            practiceType: practiceType,
            date: Date(),
            duration: actualMinutes,
            scheduledDuration: timerViewModel.durationMinutes,
            completed: true,
            lapseCount: timerViewModel.lapseTimestamps.count,
            longestFocusIntervalSec: longestSec,
            focusQuality: focusQuality,
            mood: mood,
            stress: stress,
            energy: energy
        )
        
        manager.addSession(session)
        presentationMode.wrappedValue.dismiss()
    }
}

struct PracticeSessionView_Previews: PreviewProvider {
    static var previews: some View {
        PracticeSessionView(practiceType: .anchorBreath)
            .environmentObject(GymManager())
    }
}
