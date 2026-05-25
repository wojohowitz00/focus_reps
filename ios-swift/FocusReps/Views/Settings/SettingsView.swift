import SwiftUI

public struct SettingsView: View {
    @EnvironmentObject var manager: GymManager
    @State private var showingResetConfirmation = false
    @State private var showingQuiz = false
    
    public init() {}
    
    public var body: some View {
        NavigationView {
            ZStack {
                // Background
                Color(red: 0.08, green: 0.10, blue: 0.13)
                    .ignoresSafeArea()
                
                Form {
                    Section(header: Text("Cognitive Training Profile").foregroundColor(.blue)) {
                        HStack {
                            Text("Current Path")
                            Spacer()
                            Text(manager.settings.userPath?.title ?? "Unassigned")
                                .foregroundColor(.gray)
                        }
                        
                        HStack {
                            Text("Gym Standing")
                            Spacer()
                            Text(manager.settings.currentLevel.title)
                                .foregroundColor(.gray)
                        }
                        
                        Button(action: {
                            showingQuiz = true
                        }) {
                            Text("Retake Attentional Assessment Quiz")
                                .foregroundColor(.blue)
                        }
                    }
                    .listRowBackground(Color(red: 0.12, green: 0.15, blue: 0.19))
                    
                    Section(header: Text("Default Rep Duration").foregroundColor(.blue)) {
                        Picker("Duration", selection: $manager.settings.defaultDuration) {
                            Text("12 Min (Minimum Dose)").tag(12)
                            Text("15 Min (Standard Dose)").tag(15)
                            Text("20 Min (Enhanced Dose)").tag(20)
                        }
                        .onChange(of: manager.settings.defaultDuration) { _ in
                            manager.saveSettings()
                        }
                    }
                    .listRowBackground(Color(red: 0.12, green: 0.15, blue: 0.19))
                    
                    Section(header: Text("Sound & Feedback").foregroundColor(.blue)) {
                        Toggle("Chime Audio cues", isOn: $manager.settings.soundEnabled)
                            .onChange(of: manager.settings.soundEnabled) { _ in
                                manager.saveSettings()
                            }
                        
                        Toggle("Local Reminder Notifications", isOn: $manager.settings.notificationsEnabled)
                            .onChange(of: manager.settings.notificationsEnabled) { _ in
                                manager.saveSettings()
                            }
                    }
                    .listRowBackground(Color(red: 0.12, green: 0.15, blue: 0.19))
                    
                    Section(header: Text("Data Actions").foregroundColor(.blue)) {
                        Button(action: {
                            showingResetConfirmation = true
                        }) {
                            Text("Reset Attention Gym History")
                                .foregroundColor(.red)
                        }
                    }
                    .listRowBackground(Color(red: 0.12, green: 0.15, blue: 0.19))
                }
                .background(Color(red: 0.08, green: 0.10, blue: 0.13))
                .scrollContentBackground(.hidden) // Required to make custom background show on iOS 16+
            }
            .navigationTitle("Gym Preferences")
            .navigationBarTitleDisplayMode(.inline)
            .alert(isPresented: $showingResetConfirmation) {
                Alert(
                    title: Text("Clear Local Data?"),
                    message: Text("This action will erase all logged daily practices, focus streaks, and objective SART focus scores permanently. This cannot be undone."),
                    primaryButton: .destructive(Text("Erase All Data")) {
                        resetAllGymData()
                    },
                    secondaryButton: .cancel()
                )
            }
            .sheet(isPresented: $showingQuiz) {
                OnboardingQuizView(onComplete: {
                    showingQuiz = false
                })
                .environmentObject(manager)
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
    
    private func resetAllGymData() {
        // Reset defaults
        UserDefaults.standard.removeObject(forKey: "@peak_mind:settings")
        UserDefaults.standard.removeObject(forKey: "@peak_mind:sessions")
        UserDefaults.standard.removeObject(forKey: "@peak_mind:sart_history")
        
        // Reload in manager
        manager.loadData()
    }
}

struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
            .environmentObject(GymManager())
    }
}
