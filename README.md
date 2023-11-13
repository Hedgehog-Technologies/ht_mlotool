# ht_mloaudio

A framework-independent [FiveM](https://fivem.net) dev resource that helps to customize and generate files necessary for the game to interpret and handle audio occlusion for MLOs.

![](https://img.shields.io/github/downloads/hedgehog-technologies/ht_mloaudio/total?logo=github)
![](https://img.shields.io/github/downloads/hedgehog-technologies/ht_mloaudio/latest/total?logo=github)
![](https://img.shields.io/github/v/release/hedgehog-technologies/ht_mloaudio?logo=github)

## Documentation

### Preview

<details>
   <summary>General Tab</summary>

   ![General Tab](./docs/images/general_tab.png 'General Tab')
</details>

### Release Notes

- You can review release notes [here](./docs/release-notes.md)

### Installation

#### Download Release

Get the [latest version](https://github.com/hedgehog-technologies/ht_mloaudio/releases/latest) of the tool from the [releases](https://github.com/hedgehog-technologies/ht_mloaudio/releases) section.

#### Build Source

```bash
# clone this repository
$ git clone https://github.com/hedgehog-technologies/ht_mloaudio

# Navigate to the repo directory
cd ht_mloaudio

# Install the project dependencies
$ pnpm i

# Build the resource
$ pnpm build
```

Further build / development guidance can be viewed [here](./docs/development-guide.md).

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
   - Recommendation: Use a dev tool such as [Dolu Tool](https://forum.cfx.re/t/dolu-tool-mlo-debugging-object-spawner-more/5000677) to help with identifying rooms and portals
5. Press the `Generate Audio Occlusion Files` and wait for confirmation of generated XML file(s)
6. Use [CodeWalker](https://github.com/dexyfex/CodeWalker) to convert the XML files to the proper GTAV format
7. Move the converted XML files to a FiveM map resource
8. Restart your FiveM server and enjoy audio occluded goodness

#### In Depth Usage Guide

- You can view a more in depth guide [here](./docs/usage-guide.md)

### Acknowledgements

- You can view Acknowledgements [here](./docs/acknowledgements.md)
