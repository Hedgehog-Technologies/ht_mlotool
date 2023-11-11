# ht_mloaudio

A framework-independent FiveM dev resource that helps to customize and generate files necessary for the game to interpret and handle audio occlusion for MLOs.

![](https://img.shields.io/github/downloads/hedgehog-technologies/ht_mloaudio/total?logo=github)
![](https://img.shields.io/github/downloads/hedgehog-technologies/ht_mloaudio/latest/total?logo=github)
![](https://img.shields.io/github/v/release/hedgehog-technologies/ht_mloaudio?logo=github)

## Documentation

### Release Notes

- You can review release notes [here](./docs/release-notes.md)

### Usage

#### Dependencies

- [ox_lib](https://github.com/overextended/ox_lib)
- [CodeWalker](https://github.com/dexyfex/CodeWalker)

#### Quick Start Usage Guide

1. Launch into your FiveM server
   - preferably a dev environment, but you do you
2. Place your player ped inside of the MLO that you want to work with
3. Use the `/openmlo` command
   - Note that by default this requires being a part of `group.admin`
4. Go room by room through the MLO setting values as you see fit
   - Closing the UI will save your cache your changes locally, **no need to generate the files everytime you close it**
   - The resource should detect which room you are currently in and default to that room when you open the UI
5. Press the `Generate Audio Occlusion Files` and wait for confirmation of generated XML file(s)
6. Use [CodeWalker](https://github.com/dexyfex/CodeWalker) to convert the XML files to the proper GTAV format
7. Move the converted XML files to a FiveM map resource
8. Restart your FiveM server and enjoy audio occluded goodness

#### In Depth Usage Guide

- You can view a more in depth guide [here](./docs/usage-guide.md)

### Development Guide

- You can view the development guide [here](./docs/development-guide.md)

### Credits
- You can view Credits [here](./docs/credits.md)
