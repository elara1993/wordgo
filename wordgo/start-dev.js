// Start WordGo dev server from the correct directory
process.chdir('/Users/shashen/kiwi/AgnesCode_LittleGrow/wordgo');
process.argv = [process.argv[0], '/Users/shashen/kiwi/AgnesCode_LittleGrow/wordgo/node_modules/next/dist/bin/next', 'dev', '-p', '3000'];
require('/Users/shashen/kiwi/AgnesCode_LittleGrow/wordgo/node_modules/next/dist/bin/next');