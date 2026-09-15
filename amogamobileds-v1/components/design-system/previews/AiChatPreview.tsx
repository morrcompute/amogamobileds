import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AiChat } from '../../ui/ai-chat';

export function AiChatPreview() {
  return (
    <View style={styles.previewContainer}>
      <AiChat />
    </View>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    width: '100%',
    height: '100%',
    flex: 1,
    overflow: 'hidden',
  },
});
