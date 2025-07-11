project('tree-sitter-realpaver', 'c', version: '1.0.0')

tree_sitter_dep = dependency('tree-sitter')
if not tree_sitter_dep.found()
  lib_tree_sitter = subproject('tree-sitter')
  tree_sitter_dep = lib_tree_sitter.get_variable('tree_sitter_dep')
endif

tree_sitter_realpaver_sources = []
tree_sitter_realpaver_headers = []
tree_sitter_realpaver_incdirs = []

conf_data = configuration_data()
conf_data.set('PROJECT_VERSION', meson.project_version())
conf_data.set('PROJECT_DESCRIPTION', 'tree-sitter for RealPaver language')
conf_data.set('CMAKE_INSTALL_PREFIX', get_option('prefix'))
conf_data.set('CMAKE_INSTALL_LIBDIR', get_option('libdir'))
conf_data.set('CMAKE_INSTALL_INCLUDEDIR', get_option('includedir'))
conf_data.set('PROJECT_HOMEPAGE_URL', 'https://github.com/realpaver/realpaver')

subdir('bindings')
subdir('src')

pkgconfig = find_program('pkg-config', required: false)
if pkgconfig.found()
  pkg = import('pkgconfig')
  pkg.generate(tree_sitter_realpaver, name: 'tree-sitter-realpaver')
endif

tree_sitter_realpaver_dep = declare_dependency(
  include_directories: tree_sitter_realpaver_incdirs,
  link_with: tree_sitter_realpaver,
)
