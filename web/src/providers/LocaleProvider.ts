import { create } from 'zustand';
import { fetchNui } from '@/utils';

interface Locale {
  [index: string]: string;
}

const defaultLocale: Locale = {
  ui_blank: "<Blank>",
  ui_close: "Close",
  ui_debug: "Debug",
  ui_debug_comments: "Add Debug Comments",
  ui_debug_comments_info: "Whether or not to add debug comments to the output file(s). NOTE: These should be used for debugging only, CodeWalker currently parses the comments incorrectly.",
  ui_file_options: "File Generation Options",
  ui_general_info: "General MLO Information",
  ui_generate_button_default: "Generate Audio Occlusion File(s)",
  ui_generate_button_fail: "Either Audio Occlusion or Dat151 Generation Must Be Enabled",
  ui_generate_button_success: "Audio Occlusion File(s) Generated",
  ui_generate_dat151: "Generate Dat151 File",
  ui_generate_dat151_info: "Whether or not the dat151 file (*_game.dat151.rel.xml) will be generated",
  ui_generate_ymt: "Generate Audio Occlusion YMT File",
  ui_generate_ymt_info: "Whether or not the audio occlusion file (*.ymt.pso.xml) will be generated",
  ui_interior_info: "Interior Info",
  ui_interior_info_id: "Interior Id",
  ui_interior_info_id_info: "Interior Id for the current MLO",
  ui_interior_info_number_portals_info: "Number of portals in the current MLO",
  ui_interior_info_number_rooms_info: "Number of rooms in the current MLO, including Limbo",
  ui_interior_info_world_coords: "Interior World Coords",
  ui_interior_info_world_coords_info: "Location of the current MLO in the world",
  ui_missing_value: "missing value",
  ui_name: "Name",
  ui_name_info: "Room name of the currently selected room",
  ui_name_hash: "Name Hash",
  ui_name_hash_info_signed: "MLO Archetype Name represented as a Signed Int32",
  ui_name_hash_info_unsigned: "MLO Archetype Name represented as an Unsigned Int32",
  ui_number_portals: "Number of Portals",
  ui_number_rooms: "Number of Rooms",
  ui_occl_name: "Occlusion Name",
  ui_occl_name_info: "Room name used in the dat151 file",
  ui_open_discord: "Open HedgeTech Discord",
  ui_open_github: "Open Github Repo",
  ui_portal_alert: "No Portals Found!",
  ui_portal_debug: "Debug Toggles",
  ui_portal_debug_draw_fill: "Draw Portal Fill",
  ui_portal_debug_draw_info: "Draw Portal Info",
  ui_portal_debug_draw_outline: "Draw Portal Outline",
  ui_portal_debug_point: "Point Towards",
  ui_portal_enabled: "Enabled",
  ui_portal_entity_door: "Is Door?",
  ui_portal_entity_glass: "Is Glass?",
  ui_portal_entity_max_occl: "Max Occlusion",
  ui_portal_entity_model: "Model",
  ui_portal_info: "Portal Information",
  ui_portal_no_entities: "No entities associated with this portal",
  ui_proxy_hash: "Proxy Hash",
  ui_proxy_hash_info_signed: "Proxy Hash represented as a Signed Int32",
  ui_proxy_hash_info_unsigned: "Proxy Hash represented as an Unsigned Int32",
  ui_room_dat_settings: "Dat151 Settings",
  ui_room_dat_echo: "Echo",
  ui_room_dat_echo_info: "(ReverbLarge) Set level of echo for the currently selected room. Range 0.0 - 1.0",
  ui_room_dat_flags: "Flags",
  ui_room_dat_flags_info: "Usually left as 0xAAAAAAAA",
  ui_room_dat_reverb: "Reverb",
  ui_room_dat_reverb_info: "(ReverbMedium) Set level of reverb for the currently selected room. Range: 0.0 - 1.0",
  ui_room_dat_sound: "Sound",
  ui_room_dat_sound_info: "(RoomToneSound) Room sounds. Usually left as null_sound",
  ui_room_dat_soundset: "SoundSet",
  ui_room_dat_soundset_info: "(InteriorWallaSoundSet) Usually left as hash_D4855127",
  ui_room_dat_unk02: "Unk02",
  ui_room_dat_unk02_info: "(InteriorType) Usually left as 0",
  ui_room_dat_unk03: "Unk03",
  ui_room_dat_unk03_info: "(ReverbSmall) Range: 0.0 - 1.0 Usually left as 0.35",
  ui_room_dat_unk07: "Unk07",
  ui_room_dat_unk07_info: "(RainType) Usually left as 0",
  ui_room_dat_unk08: "Unk08",
  ui_room_dat_unk08_info: "(ExteriorAudibility) Usually left as 0",
  ui_room_dat_unk09: "Unk09",
  ui_room_dat_unk09_info: "(RoomOcclusionDamping) Usually left as 0",
  ui_room_dat_unk10: "Unk10",
  ui_room_dat_unk10_info: "(NonMarkedPortalOcclusion) Usually left as 0.7",
  ui_room_dat_unk11: "Unk11",
  ui_room_dat_unk11_info: "(DistanceFromPortalOcclusion) Usually left as 0",
  ui_room_dat_unk12: "Unk12",
  ui_room_dat_unk12_info: "(DistanceFromPortalFadeDistance) Usually left as 50",
  ui_room_dat_unk13: "InteriorRoomParams",
  ui_room_dat_unk13_info: "(WeaponMetrics) A hash referring to an InteriorRoomParams object. Used for weapon audio occlusion. Usually left blank",
  ui_room_dat_zone: "Zone",
  ui_room_dat_zone_info: "(AmbientZone) A hash referring to an AmbientZone object. Usually left blank",
  ui_room_index: "Room Index",
  ui_room_index_info: "Room index of the currently selected room",
  ui_room_info: "Room Information",
  ui_room_key: "Room Key",
  ui_room_key_info_signed: "Room key calculated and represented as a Signed Int32",
  ui_room_key_info_unsigned: "Room key calculated and represented as an Unsigned Int32",
  ui_room_name_hash_info_signed: "Room name represented as a Signed Int32",
  ui_room_name_hash_info_unsigned: "Room name represented as an Unsigned Int32",
  ui_room_number_portals_info: "Number of portals for the currently selected room",
  ui_room_select_label: "Room Select",
  ui_room_select_nothing_found: "No room found",
  ui_room_select_placeholder: "Pick a room",
  ui_save_mlo: "Save MLO Data",
  ui_save_name: "Save File Name",
  ui_save_name_info: "Name of the file to save the MLO information out to",
  ui_save_name_unknown: "UNKNOWN",
  ui_signed: "Signed",
  ui_tab_general: "General",
  ui_tab_portals: "Portals",
  ui_tab_rooms: "Rooms",
  ui_unsigned: "Unsigned",
};

interface LocaleState {
  localeState: Locale;
  locale: (key: string) => string;
};

export const useLocale = create<LocaleState>((_, get) => ({
  localeState: {},

  locale: (key) => {
    return get().localeState[key] ?? key;
  }
}));

fetchNui('ht_mlotool:fetchLocales', null, defaultLocale).then((locales) => {
  useLocale.setState({ localeState: locales });
});
