local Constants = {}

Constants.systemIsWindows = (os.getenv('OS') or ''):lower():match('windows')
Constants.resourcePath = GetResourcePath(cache.resource):gsub('//', '/')
Constants.savedInteriorDir = 'saved_interiors'
Constants.savedInteriorDirPath = ('%s/%s'):format(Constants.resourcePath, Constants.savedInteriorDir)
Constants.generatedFilesDir = 'generated_files'
Constants.generatedFilesDirPath = ('%s/%s'):format(Constants.resourcePath, Constants.generatedFilesDir)

return table.freeze(Constants) --[[@as ServerConstants]]
