local constants = {}

constants.systemIsWindows = (os.getenv('OS') or ''):lower():match('windows')
constants.resourcePath = GetResourcePath(cache.resource):gsub('//', '/')
constants.savedMLODir = 'saved_mlos'
constants.savedMLODirPath = ('%s/%s'):format(constants.resourcePath, constants.savedMLODir)
constants.generatedFilesDir = 'generated_files'
constants.generatedFilesDirPath = ('%s/%s'):format(constants.resourcePath, constants.generatedFilesDir)

return table.freeze(constants)
