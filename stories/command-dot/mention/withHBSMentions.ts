import { Editor } from 'slate'

import type { HBSMentionsEditor, HBSMentionsScope } from './types'

interface WithHBSMentionOptions {
  scope: HBSMentionsScope
}

export const withHBSMentions = ({ scope }: WithHBSMentionOptions) => <T extends Editor>(editor: T): T & HBSMentionsEditor => {
  const e = editor as T & HBSMentionsEditor
  e.scope = scope
  return e
}
