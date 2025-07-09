import XCTest
import SwiftTreeSitter
import TreeSitterRealpaver

final class TreeSitterRealpaverTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_realpaver())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading RealPaver parser based on tree-sitter grammar")
    }
}
