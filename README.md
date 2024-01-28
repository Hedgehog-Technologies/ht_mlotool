![Header](./docs/images/release_header_v1.1.png 'Header')

# ht_mlotool

A framework-independent dev resource for [FiveM](https://fivem.net) that helps to customize and generate files necessary for the game to interpret and handle audio occlusion for MLOs.

![](https://img.shields.io/github/downloads/hedgehog-technologies/ht_mlotool/total?logo=github)
![](https://img.shields.io/github/downloads/hedgehog-technologies/ht_mlotool/latest/total?logo=github)
![](https://img.shields.io/github/v/release/hedgehog-technologies/ht_mlotool?logo=github)

## Documentation

### Preview

<details>
   <summary>General Tab</summary>

   ![General Tab](./docs/images/general_tab.png 'General Tab')
</details>

<details>
   <summary>Rooms Tab</summary>

   ![Rooms Tab](./docs/images/rooms_tab.png 'Rooms Tab')
</details>

<details>
   <summary>Portals Tab</summary>

   ![Portals Tab](./docs/images/portals_tab.png 'Portals Tab')
</details>

### Release Notes

- You can review release notes [here](./docs/release-notes.md)

### Installation

#### Download Release

Get the [latest version](https://github.com/hedgehog-technologies/ht_mlotool/releases/latest) of the tool from the [releases](https://github.com/hedgehog-technologies/ht_mlotool/releases) section.

#### Build Source

```bash
# clone this repository
$ git clone https://github.com/hedgehog-technologies/ht_mlotool

# Navigate to the repo directory
$ cd ht_mlotool

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
   - Closing the UI will cache your changes locally automatically, **no need to generate the files everytime you close it**
   - The resource should detect which room you are currently in and default to that room when you open the UI
   - *Note* - You can press and hold `right mouse button` with the UI open to be able to move around
      - Try your best to not leave the MLO while doing so as this can lead to unaccounted for issues during file saving / generation
5. Press the `Generate Audio Occlusion Files` and wait for confirmation of generated XML file(s)
6. Use [CodeWalker](https://github.com/dexyfex/CodeWalker) to convert the XML files to the proper GTAV format
7. Move the converted XML files to a FiveM map resource
8. Restart your FiveM server and enjoy occluded audio goodness

#### In Depth Usage Guide

- You can view a more in depth guide [here](./docs/usage-guide.md)

### Acknowledgements

- You can view Acknowledgements [here](./docs/acknowledgements.md)

### Support

- Join the [HedgeTech Discord](https://discord.gg/sJggphj5UX) for support
