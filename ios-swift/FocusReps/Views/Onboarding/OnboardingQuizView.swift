import SwiftUI

public struct OnboardingQuizView: View {
    @EnvironmentObject var manager: GymManager
    @State private var currentStep = 0
    @State private var selectedPath: UserPath? = nil
    @State private var selectedDuration = 12
    @State private var animateIn = false
    
    // Callback for completion
    public var onComplete: () -> Void
    
    public init(onComplete: @escaping () -> Void) {
        self.onComplete = onComplete
    }
    
    public var body: some View {
        ZStack {
            // Background color palette - Clinical but Calm (Rich dark slates)
            Color(red: 0.08, green: 0.10, blue: 0.13)
                .ignoresSafeArea()
            
            VStack {
                // Top Progress indicator
                HStack(spacing: 8) {
                    ForEach(0..<2) { index in
                        Capsule()
                            .fill(index <= currentStep ? Color.blue : Color.gray.opacity(0.3))
                            .frame(height: 6)
                            .animation(.spring(), value: currentStep)
                    }
                }
                .padding(.horizontal, 40)
                .padding(.top, 20)
                
                Spacer()
                
                if currentStep == 0 {
                    stepOneView
                        .transition(.asymmetric(insertion: .move(edge: .trailing), removal: .move(edge: .leading)))
                } else {
                    stepTwoView
                        .transition(.asymmetric(insertion: .move(edge: .trailing), removal: .move(edge: .leading)))
                }
                
                Spacer()
                
                // Bottom control buttons
                HStack {
                    if currentStep > 0 {
                        Button(action: {
                            withAnimation(.spring()) {
                                currentStep -= 1
                            }
                        }) {
                            Text("Back")
                                .font(.system(size: 16, weight: .semibold, design: .rounded))
                                .foregroundColor(.blue)
                                .frame(width: 100, height: 50)
                                .background(
                                    RoundedRectangle(cornerRadius: 14)
                                        .stroke(Color.blue.opacity(0.4), lineWidth: 1.5)
                                )
                        }
                    }
                    
                    Spacer()
                    
                    Button(action: {
                        if currentStep == 0 {
                            if selectedPath != nil {
                                withAnimation(.spring()) {
                                    currentStep += 1
                                }
                            }
                        } else {
                            saveAndFinish()
                        }
                    }) {
                        Text(currentStep == 0 ? "Next" : "Get Started")
                            .font(.system(size: 16, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                            .frame(maxWidth: currentStep > 0 ? .infinity : 120)
                            .frame(height: 50)
                            .background(
                                (currentStep == 0 ? selectedPath != nil : true)
                                ? Color.blue
                                : Color.blue.opacity(0.3)
                            )
                            .cornerRadius(14)
                            .shadow(color: Color.blue.opacity(0.3), radius: 8, x: 0, y: 4)
                    }
                    .disabled(currentStep == 0 && selectedPath == nil)
                }
                .padding(.horizontal, 30)
                .padding(.bottom, 30)
            }
        }
        .onAppear {
            withAnimation(.easeOut(duration: 0.6)) {
                animateIn = true
            }
        }
    }
    
    // MARK: - Step 1: User Path Selection
    private var stepOneView: some View {
        VStack(spacing: 25) {
            VStack(spacing: 8) {
                Text("Attention Recovery")
                    .font(.system(size: 14, weight: .bold, design: .rounded))
                    .foregroundColor(.blue)
                    .tracking(2)
                    .textCase(.uppercase)
                
                Text("Identify Your Focus Goal")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                
                Text("Select the profile that matches your current attention state. We'll tailor your recommended 12-minute daily reps.")
                    .font(.system(size: 15))
                    .foregroundColor(Color.gray.opacity(0.9))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 20)
            }
            .opacity(animateIn ? 1 : 0)
            .offset(y: animateIn ? 0 : 20)
            
            VStack(spacing: 16) {
                pathCard(
                    path: .deepWork,
                    title: "Optimize Deep Work",
                    desc: "Hone high-intensity mental focus, increase return speed, and block deep-task distractions.",
                    icon: "target"
                )
                
                pathCard(
                    path: .overwhelm,
                    title: "Digital Overwhelm",
                    desc: "Build resilience against constant notification loops, task switching, and online noise.",
                    icon: "iphone"
                )
                
                pathCard(
                    path: .burnout,
                    title: "Recover from Burnout",
                    desc: "Clear chronic brain fog, somatic tension, and severe cognitive exhaustion with gentle anchors.",
                    icon: "battery.50"
                )
            }
            .padding(.horizontal, 20)
        }
    }
    
    // MARK: - Step 2: Session Duration
    private var stepTwoView: some View {
        VStack(spacing: 30) {
            VStack(spacing: 8) {
                Text("Daily Rep Duration")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                
                Text("Jha Lab cognitive studies indicate 12 minutes is the foundational minimum dose required for noticeable attention shielding.")
                    .font(.system(size: 15))
                    .foregroundColor(Color.gray.opacity(0.9))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 20)
            }
            
            VStack(spacing: 20) {
                ForEach([12, 15, 20], id: \.self) { mins in
                    Button(action: {
                        selectedDuration = mins
                    }) {
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("\(mins) Minutes")
                                    .font(.system(size: 18, weight: .bold, design: .rounded))
                                    .foregroundColor(.white)
                                
                                if mins == 12 {
                                    Text("Clinical Minimum Dose (Recommended)")
                                        .font(.system(size: 13, weight: .medium))
                                        .foregroundColor(.blue)
                                } else if mins == 15 {
                                    Text("Standard Training Dose")
                                        .font(.system(size: 13, weight: .medium))
                                        .foregroundColor(.gray)
                                } else {
                                    Text("Enhanced Resilience Dose")
                                        .font(.system(size: 13, weight: .medium))
                                        .foregroundColor(.gray)
                                }
                            }
                            Spacer()
                            
                            Image(systemName: selectedDuration == mins ? "largecircle.fill.circle" : "circle")
                                .font(.system(size: 22))
                                .foregroundColor(selectedDuration == mins ? .blue : .gray.opacity(0.5))
                        }
                        .padding(.all, 20)
                        .background(
                            RoundedRectangle(cornerRadius: 16)
                                .fill(Color(red: 0.12, green: 0.15, blue: 0.19))
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(selectedDuration == mins ? Color.blue : Color.white.opacity(0.05), lineWidth: 1.5)
                        )
                    }
                }
            }
            .padding(.horizontal, 20)
        }
    }
    
    // MARK: - Card Helper
    private func pathCard(path: UserPath, title: String, desc: String, icon: String) -> some View {
        Button(action: {
            withAnimation(.spring()) {
                selectedPath = path
            }
        }) {
            HStack(alignment: .center, spacing: 16) {
                ZStack {
                    Circle()
                        .fill(selectedPath == path ? Color.blue.opacity(0.2) : Color.white.opacity(0.05))
                        .frame(width: 50, height: 50)
                    
                    Image(systemName: icon)
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(selectedPath == path ? .blue : .white.opacity(0.7))
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(title)
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    
                    Text(desc)
                        .font(.system(size: 13))
                        .foregroundColor(Color.gray.opacity(0.9))
                        .multilineTextAlignment(.leading)
                        .lineLimit(2)
                }
                
                Spacer()
                
                Image(systemName: selectedPath == path ? "largecircle.fill.circle" : "circle")
                    .font(.system(size: 22))
                    .foregroundColor(selectedPath == path ? .blue : .gray.opacity(0.5))
            }
            .padding(.all, 20)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(Color(red: 0.12, green: 0.15, blue: 0.19))
            )
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(selectedPath == path ? Color.blue : Color.white.opacity(0.05), lineWidth: 1.5)
            )
            .scaleEffect(selectedPath == path ? 1.02 : 1.0)
            .animation(.spring(), value: selectedPath)
        }
    }
    
    // MARK: - Save Settings
    private func saveAndFinish() {
        manager.settings.userPath = selectedPath
        manager.settings.defaultDuration = selectedDuration
        manager.saveSettings()
        
        onComplete()
    }
}

struct OnboardingQuizView_Previews: PreviewProvider {
    static var previews: some View {
        OnboardingQuizView(onComplete: {})
            .environmentObject(GymManager())
    }
}
