import { DeserializeHtml } from '@udecode/slate-plugins-core';
import { getNodeDeserializer } from '@udecode/slate-plugins';
import { setDefaults } from '@udecode/slate-plugins';
import { DEFAULTS_HBSMENTION } from './defaults';
import { HBSMentionDeserializeOptions } from './types';

export const deserializeMention = (
  options?: HBSMentionDeserializeOptions
): DeserializeHtml => {
  const { hbsmention } = setDefaults(options, DEFAULTS_HBSMENTION);

  return {
    element: getNodeDeserializer({
      type: hbsmention.type,
      node: (el) => ({
        type: hbsmention.type,
        value: el.getAttribute('data-slate-value'),
      }),
      rules: [{ className: hbsmention.rootProps.className }],
      ...options?.hbsmention?.deserialize,
    }),
  };
};
