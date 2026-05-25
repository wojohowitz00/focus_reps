import Foundation

public struct SartTestResult: Codable, Identifiable {
    public var id: String
    public var date: Date
    public var lapses: Int
    public var misses: Int
    public var avgReactionTimeMs: Int
    public var focusScore: Int
    
    public init(id: String = UUID().uuidString,
                date: Date = Date(),
                lapses: Int,
                misses: Int,
                avgReactionTimeMs: Int,
                focusScore: Int) {
        self.id = id
        self.date = date
        self.lapses = lapses
        self.misses = misses
        self.avgReactionTimeMs = avgReactionTimeMs
        self.focusScore = focusScore
    }
}
