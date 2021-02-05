import { getRenderElement } from '@udecode/slate-plugins';
import { setDefaults } from '@udecode/slate-plugins';
import { DEFAULTS_HBSMENTION } from './defaults';
import { HBSMentionRenderElementOptions } from './types';

export const renderElementMention = (options?: HBSMentionRenderElementOptions) => {
  const { hbsmention } = setDefaults(options, DEFAULTS_HBSMENTION);

  return getRenderElement(hbsmention);
};
