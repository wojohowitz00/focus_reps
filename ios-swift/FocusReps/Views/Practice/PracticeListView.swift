import SwiftUI

public struct PracticeListView: View {
    @EnvironmentObject var manager: GymManager
    @State private var selectedPracticeToUnlock: PracticeType? = nil
    @State private var showingUnlockAlert = false
    
    public init() {}
    
    public var body: some View {
        NavigationView {
            ZStack {
                // Background clinical theme
                Color(red: 0.08, green: 0.10, blue: 0.13)
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 20) {
                        // Level Info Banner
                        levelBanner
                            .padding(.top, 10)
                        
                        // List of Practices
                        VStack(spacing: 16) {
                            Text("Attention Training Pillars")
                                .font(.system(size: 18, weight: .bold, design: .rounded))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(.horizontal, 20)
                            
                            ForEach(PracticeType.allCases) { type in
                                let unlocked = manager.isPracticeUnlocked(type)
                                
                                if unlocked {
                                    NavigationLink(destination: PracticeSessionView(practiceType: type)) {
                                        practiceRow(type: type, isUnlocked: true)
                                    }
                                    .buttonStyle(PlainButtonStyle())
                                } else {
                                    Button(action: {
                                        selectedPracticeToUnlock = type
                                        showingUnlockAlert = true
                                    }) {
                                        practiceRow(type: type, isUnlocked: false)
                                    }
                                    .buttonStyle(PlainButtonStyle())
                                }
                            }
                        }
                    }
                    .padding(.bottom, 30)
                }
            }
            .navigationTitle("Attention Gym")
            .navigationBarTitleDisplayMode(.large)
            .alert(isPresented: $showingUnlockAlert) {
                let practiceName = selectedPracticeToUnlock?.name ?? "Practice"
                return Alert(
                    title: Text("Pillar Locked 🔒"),
                    message: Text("'\(practiceName)' is locked at Level 1. Complete at least 5 active practice days in a rolling 7-day window to reach Level 2 and unlock River of Thought and Connection Practice."),
                    dismissButton: .default(Text("Got it"))
                )
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
    
    // MARK: - Level Banner Info Box
    private var levelBanner: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text(manager.settings.currentLevel.title)
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                
                Spacer()
                
                Text("\(manager.resilienceShield)% Shield")
                    .font(.system(size: 13, weight: .bold, design: .rounded))
                    .foregroundColor(.blue)
                    .padding(.vertical, 4)
                    .padding(.horizontal, 8)
                    .background(Color.blue.opacity(0.15))
                    .cornerRadius(6)
            }
            
            Text(levelDescription(for: manager.settings.currentLevel))
                .font(.system(size: 13))
                .foregroundColor(.gray)
                .lineLimit(2)
                .fixedSize(horizontal: false, vertical: true)
            
            // Level progress indicator
            let activeDays = manager.resilienceShield / 20
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text("Rolling Weekly Active Days:")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(.white.opacity(0.7))
                    Spacer()
                    Text("\(activeDays) / 7 days")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(.blue)
                }
                
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        Capsule()
                            .fill(Color.white.opacity(0.05))
                            .frame(height: 6)
                        
                        Capsule()
                            .fill(Color.blue)
                            .frame(width: geo.size.width * CGFloat(activeDays) / 7.0, height: 6)
                    }
                }
                .frame(height: 6)
            }
            .padding(.top, 4)
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
    
    // MARK: - Level Descriptions
    private func levelDescription(for level: GymLevel) -> String {
        switch level {
        case .L1:
            return "Training foundational focus anchors. River of Thought and Connection Practice unlock at Level 2 (requires 5 weekly active days)."
        case .L2:
            return "All 4 Jha Lab pillars unlocked! Standard level featuring daily variation matches based on your attention profile path."
        case .L3:
            return "Mastery level achieved! Unleashes customizable practice schedules to let you train your attention on your own terms."
        }
    }
    
    // MARK: - Practice Row Card Component
    private func practiceRow(type: PracticeType, isUnlocked: Bool) -> some View {
        HStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(isUnlocked ? Color.blue.opacity(0.1) : Color.white.opacity(0.05))
                    .frame(width: 48, height: 48)
                
                Image(systemName: isUnlocked ? practiceIcon(for: type) : "lock.fill")
                    .font(.system(size: 18))
                    .foregroundColor(isUnlocked ? .blue : .gray.opacity(0.5))
            }
            
            VStack(alignment: .leading, spacing: 4) {
                Text(type.name)
                    .font(.system(size: 16, weight: .bold, design: .rounded))
                    .foregroundColor(isUnlocked ? .white : .white.opacity(0.5))
                
                Text(type.description)
                    .font(.system(size: 12))
                    .foregroundColor(isUnlocked ? .gray : .gray.opacity(0.4))
                    .multilineTextAlignment(.leading)
                    .lineLimit(2)
            }
            
            Spacer()
            
            if isUnlocked {
                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.gray.opacity(0.5))
            } else {
                Text("L2 Locked")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.orange)
                    .padding(.vertical, 4)
                    .padding(.horizontal, 8)
                    .background(Color.orange.opacity(0.15))
                    .cornerRadius(6)
            }
        }
        .padding()
        .background(Color(red: 0.12, green: 0.15, blue: 0.19))
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(isUnlocked ? Color.white.opacity(0.05) : Color.orange.opacity(0.1), lineWidth: 1)
        )
        .padding(.horizontal, 20)
    }
    
    private func practiceIcon(for type: PracticeType) -> String {
        switch type {
        case .anchorBreath: return "flashlight.on.fill"
        case .bodySweep: return "person.fill.viewfinder"
        case .thoughtTraffic: return "water.waves"
        case .kindnessCircuit: return "heart.circle.fill"
        }
    }
}

struct PracticeListView_Previews: PreviewProvider {
    static var previews: some View {
        PracticeListView()
            .environmentObject(GymManager())
    }
}
