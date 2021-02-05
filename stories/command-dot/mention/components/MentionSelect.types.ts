import { IStyle } from '@uifabric/styling';
import { IStyleFunctionOrObject } from '@uifabric/utilities';
import { Range } from 'slate';
import { ReactEditor } from 'slate-react';
import { HBSMentionNodeData, HBSMentionsScope } from '../types';

export interface HBSMentionSelectProps {
  /**
   * Additional class name to provide on the root element.
   */
  className?: string;

  /**
   * Call to provide customized styling that will layer on top of the variant rules.
   */
  styles?: IStyleFunctionOrObject<HBSMentionSelectStyleProps, HBSMentionSelectStyles>;

  /**
   * Range from the mention trigger to the cursor
   */
  at: Range | null;

  /**
   * List of mentionable items
   */
  options: HBSMentionNodeData[];

  /**
   * Index of the selected option
   */
  valueIndex: number;

  /**
   * Callback called when clicking on a mention option
   */
  onClickMention?: (editor: ReactEditor, option: HBSMentionNodeData) => void;

  renderLabel?: (mentionable: HBSMentionNodeData) => string;
}

export interface HBSMentionSelectStyleProps {
  className?: string;
}

export interface HBSMentionSelectStyles {
  root?: IStyle;
  mentionItem?: IStyle;
  mentionItemSelected?: IStyle;
}
