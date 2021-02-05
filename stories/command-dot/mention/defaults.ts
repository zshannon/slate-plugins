import { HBSMentionElement } from './components/HBSMentionElement';
import { HBSMentionKeyOption, HBSMentionPluginOptionsValues } from './types';

export const ELEMENT_HBSMENTION = 'hbs-mention';

export const DEFAULTS_HBSMENTION: Record<
HBSMentionKeyOption,
HBSMentionPluginOptionsValues
> = {
  hbsmention: {
    component: HBSMentionElement,
    type: ELEMENT_HBSMENTION,
    rootProps: {
      className: 'slate-mention',
      prefix: '@',
    },
  },
};
