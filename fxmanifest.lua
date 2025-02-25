--[[ FX Information ]]--
fx_version 'cerulean'
game       'gta5'
lua54      'yes'
use_experimental_fxv2_oal 'yes'

--[[ Resource Information ]]--
name       'ht_mlotool'
version    '1.2.0'
license    'LGPL-3.0-or-later'
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

server_scripts {
    'server/**/*.lua'
}

ox_libs {
    'locale'
}

files {
    'web/build/index.html',
    'web/build/**/*',
    'locales/*.json'
}

ui_page 'web/build/index.html'

dependencies {
    '/server:12966',
    'ox_lib'
}
