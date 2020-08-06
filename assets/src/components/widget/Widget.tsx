import React from 'react';
import {ThemeProvider} from 'theme-ui';
import ChatWindow from './ChatWindow';
import {CustomerMetadata} from './api';
import getThemeConfig from './theme';
import {BASE_URL} from '../../config';

type Props = {
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  accountId: string;
  baseUrl?: string;
  greeting?: string;
  customer?: CustomerMetadata;
  defaultIsOpen?: boolean;
};

const Widget = ({
  accountId,
  title,
  subtitle,
  primaryColor,
  baseUrl,
  greeting,
  customer,
}: Props) => {
  const theme = getThemeConfig({primary: primaryColor});

  return (
    <ThemeProvider theme={theme}>
      <ChatWindow
        title={title || 'Welcome!'}
        subtitle={subtitle || 'How can we help you?'}
        accountId={accountId || 'eb504736-0f20-4978-98ff-1a82ae60b266'}
        greeting={greeting}
        customer={customer}
        baseUrl={baseUrl || BASE_URL}
      />
    </ThemeProvider>
  );
};

export default Widget;
