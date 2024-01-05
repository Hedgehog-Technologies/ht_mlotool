--[[ FX Information ]]--
fx_version 'cerulean'
game       'gta5'
lua54      'yes'
use_experimental_fxv2_oal 'yes'

--[[ Resource Information ]]--
name       'ht_mlotool'
version    '0.1.0'
license    'MIT'
author     'Hedgehog Technologies'
repository 'https://github.com/Hedgehog-Technologies/ht_mlotool'


--[[ Manifest ]]--
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

dependencies {
    'ox_lib'
}
