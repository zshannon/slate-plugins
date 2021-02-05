import { SlatePlugin } from '@udecode/slate-plugins-core';
import { setDefaults } from '@udecode/slate-plugins';
import { DEFAULTS_HBSMENTION } from './defaults';
import { deserializeMention } from './deserializeMention';
import { renderElementMention } from './renderElementMention';
import { HBSMentionPluginOptions } from './types';

/**
 * Enables support for autocompleting @mentions and #tags.
 * When typing a configurable marker, such as @ or #, a select
 * component appears with autocompleted suggestions.
 */
export const HBSMentionPlugin = (options?: HBSMentionPluginOptions): SlatePlugin => {
  const { hbsmention } = setDefaults(options, DEFAULTS_HBSMENTION);

  return {
    renderElement: renderElementMention(options),
    deserialize: deserializeMention(options),
    inlineTypes: [hbsmention.type],
    voidTypes: [hbsmention.type],
  };
};
