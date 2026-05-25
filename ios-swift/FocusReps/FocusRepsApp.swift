import SwiftUI

@main
struct FocusRepsApp: App {
    @StateObject private var manager = GymManager()
    
    var body: some Scene {
        WindowGroup {
            MainTabView()
                .environmentObject(manager)
                .preferredColorScheme(.dark) // Lock UI to Clinical Dark Mode theme
        }
    }
}
