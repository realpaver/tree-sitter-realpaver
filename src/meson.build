tree_sitter_realpaver_sources += ['parser.c']

tree_sitter_realpaver = both_libraries(
  'tree_sitter_realpaver',
  sources: tree_sitter_realpaver_sources,
  dependencies: tree_sitter_dep,
  include_directories: tree_sitter_realpaver_incdirs,
  install: true,
)

install_headers(tree_sitter_realpaver_headers, install_dir: 'include/tree_sitter')
