import SwiftUI

public struct SartTestView: View {
    @EnvironmentObject var manager: GymManager
    @StateObject private var viewModel = SartViewModel()
    @Environment(\.presentationMode) var presentationMode
    
    public init() {}
    
    public var body: some View {
        ZStack {
            // Background Theme
            Color(red: 0.08, green: 0.10, blue: 0.13)
                .ignoresSafeArea()
            
            switch viewModel.state {
            case .instructions:
                instructionsView
            case .countdown:
                countdownView
            case .active:
                activeTestingView
            case .results:
                resultsView
            }
        }
        .navigationBarHidden(viewModel.state == .active || viewModel.state == .countdown)
        .onDisappear {
            viewModel.cleanup()
        }
    }
    
    // MARK: - Instructions View
    private var instructionsView: some View {
        VStack(spacing: 24) {
            Spacer()
            
            Image(systemName: "bolt.shield")
                .font(.system(size: 64))
                .foregroundColor(.blue)
            
            VStack(spacing: 12) {
                Text("SART-Lite Focus Test")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                
                Text("Objective Attention Assessment")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.blue)
                    .tracking(1.5)
                    .textCase(.uppercase)
            }
            
            VStack(alignment: .leading, spacing: 16) {
                Text("How to play:")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.white)
                
                instructionRow(icon: "1.circle.fill", text: "Single digits (1-9) will flash on the screen every 1.2 seconds.")
                instructionRow(icon: "hand.tap.fill", text: "Tap the screen as FAST as possible for every number.")
                instructionRow(icon: "hand.raised.fill", text: "WITHHOLD response (DO NOT TAP) if the number 3 appears.")
                instructionRow(icon: "timer", text: "The test lasts approximately 60 seconds (45 trials). Stay sharp!")
            }
            .padding()
            .background(Color(red: 0.12, green: 0.15, blue: 0.19))
            .cornerRadius(16)
            .padding(.horizontal, 24)
            
            Spacer()
            
            Button(action: {
                withAnimation {
                    viewModel.startCountdown()
                }
            }) {
                Text("Start Assessment")
                    .font(.system(size: 16, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 52)
                    .background(Color.blue)
                    .cornerRadius(14)
                    .shadow(color: Color.blue.opacity(0.3), radius: 8)
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 30)
        }
    }
    
    private func instructionRow(icon: String, text: String) -> some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(.blue)
            Text(text)
                .font(.system(size: 13))
                .foregroundColor(.gray)
                .lineLimit(nil)
                .fixedSize(horizontal: false, vertical: true)
        }
    }
    
    // MARK: - Countdown View
    private var countdownView: some View {
        VStack {
            Text("\(viewModel.countdown)")
                .font(.system(size: 100, weight: .black, design: .rounded))
                .foregroundColor(.blue)
                .scaleEffect(viewModel.countdown > 0 ? 1.2 : 0.8)
                .animation(.easeInOut(duration: 0.5), value: viewModel.countdown)
            
            Text("GET READY")
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(.gray)
                .tracking(2)
        }
    }
    
    // MARK: - Active Testing View
    private var activeTestingView: some View {
        // Tapping anywhere on the screen triggers handleTap()
        ZStack {
            Color(red: 0.05, green: 0.06, blue: 0.08)
                .ignoresSafeArea()
            
            VStack {
                // Progress Bar
                ProgressView(value: Double(viewModel.trialIndex), total: 45)
                    .progressViewStyle(LinearProgressViewStyle(tint: .blue))
                    .padding(.horizontal, 30)
                    .padding(.top, 20)
                
                Spacer()
                
                ZStack {
                    // Center Mask crosshair placeholder
                    Circle()
                        .stroke(Color.white.opacity(0.05), lineWidth: 2)
                        .frame(width: 140, height: 140)
                    
                    Text("+")
                        .font(.system(size: 32, weight: .light))
                        .foregroundColor(.white.opacity(0.1))
                    
                    if viewModel.showDigit, let digit = viewModel.currentDigit {
                        Text("\(digit)")
                            .font(.system(size: 90, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                            .transition(.scale.combined(with: .opacity))
                    }
                }
                .frame(width: 200, height: 200)
                
                Spacer()
                
                Text("Tap Anywhere (except on 3)")
                    .font(.system(size: 12))
                    .foregroundColor(.gray.opacity(0.5))
                    .padding(.bottom, 40)
            }
        }
        .contentShape(Rectangle()) // Make the whole screen area tap receptive
        .onTapGesture {
            viewModel.handleTap()
        }
    }
    
    // MARK: - Results View
    private var resultsView: some View {
        ScrollView {
            VStack(spacing: 24) {
                VStack(spacing: 8) {
                    Text("Assessment Complete")
                        .font(.system(size: 26, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .padding(.top, 30)
                    
                    Text("OBJECTIVE ATTENTION METRICS")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.blue)
                        .tracking(1.5)
                }
                
                // Ring Graphic displaying Focus Score
                ZStack {
                    Circle()
                        .stroke(Color.white.opacity(0.05), lineWidth: 14)
                        .frame(width: 160, height: 160)
                    
                    Circle()
                        .trim(from: 0, to: CGFloat(viewModel.focusScore) / 100.0)
                        .stroke(
                            LinearGradient(colors: [Color.blue, Color.cyan], startPoint: .top, endPoint: .bottom),
                            style: StrokeStyle(lineWidth: 14, lineCap: .round)
                        )
                        .frame(width: 160, height: 160)
                        .rotationEffect(.degrees(-90))
                    
                    VStack(spacing: 2) {
                        Text("\(viewModel.focusScore)")
                            .font(.system(size: 48, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                        Text("Focus Score")
                            .font(.system(size: 12))
                            .foregroundColor(.gray)
                    }
                }
                .padding(.vertical, 10)
                
                // Stats Grid
                VStack(spacing: 16) {
                    HStack(spacing: 16) {
                        resultsStatCard(
                            title: "Lapses (Tapped on 3)",
                            value: "\(viewModel.lapses)",
                            desc: "Commission Errors",
                            color: .orange
                        )
                        
                        resultsStatCard(
                            title: "Misses (No tap on other)",
                            value: "\(viewModel.misses)",
                            desc: "Omission Errors",
                            color: .red
                        )
                    }
                    
                    resultsStatCard(
                        title: "Avg Reaction Speed",
                        value: "\(viewModel.avgReactionTimeMs) ms",
                        desc: "Correct trial tap speed",
                        color: .blue
                    )
                }
                .padding(.horizontal, 20)
                
                // Score feedback
                VStack(alignment: .leading, spacing: 8) {
                    Text("Focus Quality Feedback")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.white)
                    Text(focusFeedback(score: viewModel.focusScore))
                        .font(.system(size: 13))
                        .foregroundColor(.gray)
                        .lineLimit(nil)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding()
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color(red: 0.12, green: 0.15, blue: 0.19))
                .cornerRadius(16)
                .padding(.horizontal, 20)
                
                // Save and Dismiss
                Button(action: saveResultAndExit) {
                    Text("Log SART Results & Exit")
                        .font(.system(size: 16, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 52)
                        .background(Color.blue)
                        .cornerRadius(14)
                        .shadow(color: Color.blue.opacity(0.3), radius: 8)
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 40)
            }
        }
    }
    
    private func resultsStatCard(title: String, value: String, desc: String, color: Color) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.gray)
            
            Text(value)
                .font(.system(size: 20, weight: .bold, design: .rounded))
                .foregroundColor(.white)
            
            Text(desc)
                .font(.system(size: 11))
                .foregroundColor(color)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(red: 0.12, green: 0.15, blue: 0.19))
        .cornerRadius(14)
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(Color.white.opacity(0.05), lineWidth: 1)
        )
    }
    
    private func focusFeedback(score: Int) -> String {
        if score >= 90 {
            return "Exceptional focus stability! You successfully sustained selective visual attention, keeping commission lapses and omission misses near zero. Your cognitive control is primed."
        } else if score >= 75 {
            return "Good target tracking. A few minor attentional lapses or delayed reaction periods were captured, indicating light fluctuations in focus but healthy executive baseline control."
        } else {
            return "Scattered focus captured. High lapses (commission taps on 3) suggest high impulsivity or digital fatigue. Dedicate time to anchor-based reps to recharge selective attention circuits."
        }
    }
    
    private func saveResultAndExit() {
        let result = SartTestResult(
            lapses: viewModel.lapses,
            misses: viewModel.misses,
            avgReactionTimeMs: viewModel.avgReactionTimeMs,
            focusScore: viewModel.focusScore
        )
        manager.addSartResult(result)
        presentationMode.wrappedValue.dismiss()
    }
}

struct SartTestView_Previews: PreviewProvider {
    static var previews: some View {
        SartTestView()
            .environmentObject(GymManager())
    }
}
