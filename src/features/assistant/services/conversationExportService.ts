import type { Conversation } from '../types';

export type ConversationExportAction = 'export' | 'share';

/** Browser-native export until a branded, server-side conversation report is available. */
export const conversationExportService = {
  async perform(conversation: Conversation, action: ConversationExportAction) {
    const transcript = conversation.messages
      .map(
        (message) =>
          `${message.role === 'assistant' ? 'GreenMind AI' : 'You'}: ${message.content}`,
      )
      .join('\n\n');
    if (action === 'export') {
      window.print();
      return 'Print dialog opened. Select “Save as PDF” to export this conversation.';
    }
    if (navigator.share) {
      try {
        await navigator.share({
          title: `GreenMind AI - ${conversation.title}`,
          text: transcript,
        });
        return 'Sharing options opened for this conversation.';
      } catch {
        return 'Sharing was cancelled.';
      }
    }
    await navigator.clipboard?.writeText(transcript);
    return 'Conversation copied to your clipboard.';
  },
};
