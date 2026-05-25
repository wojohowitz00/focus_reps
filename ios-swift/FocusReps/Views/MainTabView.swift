import SwiftUI

public struct MainTabView: View {
    @EnvironmentObject var manager: GymManager
    @State private var activeTab = 0
    @State private var showingOnboarding = false
    
    public init() {}
    
    public var body: some View {
        ZStack {
            if manager.settings.userPath == nil {
                // Force initial onboarding quiz if path is not configured yet
                OnboardingQuizView(onComplete: {
                    showingOnboarding = false
                    // Triggers state refresh
                    manager.loadData()
                })
                .transition(.opacity)
            } else {
                TabView(selection: $activeTab) {
                    DashboardView()
                        .tabItem {
                            Image(systemName: "house.fill")
                            Text("Dashboard")
                        }
                        .tag(0)
                    
                    PracticeListView()
                        .tabItem {
                            Image(systemName: "flame.fill")
                            Text("Gym")
                        }
                        .tag(1)
                    
                    ProgressView()
                        .tabItem {
                            Image(systemName: "chart.bar.fill")
                            Text("Analytics")
                        }
                        .tag(2)
                    
                    SettingsView()
                        .tabItem {
                            Image(systemName: "gearshape.fill")
                            Text("Settings")
                        }
                        .tag(3)
                }
                .accentColor(.blue) // Apply blue accent to tabs globally
                .onAppear {
                    // Customize iOS tabbar standard colors to fit clinical dark theme
                    let appearance = UITabBarAppearance()
                    appearance.configureWithOpaqueBackground()
                    appearance.backgroundColor = UIColor(red: 0.12, green: 0.15, blue: 0.19, alpha: 1.0)
                    
                    UITabBar.appearance().standardAppearance = appearance
                    if #available(iOS 15.0, *) {
                        UITabBar.appearance().scrollEdgeAppearance = appearance
                    }
                }
            }
        }
        .animation(.default, value: manager.settings.userPath)
    }
}

struct MainTabView_Previews: PreviewProvider {
    static var previews: some View {
        MainTabView()
            .environmentObject(GymManager())
    }
}
