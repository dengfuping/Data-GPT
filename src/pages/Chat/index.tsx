import useDocumentTitle from '@/hooks/useDocumentTitle';
import { PageContainer } from '@oceanbase/ui';
import React from 'react';

interface ChatProps {}

const Chat: React.FC<ChatProps> = () => {
  useDocumentTitle('Chat');

  return (
    <PageContainer
      header={{
        title: 'Chat',
      }}
    />
  );
};

export default Chat;
