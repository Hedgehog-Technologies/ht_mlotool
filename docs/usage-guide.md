# Usage Guide

## Background

This resource is meant to make the generation of `.ymt` and `.dat151.rel` files more accessible and less labor intensive than trying to build them out by hand.

If you are unfamiliar with `.ymt` and `.dat151.rel` files they are the two main files types that are used for Interior Audio Occlusion within GTAV. You can read more [here](./definitions.md).

## Setting Expectations

This resource **WILL NOT** live update audio occlusion. As far as I'm aware that isn't possible and I will not be performing miracles for free at this time. (Yes, I am aware that you can override certain portals with ***existing*** audio occlusion values, but that's not what I'm talking about here)

This resource **CAN** *help* you generate the necessary files to calculate audio occlusion within Interiors.

## Locale

This tool utilizes [ox_lib's](https://github.com/overextended/ox_lib) **locale** system. To change the language add the following convar to your server's CFG file: `setr ox:locale <language code>`. You can check out the [locale documentation](https://overextended.dev/ox_lib/Modules/Locale/Shared) for more information.

Please feel free to submit a Pull Request with translations for your preferred language(s).

## Commands

### openmlo

> `/openmlo [1|2]`

Used to open the UI that allows you to interact with the MLO that your ped is currently standing in.

- *Optional* Argument
   - `1` - Force reload from save file if one exists
   - `2` - Force rebuild the MLO data from scratch
   - `<leave blank>` - Use cached data if present


### loadmlo

> `/loadmlo [<filename>]`

Used to load MLO data from a saved file (if one exists in the `saved_mlos/` directory) to the resource's cache.

- *Optional* Argument
   - `<filename>` - The name of the file that the current MLO data is saved in
   - If this argument is left blank then the resource will attempt to automatically find the associated save file for the MLO your player ped is standing in and load it into cache if it exists

### savemlo

Used to save MLO data to a save file in the `saved_mlos/` directory.

> `/savemlo [<filename>]`

- *Optional* Argument
   - `<filename>` - The name of the file to save the current MLO data to
   - If this argument is left blank then the resource will use the hex representation of the MLO's unsigned name hash as the filename or the previously used save file's name if one exists

## Usage Steps

1. Load into your server
   - Preferably a development environment, but you do you I guess
2. Enter the MLO that you would like to generate audio occlusion for
3. Enter the [/openmlo](#openmlo) command into your chat resource to open the resource's UI
4. With the [General Tab](#general-tab) open you can change the `MLO Save Name` or `Generate Audio Occlusion Files`
5. Moving to the [Rooms Tab](#rooms-tab) will allow you to edit values for the individual rooms defined in the MLO
6. Moving to the [Portals Tab](#portals-tab) will allow you to edit values of paths for audio to take when traveling through the MLO
7. You are able to close and reopen the UI without losing your progress, however, quitting out from the server or restarting the server will not automatically save your work.
   - You will need to save it manually with the [/savemlo](#savemlo) command or the save button on the [General Tab](#general-tab)
8. Once your are done with your edits, return to the `General Tab` and click the `Generate Audio Occlusion Files` button. Your files will be generated and saved to the `generated_files/` directory of the resource
9. Drag and drop those files into CodeWalker's RPF Explorer to convert the XMLs into the GTAV equivalent filetypes
    - Further steps in using CodeWalker to import xml files can be found [here](#codewalker-usage-steps)
10. Take the converted files and place them into the same resouce as the map or create a new resource that will consume the audio occlusion files
    - The `.ymt` files should be placed in a folder called `stream`
    - The `.dat151.rel` files should be placed in a separate folder, for example called `audio`
11. In the fxmanifest file for that resource, be sure to include the following
```lua
this_is_a_map 'yes'

files {
    'audio/**/*.rel'
}

-- Here you will include lines for each dat151 file
-- Cutting off the the line at .dat is intentional
data_file 'AUDIO_GAMEDATA' 'audio/test_map/DEADBEEF_game.dat'

-- [[
Example File Structure:
occlusion_resource/
|-> audio/
  |-> test_map/
    |-> DEADBEEF_game.dat151.rel
|-> stream/
  |-> test_map/
    |-> 3735928559.ymt
-- ]]
```
12. Make sure that resource is set to be ensured on server start up and restart your server to test your changes
    - Simply ensuring that resource will not guarantee that the audio changes will be picked up properly and may even lead to client crashes

### CodeWalker Usage Steps

See [CodeWalker Usage Guide](./codewalker-usage-guide.md)

## UI Breakdown

See [UI Breakdown](./ui_breakdown.md)