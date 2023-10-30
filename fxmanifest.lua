fx_version 'cerulean'
game 'gta5'

lua54 'yes'
use_experimental_fxv2_oal 'yes'

shared_scripts {
    '@ox_lib/init.lua',
    'utils.lua'
}

client_scripts {
    'client/**/*.lua',
}

server_script 'server/server.lua'

files {
    'web/build/index.html',
    'web/build/**/*'
}

ui_page 'web/build/index.html'