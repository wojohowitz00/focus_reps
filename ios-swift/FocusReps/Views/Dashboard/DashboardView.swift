import SwiftUI

public struct DashboardView: View {
    @EnvironmentObject var manager: GymManager
    @State private var activeRecommendedPractice: PracticeType? = nil
    @State private var takingSartTest = false
    
    public init() {}
    
    public var body: some View {
        NavigationView {
            ZStack {
                // Background
                Color(red: 0.08, green: 0.10, blue: 0.13)
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        // User Profile Path Header
                        welcomeHeader
                            .padding(.top, 15)
                        
                        // Resilience Shield Quick-Look Ring Card
                        resilienceShieldCard
                        
                        // Recommended practice of the day
                        recommendedPracticeCard
                        
                        // SART Cognitive Lab Callout Card
                        sartCalloutCard
                    }
                    .padding(.bottom, 30)
                }
            }
            .navigationTitle("PeakMind Gym")
            .navigationBarTitleDisplayMode(.inline)
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
    
    // MARK: - Welcome Header
    private var welcomeHeader: some View {
        HStack {
            VStack(alignment: .leading, spacing: 6) {
                if let path = manager.settings.userPath {
                    Text(path.title)
                        .font(.system(size: 12, weight: .bold, design: .rounded))
                        .foregroundColor(.blue)
                        .tracking(1.5)
                        .textCase(.uppercase)
                } else {
                    Text("Attention Gym")
                        .font(.system(size: 12, weight: .bold, design: .rounded))
                        .foregroundColor(.blue)
                        .tracking(1.5)
                        .textCase(.uppercase)
                }
                
                Text("Ready for your Daily Rep?")
                    .font(.system(size: 24, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                
                Text("Train 12 minutes to shield your attention systems.")
                    .font(.system(size: 13))
                    .foregroundColor(.gray)
            }
            Spacer()
        }
        .padding(.horizontal, 20)
    }
    
    // MARK: - Resilience Shield Progress Ring
    private var resilienceShieldCard: some View {
        HStack(spacing: 20) {
            ZStack {
                Circle()
                    .stroke(Color.white.opacity(0.05), lineWidth: 10)
                    .frame(width: 86, height: 86)
                
                Circle()
                    .trim(from: 0, to: CGFloat(manager.resilienceShield) / 100.0)
                    .stroke(
                        LinearGradient(colors: [Color.blue, Color.cyan], startPoint: .topLeading, endPoint: .bottomTrailing),
                        style: StrokeStyle(lineWidth: 10, lineCap: .round)
                    )
                    .frame(width: 86, height: 86)
                    .rotationEffect(.degrees(-90))
                
                VStack(spacing: 0) {
                    Text("\(manager.resilienceShield)%")
                        .font(.system(size: 20, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    Text("Shield")
                        .font(.system(size: 9))
                        .foregroundColor(.gray)
                }
            }
            
            VStack(alignment: .leading, spacing: 6) {
                Text("Rolling Resilience Shield")
                    .font(.system(size: 16, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                
                Text("Based on your rolling 7-day completion. Aim for 5+ sessions to reach 100% and promote to Level 2.")
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
                    .lineLimit(nil)
                    .fixedSize(horizontal: false, vertical: true)
                
                HStack(spacing: 12) {
                    Label("\(manager.currentStreak) day streak", systemImage: "flame.fill")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(.orange)
                    
                    Label("L\(manager.settings.currentLevel.rawValue.replacingOccurrences(of: "L", with: "")) Gym", systemImage: "shield.fill")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(.blue)
                }
                .padding(.top, 2)
            }
            
            Spacer()
        }
        .padding()
        .background(Color(red: 0.12, green: 0.15, blue: 0.19))
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.white.opacity(0.05), lineWidth: 1)
        )
        .padding(.horizontal, 20)
    }
    
    // MARK: - Daily Recommended Practice Card
    private var recommendedPracticeCard: some View {
        let practiceType = manager.getRecommendedPractice()
        let isUnlocked = manager.isPracticeUnlocked(practiceType)
        
        return VStack(alignment: .leading, spacing: 16) {
            HStack {
                Text("Today's Recommended Rep")
                    .font(.system(size: 16, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                Spacer()
                Text("Recommended")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.blue)
                    .padding(.vertical, 4)
                    .padding(.horizontal, 8)
                    .background(Color.blue.opacity(0.15))
                    .cornerRadius(6)
            }
            
            HStack(spacing: 16) {
                ZStack {
                    Circle()
                        .fill(Color.blue.opacity(0.1))
                        .frame(width: 48, height: 48)
                    
                    Image(systemName: practiceIcon(for: practiceType))
                        .font(.system(size: 20))
                        .foregroundColor(.blue)
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(practiceType.name)
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    Text(practiceType.description)
                        .font(.system(size: 13))
                        .foregroundColor(.gray)
                        .lineLimit(2)
                        .fixedSize(horizontal: false, vertical: true)
                }
                Spacer()
            }
            
            Divider()
                .background(Color.white.opacity(0.05))
            
            VStack(alignment: .leading, spacing: 6) {
                Text("Why this rep today:")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.blue)
                Text(recommendedRationale(path: manager.settings.userPath ?? .deepWork, type: practiceType))
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
            }
            .padding(.vertical, 2)
            
            if isUnlocked {
                NavigationLink(destination: PracticeSessionView(practiceType: practiceType)) {
                    Text("Start Recommended Rep")
                        .font(.system(size: 15, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 48)
                        .background(Color.blue)
                        .cornerRadius(12)
                        .shadow(color: Color.blue.opacity(0.3), radius: 6)
                }
                .buttonStyle(PlainButtonStyle())
            } else {
                HStack {
                    Image(systemName: "lock.fill")
                        .foregroundColor(.orange)
                    Text("Pillar locked. Reach L2 to unlock this practice.")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(.orange)
                }
                .frame(maxWidth: .infinity, alignment: .center)
                .padding(.vertical, 12)
                .background(Color.orange.opacity(0.1))
                .cornerRadius(12)
            }
        }
        .padding()
        .background(Color(red: 0.12, green: 0.15, blue: 0.19))
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.white.opacity(0.05), lineWidth: 1)
        )
        .padding(.horizontal, 20)
    }
    
    // MARK: - SART Cognitive Lab Callout
    private var sartCalloutCard: some View {
        HStack(spacing: 16) {
            VStack(alignment: .leading, spacing: 8) {
                Text("SART Focus Lab")
                    .font(.system(size: 16, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                
                Text("Measure your objective attentional lapses, misses, and response speeds with our Go/No-Go lab check.")
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
                    .lineLimit(nil)
                    .fixedSize(horizontal: false, vertical: true)
                
                NavigationLink(destination: SartTestView()) {
                    Text("Take Focus Test")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.blue)
                        .padding(.vertical, 8)
                        .padding(.horizontal, 16)
                        .background(Color.blue.opacity(0.15))
                        .cornerRadius(8)
                }
                .buttonStyle(PlainButtonStyle())
                .padding(.top, 4)
            }
            
            Spacer()
            
            Image(systemName: "bolt.shield.fill")
                .font(.system(size: 40))
                .foregroundColor(.blue.opacity(0.6))
        }
        .padding()
        .background(Color(red: 0.12, green: 0.15, blue: 0.19))
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.white.opacity(0.05), lineWidth: 1)
        )
        .padding(.horizontal, 20)
    }
    
    // MARK: - Helpers
    private func practiceIcon(for type: PracticeType) -> String {
        switch type {
        case .anchorBreath: return "flashlight.on.fill"
        case .bodySweep: return "person.fill.viewfinder"
        case .thoughtTraffic: return "water.waves"
        case .kindnessCircuit: return "heart.circle.fill"
        }
    }
    
    private func recommendedRationale(path: UserPath, type: PracticeType) -> String {
        switch path {
        case .deepWork:
            if type == .anchorBreath {
                return "Sharpen the sustained concentration flashlight. Strengthen your capacity to disengage from distractions and return quickly."
            } else if type == .bodySweep {
                return "Trains swift focus movements and anchors somatic concentration to steady mental stamina."
            } else {
                return " river-of-thought practice tests meta-awareness to let you notice workflow shifts before slipping into distraction."
            }
        case .overwhelm:
            if type == .anchorBreath {
                return "Steadies high-frequency task switching. Ground attention when digital demands pull your focus."
            } else if type == .thoughtTraffic {
                return "Develop cognitive decentering. Observe notification urges and thoughts pass without feeling compelled to click."
            } else {
                return "Stabilizes reactivity under noise and digital friction, grounding emotional stability."
            }
        case .burnout:
            if type == .bodySweep {
                return "Clears deep mental fatigue. Gently redirect focus from heavy cognitive looping back to direct physical sensations."
            } else if type == .kindnessCircuit {
                return "Fosters somatic calming, reduces self-judgment, and lowers performance anxiety under cognitive exhaustion."
            } else {
                return "Brings meta-awareness to negative thought loops, showing they are passing events."
            }
        }
    }
}

struct DashboardView_Previews: PreviewProvider {
    static var previews: some View {
        DashboardView()
            .environmentObject(GymManager())
    }
}
