import SwiftUI

public struct CircularTimerView: View {
    @ObservedObject public var viewModel: TimerViewModel
    
    private var phaseColor: Color {
        switch viewModel.phase {
        case .setup: return Color.orange
        case .practice: return Color.blue
        case .closing: return Color.green
        }
    }
    
    private func formatTime(_ seconds: Int) -> String {
        let mins = seconds / 60
        let secs = seconds % 60
        return String(format: "%02d:%02d", mins, secs)
    }
    
    public var body: some View {
        VStack(spacing: 20) {
            // Phase indicator badge
            Text(viewModel.phase.rawValue.uppercased())
                .font(.caption)
                .fontWeight(.bold)
                .foregroundColor(.secondary)
                .padding(.vertical, 6)
                .padding(.horizontal, 16)
                .background(Capsule().stroke(Color.secondary.opacity(0.3), lineWidth: 1))
            
            // Circular timer progress
            ZStack {
                // Background Track Circle
                Circle()
                    .stroke(Color(.systemGray6), lineWidth: 10)
                    .frame(width: 220, height: 220)
                
                // Progress Circle
                Circle()
                    .trim(from: 0.0, to: CGFloat(viewModel.progress))
                    .stroke(
                        phaseColor,
                        style: StrokeStyle(lineWidth: 10, lineCap: .round, lineJoin: .round)
                    )
                    .frame(width: 220, height: 220)
                    .rotationEffect(Angle(degrees: -90))
                    .animation(.linear(duration: 1.0), value: viewModel.elapsedSeconds)
                
                // Central Time Remaining Label
                VStack(spacing: 4) {
                    Text(formatTime(viewModel.timeRemaining))
                        .font(.system(size: 48, weight: .bold, design: .rounded))
                        .foregroundColor(.primary)
                }
            }
            .frame(width: 240, height: 240)
            
            // Controls
            HStack(spacing: 30) {
                // Reset Button
                Button(action: {
                    viewModel.reset()
                }) {
                    Text("Reset")
                        .font(.headline)
                        .foregroundColor(.secondary)
                        .padding(.vertical, 12)
                        .padding(.horizontal, 30)
                        .background(
                            RoundedRectangle(cornerRadius: 25)
                                .stroke(Color.secondary.opacity(0.3), lineWidth: 1)
                        )
                }
                
                // Play / Pause Button
                Button(action: {
                    if viewModel.isRunning {
                        viewModel.pause()
                    } else {
                        viewModel.start()
                    }
                }) {
                    Text(viewModel.isRunning ? "Pause" : "Start")
                        .font(.headline)
                        .foregroundColor(.white)
                        .padding(.vertical, 12)
                        .padding(.horizontal, 40)
                        .background(
                            Capsule()
                                .fill(viewModel.isRunning ? Color.gray : Color.blue)
                        )
                }
            }
            .padding(.top, 20)
        }
        .padding(30)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(.systemBackground))
                .shadow(color: Color.black.opacity(0.04), radius: 10, x: 0, y: 5)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color(.systemGray6), lineWidth: 1)
        )
    }
}
#Preview {
    CircularTimerView(viewModel: TimerViewModel(durationMinutes: 12))
}
