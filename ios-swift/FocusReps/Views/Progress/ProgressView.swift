import SwiftUI

public struct ProgressView: View {
    @EnvironmentObject var manager: GymManager
    @State private var selectedTab = 0 // 0 = Gym Reps, 1 = SART Assessments
    
    public init() {}
    
    private let dateFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter
    }()
    
    public var body: some View {
        NavigationView {
            ZStack {
                // Background
                Color(red: 0.08, green: 0.10, blue: 0.13)
                    .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Segmented Selector
                    Picker("Metrics", selection: $selectedTab) {
                        Text("Daily Reps").tag(0)
                        Text("Focus Lab Logs").tag(1)
                    }
                    .pickerStyle(SegmentedPickerStyle())
                    .padding(.horizontal, 20)
                    .padding(.vertical, 10)
                    
                    if selectedTab == 0 {
                        gymRepsProgressView
                    } else {
                        sartLogsView
                    }
                }
            }
            .navigationTitle("Attention Analytics")
            .navigationBarTitleDisplayMode(.inline)
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
    
    // MARK: - Gym Daily Reps Tab
    private var gymRepsProgressView: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Streaks & Stats Card
                HStack(spacing: 16) {
                    metricCard(
                        title: "Current Streak",
                        value: "\(manager.currentStreak) Days",
                        desc: "Continuous reps",
                        icon: "flame.fill",
                        iconColor: .orange
                    )
                    
                    metricCard(
                        title: "Longest Streak",
                        value: "\(manager.longestStreak) Days",
                        desc: "Personal record",
                        icon: "crown.fill",
                        iconColor: .yellow
                    )
                }
                .padding(.horizontal, 20)
                
                // Resilience Shield gauge
                VStack(spacing: 12) {
                    Text("Attentional Compliance")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.blue)
                        .tracking(1)
                    
                    Text("Your Resilience Shield is \(manager.resilienceShield)% active")
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                    
                    // Compliance bar representation
                    let activeDays = manager.resilienceShield / 20
                    HStack(spacing: 6) {
                        ForEach(0..<7) { day in
                            RoundedRectangle(cornerRadius: 3)
                                .fill(day < activeDays ? Color.blue : Color.white.opacity(0.05))
                                .frame(height: 12)
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.vertical, 6)
                    
                    Text("Calculated from rolling 7-day unique active days. Practicing shields cognitive circuits against depletion.")
                        .font(.system(size: 11))
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 20)
                }
                .padding(.vertical, 20)
                .background(Color(red: 0.12, green: 0.15, blue: 0.19))
                .cornerRadius(16)
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color.white.opacity(0.05), lineWidth: 1)
                )
                .padding(.horizontal, 20)
                
                // Rep Logs List
                VStack(alignment: .leading, spacing: 12) {
                    Text("Daily Practice History")
                        .font(.system(size: 16, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .padding(.horizontal, 20)
                    
                    if manager.sessions.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "list.bullet.clipboard")
                                .font(.system(size: 40))
                                .foregroundColor(.gray.opacity(0.5))
                            Text("No practice reps logged yet.")
                                .font(.system(size: 14))
                                .foregroundColor(.gray)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 40)
                        .background(Color(red: 0.12, green: 0.15, blue: 0.19))
                        .cornerRadius(16)
                        .padding(.horizontal, 20)
                    } else {
                        ForEach(manager.sessions.reversed()) { session in
                            sessionHistoryRow(session: session)
                        }
                    }
                }
            }
            .padding(.top, 10)
            .padding(.bottom, 30)
        }
    }
    
    // MARK: - Focus Lab Logs Tab (SART)
    private var sartLogsView: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Assessment Action Card
                HStack(spacing: 16) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Objective Cognitive Check")
                            .font(.system(size: 15, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                        Text("A 60-second visual SART test that records attentional lapses and reaction times.")
                            .font(.system(size: 12))
                            .foregroundColor(.gray)
                            .lineLimit(nil)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                    Spacer()
                    NavigationLink(destination: SartTestView()) {
                        Text("Test Now")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.vertical, 8)
                            .padding(.horizontal, 16)
                            .background(Color.blue)
                            .cornerRadius(8)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
                .padding()
                .background(Color(red: 0.12, green: 0.15, blue: 0.19))
                .cornerRadius(16)
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color.white.opacity(0.05), lineWidth: 1)
                )
                .padding(.horizontal, 20)
                
                // Lab logs list
                VStack(alignment: .leading, spacing: 12) {
                    Text("SART Assessment History")
                        .font(.system(size: 16, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .padding(.horizontal, 20)
                    
                    if manager.sartHistory.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "chart.bar.doc.horizontal")
                                .font(.system(size: 40))
                                .foregroundColor(.gray.opacity(0.5))
                            Text("No assessments recorded yet.")
                                .font(.system(size: 14))
                                .foregroundColor(.gray)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 40)
                        .background(Color(red: 0.12, green: 0.15, blue: 0.19))
                        .cornerRadius(16)
                        .padding(.horizontal, 20)
                    } else {
                        ForEach(manager.sartHistory.reversed()) { result in
                            sartHistoryRow(result: result)
                        }
                    }
                }
            }
            .padding(.top, 10)
            .padding(.bottom, 30)
        }
    }
    
    // MARK: - Helpers & Components
    private func metricCard(title: String, value: String, desc: String, icon: String, iconColor: Color) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 24))
                .foregroundColor(iconColor)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(.gray)
                Text(value)
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                Text(desc)
                    .font(.system(size: 10))
                    .foregroundColor(.gray.opacity(0.8))
            }
            Spacer()
        }
        .padding()
        .background(Color(red: 0.12, green: 0.15, blue: 0.19))
        .cornerRadius(14)
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(Color.white.opacity(0.05), lineWidth: 1)
        )
    }
    
    private func sessionHistoryRow(session: PracticeSession) -> some View {
        HStack(spacing: 16) {
            VStack(alignment: .leading, spacing: 4) {
                Text(session.practiceType.name)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.white)
                
                Text(dateFormatter.string(from: session.date))
                    .font(.system(size: 11))
                    .foregroundColor(.gray)
            }
            
            Spacer()
            
            VStack(alignment: .trailing, spacing: 4) {
                Text("\(session.duration) mins")
                    .font(.system(size: 14, weight: .bold, design: .rounded))
                    .foregroundColor(.blue)
                
                if let lapses = session.lapseCount {
                    Text("\(lapses) wanders logged")
                        .font(.system(size: 10))
                        .foregroundColor(.orange)
                }
            }
        }
        .padding()
        .background(Color(red: 0.12, green: 0.15, blue: 0.19))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.white.opacity(0.05), lineWidth: 1)
        )
        .padding(.horizontal, 20)
    }
    
    private func sartHistoryRow(result: SartTestResult) -> some View {
        VStack(spacing: 12) {
            HStack {
                Text("Focus Score:")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(.gray)
                
                Text("\(result.focusScore) / 100")
                    .font(.system(size: 16, weight: .bold, design: .rounded))
                    .foregroundColor(result.focusScore >= 80 ? .green : result.focusScore >= 60 ? .orange : .red)
                
                Spacer()
                
                Text(dateFormatter.string(from: result.date))
                    .font(.system(size: 11))
                    .foregroundColor(.gray)
            }
            
            Divider()
                .background(Color.white.opacity(0.05))
            
            HStack {
                Label("\(result.lapses) Lapses", systemImage: "hand.tap")
                    .foregroundColor(.orange)
                Spacer()
                Label("\(result.misses) Misses", systemImage: "xmark.circle")
                    .foregroundColor(.red)
                Spacer()
                Label("\(result.avgReactionTimeMs) ms", systemImage: "speedometer")
                    .foregroundColor(.blue)
            }
            .font(.system(size: 12, weight: .medium))
        }
        .padding()
        .background(Color(red: 0.12, green: 0.15, blue: 0.19))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.white.opacity(0.05), lineWidth: 1)
        )
        .padding(.horizontal, 20)
    }
}

struct ProgressView_Previews: PreviewProvider {
    static var previews: some View {
        ProgressView()
            .environmentObject(GymManager())
    }
}
